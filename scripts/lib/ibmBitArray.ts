// Avkodare för IBM Runtimes serialiserade BitArray.
//
// Kedjan är base64 → zlib → NumPy .npy → bitsträngar per shot. Verifierad mot
// verklig payload från ibm_marrakesh (jobb d9ndf7gqs0bc73e3adu0):
//
//   komprimerat : 78 9c ...                  (zlib)
//   magic       : \x93NUMPY\x01\x00          (npy v1.0)
//   header      : {'descr': '|u1', 'fortran_order': False, 'shape': (4096, 1)}
//   data        : 4096 bytes, en per shot    (2 bitar får plats i en byte)
//
// Vi läser bara det som faktiskt förekommer i IBM:s payload (uint8, C-ordning).
// Allt annat avvisas högljutt hellre än att tolkas fel — en tyst feltolkning av
// råa mätbitar vore den värsta tänkbara felklassen i hela kedjan.

import { inflateSync } from 'node:zlib';

export interface NpyArray {
  data: Uint8Array;
  shape: number[];
}

/** Minimal .npy-läsare: enbart dtype uint8 ('|u1') i C-ordning. */
export function parseNpyUint8(buf: Buffer): NpyArray {
  const magic = buf.subarray(0, 6).toString('latin1');
  if (magic !== '\x93NUMPY') {
    throw new Error(`Ogiltig npy-magic: ${JSON.stringify(magic)}`);
  }
  const major = buf[6];
  // v1.0 har 2-byte headerlängd, v2.0+ har 4.
  const headerLenBytes = major === 1 ? 2 : 4;
  const headerLen =
    major === 1 ? buf.readUInt16LE(8) : buf.readUInt32LE(8);
  const headerStart = 8 + headerLenBytes;
  const header = buf.subarray(headerStart, headerStart + headerLen).toString('latin1');

  const descr = /'descr':\s*'([^']+)'/.exec(header)?.[1];
  if (descr !== '|u1') {
    throw new Error(`Endast uint8 ('|u1') stöds, fick ${JSON.stringify(descr)}`);
  }
  if (/'fortran_order':\s*True/.test(header)) {
    throw new Error('Fortran-ordning stöds inte (IBM levererar C-ordning)');
  }
  const shapeRaw = /'shape':\s*\(([^)]*)\)/.exec(header)?.[1] ?? '';
  const shape = shapeRaw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => Number.parseInt(s, 10));

  const data = new Uint8Array(buf.subarray(headerStart + headerLen));
  const expected = shape.reduce((a, b) => a * b, 1);
  if (data.length !== expected) {
    throw new Error(`Datalängd ${data.length} matchar inte shape ${shape.join('x')} (${expected})`);
  }
  return { data, shape };
}

/**
 * Base64 → (ev. zlib) → npy. IBM komprimerar, men vi provar okomprimerat först
 * om zlib-inflate misslyckas, så att formatvarianter inte tyst tappas bort.
 */
export function decodeNdarrayBase64(b64: string): NpyArray {
  const raw = Buffer.from(b64, 'base64');
  let buf: Buffer;
  try {
    buf = inflateSync(raw);
  } catch {
    buf = raw; // okomprimerad payload
  }
  return parseNpyUint8(buf);
}

/**
 * Bitsträngar per shot, i Qiskits ordning (bits[0] = mest signifikanta = q_{n-1}).
 *
 * IBM packar varje shot i ceil(num_bits/8) bytes, big-endian över bytes.
 * Med num_bits = 2 blir det en byte per shot där värdet 3 = '11', 1 = '01' osv.
 */
export function bitstringsFromNpy(arr: NpyArray, numBits: number): string[] {
  const rowLen = arr.shape.length > 1 ? arr.shape[arr.shape.length - 1] : 1;
  const shots = arr.data.length / rowLen;
  if (!Number.isInteger(shots)) {
    throw new Error(`Datalängd ${arr.data.length} är inte delbar med radlängd ${rowLen}`);
  }
  const out: string[] = new Array(shots);
  for (let s = 0; s < shots; s++) {
    let value = 0n;
    for (let b = 0; b < rowLen; b++) {
      value = (value << 8n) | BigInt(arr.data[s * rowLen + b]);
    }
    out[s] = value.toString(2).padStart(numBits, '0').slice(-numBits);
  }
  return out;
}

// --- Sanerad IBM-resultatfil -----------------------------------------------

export interface IbmPub {
  index: number;
  numBits: number;
  bitstrings: string[];
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/** Läser en sanerad IBM `result.json` och returnerar bitsträngar per PUB. */
export function readIbmResult(json: any): IbmPub[] {
  const pubs = json?.__value__?.pub_results;
  if (!Array.isArray(pubs)) throw new Error('Hittar inte pub_results i resultatfilen');
  return pubs.map((pub: any, index: number) => {
    const fields = pub?.__value__?.data?.__value__?.fields;
    if (!fields) throw new Error(`PUB ${index}: saknar data.fields`);
    const key = Object.keys(fields)[0]; // klassiskt register, typiskt 'c'
    const bitArray = fields[key]?.__value__;
    if (!bitArray) throw new Error(`PUB ${index}: saknar BitArray i fält ${key}`);
    const numBits: number = bitArray.num_bits;
    const b64: string = bitArray.array?.__value__;
    if (typeof b64 !== 'string') throw new Error(`PUB ${index}: ndarray är inte base64`);
    return { index, numBits, bitstrings: bitstringsFromNpy(decodeNdarrayBase64(b64), numBits) };
  });
}
