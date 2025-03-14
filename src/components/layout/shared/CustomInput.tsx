import React, {useState} from 'react';
import styles from './CustomInput.module.css';

type Type = 'Basic' | 'LeftIcon' | 'RightIcon' | 'TwoIcon';
export type InputTextType = 'InputOnly' | 'Label' | 'Hint' | 'LabelandHint';
type State = 'Default' | 'Focused' | 'Typing' | 'Error' | 'Disable';

interface CustomInputProps {
  textType: InputTextType;
  inputType: Type;
  state?: State;
  label?: string | React.ReactNode;
  hint?: string;
  iconLeftImage?: string;
  iconLeftStyle?: React.CSSProperties;
  iconLeft?: React.ReactNode; // Left Icon component
  iconRight?: string | React.ReactNode; // Right Icon component
  value: string | number;
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
  iconLeftImage,
  iconLeftStyle: iconLeftClassName,
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
    let newValue = e.target.value;

    if (onlyNumber) {
      newValue = newValue.replace(/[^0-9]/g, '');
    }
    if (typeof value === 'number') {
      newValue = newValue ? parseFloat(newValue).toString() : '0'; // Ensuring number type is maintained but as a string
    }

    onChange({...e, target: {...e.target, value: newValue}});

    if (!disabled) {
      setCurrentState(newValue ? 'Typing' : 'Focused');
    } else {
      setCurrentState('Disable');
    }
  };

  return (
    <div className={`${styles.inputContainer}  ${customClassName.join(' ')}`}>
      {(textType === 'Label' || textType === 'LabelandHint') && label && (
        <label className={styles.label}>{label}</label>
      )}

      <div
        className={`${styles.textArea} ${styles[currentState]} ${error ? styles.Error : ''} ${
          disabled ? styles.Disabled : ''
        } `}
      >
        {(inputType === 'LeftIcon' || inputType === 'TwoIcon') &&
          (iconLeftImage ? (
            <img
              className={styles.iconLeft}
              src={iconLeftImage}
              alt="Left Icon"
              style={iconLeftClassName} // ✅ 스타일 적용
            />
          ) : (
            <div className={styles.iconLeft} style={iconLeftClassName}>
              {iconLeft}
            </div>
          ))}

        <input
          type="text"
          className={`${styles.textInput} ${value !== '' ? styles.textExist : ''}`}
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
