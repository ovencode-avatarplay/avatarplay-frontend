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

const CharacterGridItem: React.FC<CharacterGridItemProps> = ({character, isSelected, onSelect}) => {
  return (
    <Box onClick={onSelect} className={`${styles.gridItem} ${isSelected ? styles.selected : styles.unselected}`}>
      {/* Status Overlay */}
      <Box className={styles.statusOverlay}>
        <Typography variant="body2" className={styles.statusText}>
          {getCharacterStateText(character.visibilityType)}
        </Typography>
      </Box>

      {/* Character Image */}
      <Box className={styles.characterImage} style={{backgroundImage: `url(${character.mainImageUrl})`}} />

      {/* Character Info */}
      <Box className={styles.characterInfo}>
        <Box className={styles.genderIcon}>{character.name === 'Male' ? <MaleIcon /> : <FemaleIcon />}</Box>
        <Typography className={styles.characterName}>{character.name}</Typography>
      </Box>
    </Box>
  );
};

export default CharacterGridItem;
