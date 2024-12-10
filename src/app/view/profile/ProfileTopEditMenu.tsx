import React from 'react';
import {Box, IconButton, MenuItem, Select, FormControl, Chip} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import styles from './ProfileTopEditMenu.module.css';
import {Profile} from './ProfileType';

interface ProfileTopEditMenuProps {
  profiles: Profile[];
  selectedId: number;
  onSelectCharacter: (id: number) => void;
}

const ProfileTopEditMenu: React.FC<ProfileTopEditMenuProps> = ({
  profiles: characters,
  selectedId,
  onSelectCharacter,
}) => {
  return (
    <Box className={styles.profileTopMenu}>
      {/* Dropdown List */}
      <FormControl className={styles.dropdownList}>
        <Select value={selectedId} onChange={e => onSelectCharacter(Number(e.target.value))}>
          {characters.map(character => (
            <MenuItem key={character.id} value={character.id}>
              {character.type === 'Character' ? (
                <Box>
                  <div>{character.name}</div>
                  {character.status && (
                    <Chip
                      label={character.status}
                      size="small"
                      color={character.status === 'Original' ? 'primary' : 'default'}
                      className={styles.chip}
                      sx={{mt: 0.5}}
                    />
                  )}
                </Box>
              ) : (
                character.name
              )}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Button Area */}
      <Box className={styles.buttonArea}>
        <IconButton>
          <AddIcon />
        </IconButton>
        <IconButton>
          <ShareIcon />
        </IconButton>
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ProfileTopEditMenu;
