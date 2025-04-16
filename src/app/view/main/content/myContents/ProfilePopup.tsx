import React from 'react';
import styles from './ProfilePopup.module.css';
import CustomInput, {InputTextType} from '@/components/layout/shared/CustomInput';
import CustomButton from '@/components/layout/shared/CustomButton';
import {BadgeType} from './01_Layout/MessageProfile';

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
  profileImage: string;
  profileName: string;
  profileDesc: string;
  badgeType: BadgeType;
}

const ProfilePopup: React.FC<PopupProps> = ({
  type,
  description,
  buttons,
  textButton,
  inputField,
  onClose,
  children,
  profileImage,
  profileName,
  profileDesc,
  badgeType,
}) => {
  const renderBadge = () => {
    if (badgeType === BadgeType.Fan) {
      return <span className={styles.fanBadge}>Fan</span>;
    }
    if (badgeType === BadgeType.Original) {
      return <span className={styles.originalBadge}>Original</span>;
    }
    return null;
  };

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupContainer} onClick={e => e.stopPropagation()}>
        <div className={styles.popupTextArea}>
          {/* Title */}
          <div className={styles.popupTitle}>
            <div className={styles.container}>
              {/* 프로필 이미지 */}
              <div className={styles.profileContainer}>
                <img src={profileImage} alt="Profile" className={styles.profileImage} />
              </div>
              {/* 프로필 정보 */}
              <div className={styles.profileInfo}>
                <div className={styles.profileTop}>
                  <span className={styles.profileName}>{profileName}</span>
                  {renderBadge()}
                </div>
                <span className={styles.profileDesc}>asas</span>
              </div>
            </div>
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

export default ProfilePopup;
