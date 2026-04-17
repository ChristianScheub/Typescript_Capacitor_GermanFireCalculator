import { forwardRef } from 'react';

interface RefNumericInputProps {
  label: string;
  unit: string;
  hint?: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number | string;
}

export const RefNumericInput = forwardRef<HTMLInputElement, Readonly<RefNumericInputProps>>(
  (
    {
      label,
      unit,
      hint,
      defaultValue,
      min,
      max,
      step,
    },
    ref,
  ) => {
    return (
      <div className="field">
        <label className="field__label">{label}</label>
        <div className="field__input-wrap">
          {unit === '€' && <span className="field__currency-prefix">€</span>}
          <input
            ref={ref}
            className="field__input"
            type="number"
            inputMode="numeric"
            defaultValue={defaultValue}
            min={min}
            max={max}
            step={step}
          />
          <span className="field__unit">{unit === '€' ? '' : unit}</span>
        </div>
        {hint && <p className="field__hint">{hint}</p>}
      </div>
    );
  },
);

RefNumericInput.displayName = 'RefNumericInput';
