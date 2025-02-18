import React, {useState} from 'react';
import styles from './CustomDropDownSelectDrawer.module.css';
import {BoldArrowDown} from '@ui/Icons';

interface CustomDropDownSelectDrawerProps {
  title: string;
  selectedItem: string;
  onClick?: () => void;
}

const CustomDropDownSelectDrawer: React.FC<CustomDropDownSelectDrawerProps> = ({title, selectedItem, onClick}) => {
  return (
    <div className={styles.dropDownArea}>
      <h2 className={styles.title2}>{title}</h2>
      <div className={styles.selectItem}>
        <div className={styles.selectItemText}>{selectedItem}</div>
        <button className={styles.selectItemButton} onClick={() => onClick()}>
          <img className={styles.selectItemIcon} src={BoldArrowDown.src} alt="Dropdown Icon" />
        </button>
      </div>
    </div>
  );
};

export default CustomDropDownSelectDrawer;
