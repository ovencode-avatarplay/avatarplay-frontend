import React, {CSSProperties} from 'react';
import styles from './CustomContextDropDown.module.css';

export interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: string;
  iconStyle?: CSSProperties;
  labelStyle?: CSSProperties;
  isDanger?: boolean;
}

interface CustomContextDropDownProps {
  items: DropdownItem[];
  open: boolean;
  onClose: () => void;
  style?: CSSProperties; // ✅ 여기에 position 관련 style을 넘김
}

const CustomContextDropDown: React.FC<CustomContextDropDownProps> = ({items, open, onClose, style}) => {
  if (!open) return null;

  return (
    <div className={styles.dropdown} style={style}>
      {items.map((item, index) => (
        <div
          key={index}
          className={`${styles.dropdownItem} ${item.isDanger ? styles.deleteItemLabel : ''}`}
          onClick={() => {
            item.onClick();
            onClose();
          }}
        >
          <span className={item.isDanger ? styles.deleteItemLabel : styles.label} style={item.labelStyle}>
            {item.label}
          </span>
          {item.icon && (
            <img
              src={item.icon}
              className={item.isDanger ? styles.deleteItemIcon : styles.icon}
              style={item.iconStyle}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default CustomContextDropDown;
