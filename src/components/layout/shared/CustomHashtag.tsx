import React, {useState} from 'react';
import styles from './CustomHashtag.module.css'; // 스타일을 이 파일에서 import

interface CustomHashtagProps {
  text: string;
  onClickAction: () => void;
  isSelected: boolean;
  color?: string;
  selectedClassName?: string | null;
  unselectedClassName?: string | null;
}

const CustomHashtag: React.FC<CustomHashtagProps> = ({
  text,
  onClickAction,
  isSelected,
  color,
  selectedClassName,
  unselectedClassName,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getButtonClass = () => {
    if (selectedClassName !== undefined && selectedClassName !== '') {
      if (isSelected) return selectedClassName;
    }
    if (unselectedClassName !== undefined && unselectedClassName !== '') {
      if (!isSelected) return unselectedClassName;
    }
    if (isSelected) return styles.active;
    if (isHovered) return styles.hover;
    return styles.default;
  };

  return (
    <button
      className={`${styles.customHashtag} ${getButtonClass()}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onClick={() => {
        onClickAction();
      }}
    >
      {color && <span className={styles.colorCircle} style={{background: color}}></span>}
      {text}
    </button>
  );
};

export default CustomHashtag;
