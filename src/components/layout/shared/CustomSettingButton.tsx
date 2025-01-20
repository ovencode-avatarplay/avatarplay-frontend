import React from 'react';
import {LineArrowRight} from '@ui/Icons';
import styles from './CustomSettingButton.module.css';
import CustomToggleButton from './CustomToggleButton';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';

interface SettingItemProps {
  type: 'text' | 'toggle' | 'select';
  name: string;
  selectedValue: string | number;
  onClick: () => void | null;
  onToggle?: () => void | null;
  items?: SelectDrawerItem[] | null;
  isToggled?: boolean | null;
  isOpen?: boolean | null;
  selectedIndex?: number | null;
  onClose?: () => void | null;
}

const CustomSettingButton: React.FC<SettingItemProps> = ({
  type,
  name,
  selectedValue,
  onClick,
  onToggle,
  items,
  isToggled,
  isOpen,
  selectedIndex,
  onClose,
}) => {
  return (
    <div className={styles.settingItem}>
      <div className={styles.settingTextArea}>
        <div className={styles.settingName}>{name}</div>
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
      ) : (
        <button className={styles.settingButtonArea} onClick={onClick}>
          <img className={styles.settingButtonIcon} src={LineArrowRight.src} />
        </button>
      )}
    </div>
  );
};

export default CustomSettingButton;
