interface NumericInputProps {
  label: string;
  value: number;
  unit: string;
  onChange: (v: number) => void;
  hint?: string;
}

export function NumericInput({
  label,
  value,
  unit,
  onChange,
  hint,
}: NumericInputProps) {
  return (
    <div className="field">
      <label className="field__label">{label}</label>
      <div className="field__input-wrap">
        {unit === '€' && <span className="field__currency-prefix">€</span>}
        <input
          className="field__input"
          type="number"
          inputMode="numeric"
          value={value}
          onChange={e => onChange(Number(e.target.value))}
        />
        <span className="field__unit">{unit !== '€' ? unit : ''}</span>
      </div>
      {hint && <p className="field__hint">{hint}</p>}
    </div>
  );
}
