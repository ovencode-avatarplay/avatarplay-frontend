import React from 'react';
import styles from './CreateCharacterImageButton.module.css';
import {LineCheck} from '@ui/Icons';

interface ImageButtonProps {
  sizeType: 'small' | 'middle' | 'large'; // sizeType을 props로 받습니다.
  label: string | null;
  image: string;
  color?: string;
  selected: boolean;
  onClick: () => void;
}

const CharacterCreateImageButton: React.FC<ImageButtonProps> = ({sizeType, label, image, color, selected, onClick}) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.imageButton} ${selected ? styles.selected : ''}`} // sizeType에 맞는 클래스를 동적으로 추가
    >
      <div
        className={`${styles.imageBackGround} ${styles[sizeType]} ${selected ? styles.selected : ''} `}
        style={{
          backgroundImage: color
            ? color // color가 있을 때
            : selected
            ? `linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%), url(${image})`
            : `url(${image})`,
        }}
      />
      {label !== null && (
        <div className={`${styles.label} ${selected ? styles.selected : ''}`}>
          <span>{label}</span>
        </div>
      )}
      {selected && <img className={`${styles.selectedIcon} ${styles[sizeType]}`} src={LineCheck.src} />}
    </button>
  );
};

export default CharacterCreateImageButton;
