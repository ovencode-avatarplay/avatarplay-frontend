import React, {useState} from 'react';
import {Grid} from '@mui/material';
import CharacterGridItem from './CharacterGridItem';
import styles from './CharacterGrid.module.css';

export interface CharacterItemData {
  id: number;
  status: 'Publish' | 'Draft' | string;
  image: string;
  name: string;
  gender: 'Male' | 'Female' | string;
}

interface CharacterGridProps {
  characters: CharacterItemData[];
  onCharacterSelect: (id: number) => void;
}

const CharacterGrid: React.FC<CharacterGridProps> = ({characters, onCharacterSelect}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (id: number) => {
    setSelectedId(id);
    onCharacterSelect(id);
  };

  return (
    <Grid container spacing={2} className={styles.gridContainer}>
      {characters.map(character => (
        <Grid item xs={6} key={character.id}>
          {' '}
          {/* xs={6}으로 설정 */}
          <CharacterGridItem
            character={character}
            isSelected={selectedId === character.id}
            onSelect={() => handleSelect(character.id)}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default CharacterGrid;
