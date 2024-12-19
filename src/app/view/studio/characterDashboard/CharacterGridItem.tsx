import React from 'react';
import {Box, Typography} from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import styles from './CharacterGridItem.module.css';
import {CharacterInfo} from '@/redux-store/slices/EpisodeInfo';

interface CharacterGridItemProps {
  character: CharacterInfo;
  isSelected: boolean;
  onSelect: () => void;
  hideOverlay?: boolean;
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
  hideOverlay = false,
}) => {
  return (
    <div onClick={onSelect} className={`${styles.gridItem} ${isSelected ? styles.selected : styles.unselected}`}>
      {/* Status Overlay */}
      <div className={`${styles.statusOverlay} ${styles.hide}`}>
        <div className={styles.statusText}>{getCharacterStateText(character.visibilityType)}</div>
      </div>

      {/* Character Image */}
      <div className={styles.characterImage} style={{backgroundImage: `url(${character.mainImageUrl})`}} />

      {/* Character Info */}
      <div className={styles.characterInfo}>
        {/* <div className={styles.genderIcon}>{character.name === 'Male' ? <MaleIcon /> : <FemaleIcon />}</div> */}
        <div className={styles.characterName}>{character.name}</div>
        <div className={`${styles.monetizationLabel} ${character.isMonetization ? styles.original : styles.fan}`}>
          {character.isMonetization ? 'Original' : 'Fan'}
        </div>
      </div>
    </div>
  );
};

export default CharacterGridItem;
