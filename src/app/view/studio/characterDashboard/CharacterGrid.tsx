import React, {useState} from 'react';
import {Typography} from '@mui/material';
import CharacterGridItem from './CharacterGridItem';
import styles from './CharacterGrid.module.css';
import {CharacterInfo} from '@/redux-store/slices/StoryInfo';

interface CharacterGridProps {
  characters: CharacterInfo[] | undefined;
  onCharacterSelect: (id: number) => void;
  style?: React.CSSProperties;
  canEdit?: boolean;
  onClickEdit?: (id: number) => void;
  onClickDelete?: (id: number) => void;
  showVisibilityType?: boolean;
}

const CharacterGrid: React.FC<CharacterGridProps> = ({
  characters,
  onCharacterSelect,
  style,
  onClickEdit,
  onClickDelete,
  showVisibilityType = false,
}) => {
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

  const handleClickDelete = (id: number) => {
    if (onClickDelete) {
      onClickDelete(id);
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
            onClickDelete={() => handleClickDelete(character.id)}
            showVisibilityType={showVisibilityType}
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
