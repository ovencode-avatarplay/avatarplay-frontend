import React from 'react';
import styles from './CharacterGridItem.module.css';
import {CharacterInfo} from '@/redux-store/slices/ContentInfo';
import {BoldLock, LineCheck, LineEdit} from '@ui/Icons';

interface CharacterGridItemProps {
  character: CharacterInfo;
  isSelected: boolean;
  onSelect: () => void;
  showVisibilityType?: boolean;
  canEdit?: boolean;
  onClickEdit?: () => void;
}
export enum CharacterVisibility {
  Private = 0,
  Unlisted = 1,
  Publish = 2,
}

export const CharacterStateDescriptions: Record<CharacterVisibility, string> = {
  [CharacterVisibility.Private]: 'Private',
  [CharacterVisibility.Unlisted]: 'Unlisted',
  [CharacterVisibility.Publish]: 'Publish',
};
export const getCharacterStateText = (state: number): string => {
  if (state in CharacterStateDescriptions) {
    return CharacterStateDescriptions[state as CharacterVisibility];
  }
  return 'Unknown State';
};

const CharacterGridItem: React.FC<CharacterGridItemProps> = ({
  character,
  isSelected,
  onSelect,
  showVisibilityType = false,
  canEdit = false,
  onClickEdit = null,
}) => {
  const handleSelect = (event: React.MouseEvent) => {
    event.stopPropagation();
    onSelect();
  };

  const handleEdit = (event: React.MouseEvent) => {
    if (onClickEdit) {
      event.stopPropagation();
      onClickEdit();
    }
  };

  return (
    <div onClick={handleSelect} className={`${styles.gridItem}`}>
      {/* Status Overlay */}
      <div className={`${styles.statusOverlay} ${styles.hide}`}>
        <div className={styles.statusText}>{getCharacterStateText(character.visibilityType)}</div>
      </div>

      {/* Character Image */}
      <div
        className={`${styles.characterImage} `}
        style={{
          background: isSelected
            ? `linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%), url(${character.mainImageUrl}) lightgray 50% / cover no-repeat`
            : `url(${character.mainImageUrl}) lightgray 50% / cover no-repeat`,
        }}
      >
        {isSelected && <img src={LineCheck.src} className={styles.selectedIcon} />}
        {showVisibilityType && character.visibilityType < 2 && (
          <div className={styles.visibilityOverlay}>
            {character.visibilityType === 0 && <img className={styles.visibilityIcon} src={BoldLock.src} alt="lock" />}
            <div className={styles.visibilityText}>
              {character.visibilityType === 0 ? 'Private' : character.visibilityType === 1 ? 'Unlisted' : ''}
            </div>
          </div>
        )}
      </div>

      {/* Character Info */}
      <div className={styles.infoArea}>
        <div className={styles.characterInfo}>
          {/* <div className={styles.genderIcon}>{character.name === 'Male' ? <MaleIcon /> : <FemaleIcon />}</div> */}
          <div className={styles.nameArea}></div>
          <div className={styles.characterName}>{character.name}</div>
          <div className={`${styles.monetizationLabel} ${character.isMonetization ? styles.original : styles.fan}`}>
            {character.isMonetization ? 'Original' : 'Fan'}
          </div>
        </div>
        {canEdit && onClickEdit && (
          <button className={styles.buttonArea} onClick={handleEdit}>
            <img className={styles.buttonIcon} src={LineEdit.src} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CharacterGridItem;
