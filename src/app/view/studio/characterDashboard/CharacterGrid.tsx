import React, {useState} from 'react';
import {Typography} from '@mui/material';
import CharacterGridItem from './CharacterGridItem';
import styles from './CharacterGrid.module.css';
import {CharacterInfo} from '@/redux-store/slices/ContentInfo';

interface CharacterGridProps {
  characters: CharacterInfo[] | undefined;
  onCharacterSelect: (id: number) => void;
  style?: React.CSSProperties;
  canEdit?: boolean;
  onClickEdit?: (id: number) => void;
}

const CharacterGrid: React.FC<CharacterGridProps> = ({characters, onCharacterSelect, style, onClickEdit}) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (id: number) => {
    setSelectedId(id);
    onCharacterSelect(id);
  };

  const handleClickEdit = (id: number) => {
    if (onClickEdit) {
      onClickEdit(id);
    }
  };

  return (
    <div className={styles.gridContainer} style={style}>
      {characters && characters.length > 0 ? (
        characters.map(character => (
          <CharacterGridItem
            key={character.id}
            character={character}
            isSelected={selectedId === character.id}
            onSelect={() => handleSelect(character.id)}
            canEdit={onClickEdit !== null ? true : false}
            onClickEdit={() => handleClickEdit(character.id)}
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
