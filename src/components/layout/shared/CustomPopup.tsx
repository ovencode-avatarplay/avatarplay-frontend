import React from 'react';
import styles from './CustomPopup.module.css';
import CustomButton from './CustomButton';
import CustomInput from './CustomInput';

type PopupType = 'alert' | 'error' | 'input';

interface PopupButton {
  label: string;
  onClick: () => void;
  isPrimary?: boolean;
}

interface InputField {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; // 입력 필드의 힌트 텍스트
  maxLength?: number; // 최대 글자 수
}

interface PopupProps {
  type: PopupType;
  title: string;
  description?: string;
  buttons: PopupButton[];
  textButton?: PopupButton;
  inputField?: InputField;
  onClose?: () => void;
}

const CustomPopup: React.FC<PopupProps> = ({type, title, description, buttons, textButton, inputField, onClose}) => {
  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupContainer} onClick={e => e.stopPropagation()}>
        <div className={styles.popupTextArea}>
          {/* Title */}
          <div className={styles.popupTitle}>{title}</div>
          {/* Description */}
          {description && (
            <div className={styles.popupDescription} style={{whiteSpace: 'pre-wrap'}}>
              {description}
            </div>
          )}
        </div>

        {/* Input Field */}
        {inputField && (
          <div className={styles.popupInputField}>
            <CustomInput
              inputType="Basic"
              textType="InputOnly"
              value={inputField.value}
              onChange={e => {
                inputField.onChange(e);
              }}
              placeholder={inputField.placeholder}
            ></CustomInput>
          </div>
        )}

        {/* Buttons */}
        <div className={styles.popupButtons}>
          {buttons.map((button, idx) => (
            <CustomButton
              key={idx}
              size="Medium"
              state="Normal"
              type={button.isPrimary ? 'Primary' : 'Secondary'}
              customClassName={[styles.popupButton]}
              onClick={button.onClick}
            >
              {button.label}
            </CustomButton>
          ))}
        </div>

        {/* TextButton */}
        {textButton && (
          <button className={styles.textButton} onClick={textButton.onClick}>
            {textButton.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomPopup;