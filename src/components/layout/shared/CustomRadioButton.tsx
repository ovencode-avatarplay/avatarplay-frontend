import React from 'react';
import styles from './CustomRadioButton.module.css';
import {
  BoldRadioButton,
  BoldRadioButtonSelected,
  BoldRadioButtonSquare,
  BoldRadioButtonSquareSelected,
} from '@ui/Icons';

interface CustomRadioButtonProps {
  shapeType: 'circle' | 'square';
  displayType: 'buttonOnly' | 'buttonText';
  onSelect: (value: string | number) => void;
  value: string | number;
  selectedValue: string | number | null;
  label?: string;
}

const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({
  shapeType,
  displayType,
  label,
  onSelect,
  value,
  selectedValue,
}) => {
  const isSelected = selectedValue === value;

  const buttonImage = shapeType === 'circle' ? BoldRadioButton.src : BoldRadioButtonSquare.src;
  const selectedImg = shapeType === 'circle' ? BoldRadioButtonSelected.src : BoldRadioButtonSquareSelected.src;

  const handleClick = () => {
    onSelect(value);
  };

  // 라디오 버튼의 스타일을 조건에 맞게 설정
  const radioButtonStyle = shapeType === 'circle' ? styles.circle : styles.square;
  const buttonClass = displayType === 'buttonOnly' ? styles.buttonOnly : styles.buttonText;

  return (
    <div className={`${styles.radioButtonContainer} ${radioButtonStyle} ${buttonClass}`} onClick={handleClick}>
      <img
        className={styles.buttonImage}
        src={isSelected ? selectedImg : buttonImage} // 선택된 상태이면 selectedImg 사용
        alt="Radio Button"
      />
      {displayType === 'buttonText' && <span className={styles.buttonText}>{label}</span>}
    </div>
  );
};

export default CustomRadioButton;
