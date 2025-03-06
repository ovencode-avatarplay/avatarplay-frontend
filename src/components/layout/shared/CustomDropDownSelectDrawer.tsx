import React, {useState} from 'react';
import styles from './CustomDropDownSelectDrawer.module.css';
import {BoldArrowDown} from '@ui/Icons';
import CustomSelector from './CustomSelector';

interface CustomDropDownSelectDrawerProps {
  title: string;
  selectedItem: string;
  onClick?: () => void;
  error?: boolean;
}

const CustomDropDownSelectDrawer: React.FC<CustomDropDownSelectDrawerProps> = ({
  title,
  selectedItem,
  error,
  onClick,
}) => {
  return (
    <div className={styles.dropDownArea}>
      <h2 className={styles.title2}>{title}</h2>
      <CustomSelector
        value={selectedItem}
        error={error}
        onClick={() => {
          if (onClick) {
            onClick();
          }
        }}
      />
    </div>
  );
};

export default CustomDropDownSelectDrawer;
