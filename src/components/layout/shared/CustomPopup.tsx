import React from 'react';
import styles from './CustomPopup.module.css';
import CustomButton from './CustomButton';
import CustomInput, {InputTextType} from './CustomInput';

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
  textType?: InputTextType;
  label?: string | React.ReactNode;
}

interface PopupProps {
  type: PopupType;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  buttons: PopupButton[];
  textButton?: PopupButton;
  inputField?: InputField;
  onClose?: () => void;
  children?: React.ReactNode;
}

const CustomPopup: React.FC<PopupProps> = ({
  type,
  title,
  description,
  buttons,
  textButton,
  inputField,
  onClose,
  children,
}) => {
  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupContainer} onClick={e => e.stopPropagation()}>
        <div className={styles.popupTextArea}>
          {/* Title */}
          <div className={styles.popupTitle}>
            {typeof title === 'string'
              ? title.split('<br>').map((line, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <br />}
                    {line}
                  </React.Fragment>
                ))
              : title}
          </div>
          {/* Description */}
          {description && (
            <div className={styles.popupDescription} style={{whiteSpace: 'pre-wrap'}}>
              {typeof description === 'string'
                ? description.split('<br>').map((line, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <br />}
                      {line}
                    </React.Fragment>
                  ))
                : description}
            </div>
          )}
        </div>

        {/* Input Field */}
        {inputField && (
          <div className={styles.popupInputField}>
            <CustomInput
              inputType="Basic"
              textType={inputField.textType ? inputField.textType : 'InputOnly'}
              label={inputField.textType !== 'InputOnly' && inputField.label ? inputField.label : ''}
              value={inputField.value}
              onChange={e => {
                inputField.onChange(e);
              }}
              placeholder={inputField.placeholder}
            ></CustomInput>
          </div>
        )}

        {children && <div className={styles.childrenArea}>{children}</div>}
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
