import React, {useState} from 'react';
import styles from './CustomInput.module.css';

type Type = 'Basic' | 'LeftIcon' | 'RightIcon' | 'TwoIcon';
type Text = 'InputOnly' | 'Label' | 'Hint' | 'LabelandHint';
type State = 'Default' | 'Focused' | 'Typing' | 'Error' | 'Disable';

interface CustomInputProps {
  textType: Text;
  inputType: Type;
  state?: State;
  label?: string;
  hint?: string;
  iconLeft?: React.ReactNode; // Left Icon component
  iconRight?: React.ReactNode; // Right Icon component
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  maxLength?: number;
  customClassName?: string[];
  onlyNumber?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
  textType,
  inputType,
  state = 'Default',
  label,
  hint,
  iconLeft,
  iconRight,
  value,
  onChange,
  placeholder = '',
  error = false,
  disabled = false,
  maxLength,
  customClassName = [],
  onlyNumber,
}) => {
  const [currentState, setCurrentState] = useState<State>(state);

  const handleFocus = () => {
    if (!disabled) {
      setCurrentState('Focused');
    } else {
      setCurrentState('Disable');
    }
  };

  const handleBlur = () => {
    if (!disabled) {
      setCurrentState('Default');
    } else {
      setCurrentState('Disable');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onlyNumber) {
      value = value.replace(/[^0-9]/g, '');
    }

    onChange({...e, target: {...e.target, value}});
    if (!disabled) {
      setCurrentState(e.target.value ? 'Typing' : 'Focused');
    } else {
      setCurrentState('Disable');
    }
  };

  return (
    <div className={`${styles.inputContainer} ${customClassName} `}>
      {(textType === 'Label' || textType === 'LabelandHint') && label && (
        <label className={styles.label}>{label}</label>
      )}

      <div
        className={`${styles.textArea} ${styles[currentState]} ${error ? styles.Error : ''} ${
          disabled ? styles.Disabled : ''
        } `}
      >
        {(inputType === 'LeftIcon' || inputType === 'TwoIcon') && <div className={styles.iconLeft}>{iconLeft}</div>}
        <input
          type="text"
          className={styles.textInput}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
        />
        {(inputType === 'RightIcon' || inputType === 'TwoIcon') && <div className={styles.iconRight}>{iconRight}</div>}
      </div>

      {(textType === 'Hint' || textType === 'LabelandHint') && hint && <div className={styles.hint}>{hint}</div>}
    </div>
  );
};

export default CustomInput;
