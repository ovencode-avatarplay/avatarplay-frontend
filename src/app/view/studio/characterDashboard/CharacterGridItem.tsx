import React from 'react';
import {Box, Typography} from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import styles from './CharacterGridItem.module.css';

interface Character {
  id: number;
  status: 'Publish' | 'Draft' | string;
  image: string;
  name: string;
  gender: 'Male' | 'Female' | string;
}

interface CharacterGridItemProps {
  character: Character;
  isSelected: boolean;
  onSelect: () => void;
}

const CharacterGridItem: React.FC<CharacterGridItemProps> = ({character, isSelected, onSelect}) => {
  return (
    <Box onClick={onSelect} className={`${styles.gridItem} ${isSelected ? styles.selected : styles.unselected}`}>
      {/* Status Overlay */}
      <Box className={styles.statusOverlay}>
        <Typography variant="body2" className={styles.statusText}>
          {character.status}
        </Typography>
      </Box>

      {/* Character Image */}
      <Box className={styles.characterImage} style={{backgroundImage: `url(${character.image})`}} />

      {/* Character Info */}
      <Box className={styles.characterInfo}>
        <Box className={styles.genderIcon}>{character.gender === 'Male' ? <MaleIcon /> : <FemaleIcon />}</Box>
        <Typography className={styles.characterName}>{character.name}</Typography>
      </Box>
    </Box>
  );
};

export default CharacterGridItem;
