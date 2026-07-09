// Händelseschema — katalogens gemensamma språk (CLAUDE.md §9, B-rapporten §6).
// Delas av A (HBT-kanaler) och B/C/D/E/F (polarisationsarmar), se kommentarer per fält.

export type Arm = 'A' | 'B';
export type Channel = 'D1' | 'D2';
export type Basis = 'HV' | 'DA' | 'RL';
export type Outcome = '+' | '-';
export type CHSHSetting = 0 | 1;

export type QualityFlag =
  | 'background'
  | 'afterpulse'
  | 'crosstalk'
  | 'deadTimeVeto';

export interface PhotonEvent {
  id: number;
  /** Sann emissionstid (s), källans klocka. */
  t: number;
  /** Detekterad tid (s), efter jitter. Analys ska alltid använda detta fält. */
  detectedT: number;
  /**
   * HBT-utgångsport (50/50-stråldelare i detektorsteget). Används av Signatur A:s
   * korskorrelation. Tilldelas i detektorpipelinen, aldrig av källan.
   */
  channel: Channel;
  /**
   * Fysisk mätarm för parkällor (entangled). Tilldelas av källan vid emission.
   * Odefinierad för enkanalskällor (thermal/coherent/singleEmitter) som saknar
   * en andra arm — de använder `channel` istället.
   */
  arm?: Arm;
  /** Analysbas vid detektion (HV/DA/RL) — endast för polarisationskällor. */
  basis?: Basis;
  /** Binärt utfall inom vald bas. */
  pol?: Outcome;
  /** CHSH-analysatorinställning per arm (Signatur C). */
  setting?: CHSHSetting;
  isBackground: boolean;
  flags: QualityFlag[];
}

export interface EventStream {
  events: PhotonEvent[];
  duration: number;
  seed: number;
  /** Sant genererad frekvens (Hz), före förlust — för diagnostik. */
  sourceRate: number;
}

/** En "session" = ett observationstillfälle med fryst konfiguration (D-rapporten §8). */
export interface Session {
  sessionId: string;
  stream: EventStream;
}
