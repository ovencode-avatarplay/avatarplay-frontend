import React, {useEffect, useState} from 'react';
import styles from './CreateCharacterImageButton.module.css';
import {BoldRadioButton, BoldRadioButtonSelected, LineCheck} from '@ui/Icons';
import {NextEpisodeWait} from '@ui/chatting';
import getLocalizedText from '@/utils/getLocalizedText';

interface ImageButtonProps {
  sizeType: 'small' | 'middle' | 'large' | 'summary' | 'result' | 'portrait';
  selectType?: 'one' | 'multiple';
  selectButtonType?: 'image' | 'button';
  label: string | null;
  image: string;
  color?: string;
  selected: boolean;
  onSelectClick: () => void;
  onImageClick?: () => void;
  isImageLoading?: boolean;
  skipLocalize?: boolean;
}

const CharacterCreateImageButton: React.FC<ImageButtonProps> = ({
  sizeType,
  selectType = 'one',
  selectButtonType = 'image',
  label,
  image,
  color,
  selected,
  onSelectClick,
  onImageClick,
  isImageLoading = false,
  skipLocalize = false,
}) => {
  const [localImageLoading, setLocalImageLoading] = useState<boolean>(isImageLoading); // 로컬 이미지 로딩 상태 관리

  useEffect(() => {
    setLocalImageLoading(isImageLoading); // props의 isImageLoading 값 우선
  }, [isImageLoading]);

  const handleImageLoad = () => {
    setLocalImageLoading(false);
  };

  const handleImageError = () => {
    setLocalImageLoading(false);
  };
  return (
    <button
      onClick={selectButtonType === 'image' ? onSelectClick : onImageClick}
      className={`${styles.imageButton} ${styles[sizeType]} ${selected ? styles.selected : ''}`} // sizeType에 맞는 클래스를 동적으로 추가
    >
      <div
        className={`${styles.imageBackGround} ${styles[sizeType]} ${selected ? styles.selected : ''} `}
        style={{
          backgroundImage: color
            ? color // color가 있을 때
            : selected
            ? `linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%), url(${image})`
            : `url(${image})`,
          backgroundColor: color ? color : `linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%),`,
        }}
      >
        {localImageLoading && (
          <div className={styles.processingArea}>
            <img className={styles.loading} src={NextEpisodeWait.src} />
            <span className={styles.processingText}>{getLocalizedText('TODO : Localize 필요 : 생성중')}</span>
          </div>
        )}
      </div>
      {label !== null && (
        <div
          className={`${styles.label} ${selected ? styles.selected : ''}`}
          onClick={e => {
            e.stopPropagation();
            onSelectClick();
          }}
        >
          <span>{skipLocalize ? label : getLocalizedText(label)}</span>
        </div>
      )}
      {selected && selectType !== 'multiple' && selectButtonType === 'image' ? (
        <img
          className={`${styles.selectedIcon} ${styles[sizeType]}`}
          src={LineCheck.src}
          onClick={e => {
            e.stopPropagation();
            onSelectClick();
          }}
        />
      ) : selectButtonType === 'button' ? (
        <img
          className={`${styles.multiSelIcon}`}
          src={selected ? BoldRadioButtonSelected.src : BoldRadioButton.src}
          onClick={e => {
            e.stopPropagation();
            onSelectClick();
          }}
        />
      ) : (
        ''
      )}

      {selectType === 'multiple' && !isImageLoading && (
        <img
          className={`${styles.multiSelIcon}`}
          src={selected ? BoldRadioButtonSelected.src : BoldRadioButton.src}
          onClick={e => {
            e.stopPropagation();
            onSelectClick();
          }}
        />
      )}

      {/* 이미지 로딩 확인을 위한 숨겨진 이미지 */}
      <img
        src={image || ''}
        alt="Character"
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{display: 'none'}}
      />
    </button>
  );
};

export default CharacterCreateImageButton;
