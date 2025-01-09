import React, {useState} from 'react';
import {Grid, Typography} from '@mui/material';
import CharacterGridItem from './CharacterGridItem';
import styles from './CharacterGrid.module.css';
import {CharacterInfo} from '@/redux-store/slices/EpisodeInfo';

interface CharacterGridProps {
  characters: CharacterInfo[] | undefined;
  onCharacterSelect: (id: number) => void;
}

const CharacterGrid: React.FC<CharacterGridProps> = ({characters, onCharacterSelect}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (id: number) => {
    setSelectedId(id);
    onCharacterSelect(id);
  };

  return (
    <div className={styles.gridContainer}>
      {characters && characters.length > 0 ? (
        characters.map(character => (
          <CharacterGridItem
            key={character.id}
            character={character}
            isSelected={selectedId === character.id}
            onSelect={() => handleSelect(character.id)}
          />
        ))
      ) : (
        <Typography variant="body1" className={styles.noCharactersMessage}>
          No characters available.
        </Typography>
      )}
    </div>
  );
};

export default CharacterGrid;
