import React from 'react';
import styles from './DropDownMenu.module.css';

export interface DropDownMenuItem {
  name: string;
  icon: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean; // 조건에따른 비활성화 옵션
  isRed?: boolean; // 위험 동작 표시 (Delete 등)
}

interface DropDownMenuProps {
  items: DropDownMenuItem[];
  className?: string; //  추가적으로 세팅될 클래스네임
  onClose: () => void;
}

const DropDownMenu: React.FC<DropDownMenuProps> = ({items, className, onClose}) => {
  return (
    <>
      <div
        className={styles.editDropdDownBack}
        onClick={e => {
          e.stopPropagation();
          onClose();
        }}
      ></div>
      <div className={`${styles.dropDownMenu} ${className || ''}`}>
        {items.map((item, idx) => (
          <>
            {!item.disabled && (
              <button
                key={idx}
                className={`${styles.dropDownItem} ${idx === items.length - 1 ? styles.lastItem : ''}`}
                onClick={e => {
                  e.stopPropagation();
                  if (!item.disabled) {
                    item.onClick(e);
                  }
                }}
              >
                <div className={`${styles.dropDownName} ${item.isRed ? styles.redText : ''}`}>{item.name}</div>
                <div className={styles.dropDownIconBox}>
                  <img
                    className={`${styles.dropDownIcon} ${item.isRed ? styles.redIcon : styles.blackIcon}`}
                    src={item.icon}
                    alt={`${item.name} icon`}
                  />
                </div>
              </button>
            )}
          </>
        ))}
      </div>
    </>
  );
};

export default DropDownMenu;
