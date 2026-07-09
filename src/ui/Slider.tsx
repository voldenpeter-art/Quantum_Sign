interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  hint?: string;
}

export function Slider({ label, value, min, max, step, unit, onChange, format, hint }: SliderProps) {
  const display = format ? format(value) : value.toString();
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="flex items-center justify-between text-neutral-300">
        <span>{label}</span>
        <span className="font-mono text-neutral-100">
          {display}
          {unit ? ` ${unit}` : ''}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-fuchsia-500"
      />
      {hint && <span className="text-xs text-neutral-500">{hint}</span>}
    </label>
  );
}
