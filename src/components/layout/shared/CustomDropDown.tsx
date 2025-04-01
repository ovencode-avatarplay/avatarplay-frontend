import React, {useEffect, useRef, useState} from 'react';
import styles from './CustomDropDown.module.css'; // 드롭다운 스타일

// 아이콘들
import {BoldArrowDown, BoldRadioButtonSelected, LineArrowDown, LineCheck} from '@ui/Icons';

interface CustomDropDownProps {
  items: Array<{
    label: string;
    value: string | number;
    icon?: string;
    profileImage?: string;
    logoImage?: string;
    title?: string;
  }>;
  displayType: 'Text' | 'Icon' | 'TwoIcon' | 'Profile' | 'Logo';
  textType?: 'Label' | 'TitleLabel';
  initialValue?: string | number;
  onSelect: (value: string | number) => void;
  style?: React.CSSProperties;
  placeholder?: string;
}

const CustomDropDown: React.FC<CustomDropDownProps> = ({
  items,
  displayType,
  textType = 'Label',
  initialValue,
  onSelect,
  style,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | number | null>(initialValue || null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (value: string | number) => {
    setSelectedItem(value);
    onSelect(value);
    setIsOpen(false);
  };

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      if (initialValue !== undefined && items.length > 0) {
        const foundItem = items.find(item => String(item.value) === String(initialValue));

        if (foundItem) {
          handleItemClick(foundItem.value);
        } else {
          console.warn(
            `Initial value "${initialValue}" does not match any item in dropdown.
            Ensure that initialValue and items[].value are of the same type.`,
          );
        }
      }
      isFirstRender.current = false;
    }
  }, [initialValue, items]);

  const renderItem = (item: any, index: number) => {
    const isSelected = selectedItem === item.value;
    const itemClass = isSelected ? styles.selected : styles.normal;

    return (
      <>
        <div
          key={index}
          className={`${styles.item} ${itemClass} ${isSelected ? styles.selected : ''} ${styles.focused}`}
          onClick={() => handleItemClick(item.value)}
        >
          {displayType === 'Icon' && <img src={item.icon} alt={item.label} className={styles.icon} />}
          {displayType === 'TwoIcon' && <img src={item.icon} alt={item.label} className={styles.icon} />}
          {displayType === 'Profile' && item.profileImage && (
            <img src={item.profileImage} alt="profile" className={styles.profileImage} />
          )}
          {displayType === 'Logo' && item.logoImage && (
            <img src={item.logoImage} alt="logo" className={styles.logoImage} />
          )}
          {textType === 'Label' && <span className={styles.label}>{item.label}</span>}
          {textType === 'TitleLabel' && (
            <div className={styles.textArea}>
              <span className={styles.title}>{item.title}</span>
              <span className={styles.label}>{item.label}</span>
            </div>
          )}

          {displayType === 'TwoIcon' && <img src={item.icon} alt="right icon" className={styles.iconRight} />}
          {isSelected && <img src={BoldRadioButtonSelected.src} alt="selected" className={styles.checkIcon} />}
        </div>
        <div className={styles.divider} />
      </>
    );
  };

  return (
    <div className={styles.dropdown} style={style}>
      <div className={`${styles.selectedDropDown} ${isOpen ? styles.focusedDropDown : ''}`} onClick={toggleDropdown}>
        {selectedItem !== null && selectedItem !== undefined ? (
          <>
            <div className={styles.titleArea}>
              {(() => {
                const selected = items.find(item => item.value === selectedItem);
                if (!selected) return null;

                return (
                  <>
                    {displayType === 'Icon' && selected.icon && (
                      <img src={selected.icon} alt="selected icon" className={styles.icon} />
                    )}
                    {displayType === 'TwoIcon' && selected.icon && (
                      <>
                        <img src={selected.icon} alt="selected icon" className={styles.icon} />
                        <img src={selected.icon} alt="selected right icon" className={styles.iconRight} />
                      </>
                    )}
                    {displayType === 'Profile' && selected.profileImage && (
                      <img src={selected.profileImage} alt="profile" className={styles.profileImage} />
                    )}
                    {displayType === 'Logo' && selected.logoImage && (
                      <img src={selected.logoImage} alt="logo" className={styles.logoImage} />
                    )}
                    {textType === 'Label' && <span className={styles.label}>{selected.label}</span>}
                    {textType === 'TitleLabel' && (
                      <div className={styles.textArea}>
                        <span className={styles.title}>{selected.title}</span>
                        <span className={styles.label}>{selected.label ? selected.label : selected.value}</span>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
            <img
              className={styles.dropdownArrow}
              src={BoldArrowDown.src}
              style={isOpen ? {transform: 'rotate(180deg)'} : {}}
            />
          </>
        ) : (
          <>
            <div className={styles.label}>{placeholder}</div>
            <img
              className={styles.dropdownArrow}
              src={BoldArrowDown.src}
              style={isOpen ? {transform: 'rotate(180deg)'} : {}}
            />
          </>
        )}
      </div>
      {isOpen && <div className={styles.dropdownMenu}>{items.map((item, index) => renderItem(item, index))}</div>}
    </div>
  );
};

export default CustomDropDown;
