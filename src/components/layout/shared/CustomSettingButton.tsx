import React from 'react';
import {LineArrowRight} from '@ui/Icons';
import styles from './CustomSettingButton.module.css';
import CustomToggleButton from './CustomToggleButton';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import CustomPopup from './CustomPopup';

interface SettingItemProps {
  type: 'text' | 'toggle' | 'select' | 'popup';
  icon?: string;
  name: string;
  selectedValue: string | number;
  textClick?: boolean;
  onClick: () => void | null;
  onToggle?: () => void | null;
  items?: SelectDrawerItem[] | null;
  isToggled?: boolean | null;
  isOpen?: boolean | null;
  selectedIndex?: number | null;
  onClose?: () => void | null;
  onAction?: () => void | null;
  iconStyle?: React.CSSProperties;
  nameStyle?: React.CSSProperties;
}

const CustomSettingButton: React.FC<SettingItemProps> = ({
  type,
  icon,
  name,
  selectedValue,
  textClick = false,
  onClick,
  onToggle,
  items,
  isToggled,
  isOpen,
  selectedIndex,
  onClose,
  onAction,
  iconStyle,
  nameStyle,
}) => {
  return (
    <div className={styles.settingItem}>
      <div className={styles.settingTextArea} onClick={textClick ? onClick : undefined}>
        <div className={styles.nameArea}>
          {icon && <img className={`${styles.settingIcon}`} src={icon} alt="icon" style={iconStyle} />}
          <div className={styles.settingName} style={nameStyle}>
            {name}
          </div>
        </div>
        <div className={styles.settingSelected}>{selectedValue}</div>
      </div>
      {type === 'select' && items && onClose && selectedIndex !== undefined && selectedIndex !== null ? (
        <>
          <button className={styles.settingButtonArea} onClick={onClick}>
            <img className={styles.settingButtonIcon} src={LineArrowRight.src} />
          </button>
          {/* SelectDrawer 컴포넌트는 여기서 렌더링 */}
          <SelectDrawer items={items} isOpen={isOpen || false} onClose={onClose} selectedIndex={selectedIndex} />
        </>
      ) : type === 'toggle' && isToggled !== null && onToggle ? (
        <CustomToggleButton size="lg" isToggled={isToggled || false} onToggle={onToggle} />
      ) : type === 'popup' && isOpen !== null ? (
        <>
          {!textClick && (
            <button className={styles.settingButtonArea} onClick={onClick}>
              <img className={styles.settingButtonIcon} src={LineArrowRight.src} />
            </button>
          )}
          {isOpen && (
            <CustomPopup
              type="alert"
              title="Are you sure?"
              description="Deleting your character is irreversible"
              buttons={[
                {
                  label: 'Cancel',
                  onClick: () => {
                    if (onClose) onClose();
                  },
                  isPrimary: false,
                },
                {
                  label: 'Delete',
                  onClick: () => {
                    if (onAction) onAction();
                  },
                  isPrimary: true,
                },
              ]}
            />
          )}
        </>
      ) : (
        <button className={styles.settingButtonArea} onClick={onClick}>
          <img className={styles.settingButtonIcon} src={LineArrowRight.src} />
        </button>
      )}
    </div>
  );
};

export default CustomSettingButton;
