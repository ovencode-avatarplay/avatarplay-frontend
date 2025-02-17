import React from 'react';
import styles from './CustomCheckBox.module.css';
import {LineCheckBoxFill, LineCheckBoxEmpty} from '@ui/Icons';

interface CustomCheckboxProps {
  shapeType: 'circle' | 'square';
  displayType: 'buttonOnly' | 'buttonText';
  onToggle: (checked: boolean) => void; // `value` 제거하고 boolean 값 전달
  checked: boolean; // boolean 값 사용
  label?: string;
  containerStyle?: React.CSSProperties;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  shapeType,
  displayType,
  label,
  onToggle,
  checked,
  containerStyle,
}) => {
  const checkboxImage = shapeType === 'circle' ? LineCheckBoxEmpty.src : LineCheckBoxEmpty.src;
  const checkedImg = shapeType === 'circle' ? LineCheckBoxFill.src : LineCheckBoxFill.src;

  const handleClick = () => {
    onToggle(!checked);
  };

  const checkboxStyle = shapeType === 'circle' ? styles.circle : styles.square;
  const buttonClass = displayType === 'buttonOnly' ? styles.buttonOnly : styles.buttonText;

  return (
    <div
      className={`${styles.checkboxContainer} ${checkboxStyle} ${buttonClass}`}
      onClick={handleClick}
      style={containerStyle}
    >
      <img className={styles.buttonImage} src={checked ? checkedImg : checkboxImage} alt="Checkbox" />
      {displayType === 'buttonText' && <span className={styles.buttonText}>{label}</span>}
    </div>
  );
};

export default CustomCheckbox;
