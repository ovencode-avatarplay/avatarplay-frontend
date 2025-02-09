import React, {useState} from 'react';
import styles from './CustomDropDown.module.css'; // 드롭다운 스타일

// 아이콘들
import {BoldArrowDown, LineArrowDown, LineCheck} from '@ui/Icons';

interface CustomDropDownProps {
  items: Array<{
    label: string;
    icon?: string;
    profileImage?: string;
    logoImage?: string;
    value: string | number;
  }>;
  displayType: 'Text' | 'Icon' | 'TwoIcon' | 'Profile' | 'Logo';
  onSelect: (value: string | number) => void;
  style?: React.CSSProperties;
}

const CustomDropDown: React.FC<CustomDropDownProps> = ({items, displayType, onSelect, style}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | number | null>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (value: string | number) => {
    setSelectedItem(value);
    onSelect(value);
    setIsOpen(false);
  };

  const renderItem = (item: any, index: number) => {
    const isSelected = selectedItem === item.value;
    const itemClass = isSelected ? styles.selected : styles.normal;

    return (
      <div
        key={index}
        className={`${styles.item} ${itemClass} ${isSelected ? styles.selected : ''} ${styles.focused}`}
        onClick={() => handleItemClick(item.value)}
      >
        {displayType === 'Text' && <span>{item.label}</span>}
        {displayType === 'Icon' && (
          <>
            <img src={item.icon} alt={item.label} className={styles.icon} />
            <span>{item.label}</span>
          </>
        )}
        {displayType === 'TwoIcon' && (
          <>
            <img src={item.icon} alt={item.label} className={styles.icon} />
            <span>{item.label}</span>
            <img src={item.icon} alt="right icon" className={styles.iconRight} />
          </>
        )}
        {displayType === 'Profile' && item.profileImage && (
          <>
            <img src={item.profileImage} alt="profile" className={styles.profileImage} />
            <span>{item.label}</span>
          </>
        )}
        {displayType === 'Logo' && item.logoImage && (
          <>
            <img src={item.logoImage} alt="logo" className={styles.logoImage} />
            <span>{item.label}</span>
          </>
        )}
        {isSelected && <img src={LineCheck.src} alt="selected" className={styles.checkIcon} />}
      </div>
    );
  };

  return (
    <div className={styles.dropdown} style={style}>
      <div className={styles.selectedItem} onClick={toggleDropdown}>
        {selectedItem ? (
          <>
            <div className={styles.titleArea}>
              {items.find(item => item.value === selectedItem)?.icon && (
                <img
                  src={items.find(item => item.value === selectedItem)?.icon || ''}
                  alt="selected icon"
                  className={styles.icon}
                />
              )}
              <span>{items.find(item => item.value === selectedItem)?.label}</span>
            </div>
            <img
              className={styles.dropdownArrow}
              src={BoldArrowDown.src}
              style={isOpen ? {transform: 'rotate(180deg)'} : {}}
            />
          </>
        ) : (
          'Select an option'
        )}
      </div>
      {isOpen && <div className={styles.dropdownMenu}>{items.map((item, index) => renderItem(item, index))}</div>}
    </div>
  );
};

export default CustomDropDown;
