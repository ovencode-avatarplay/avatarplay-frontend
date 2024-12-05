import React from 'react';

// styles, mui
import styles from './SelectProfileItem.module.css';
import {Avatar, Box, Typography} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// types
import {Profile} from './ProfileType';

interface Props {
  profile: Profile;
  isEditing: boolean;
  onSelect: () => void;
}

const SelectProfileItem: React.FC<Props> = ({profile, isEditing, onSelect}) => {
  return (
    <Box className={styles.profileItem} onClick={onSelect}>
      {isEditing ? (
        <Box className={styles.addNewIcon}>
          <AddCircleOutlineIcon fontSize="large" />
        </Box>
      ) : (
        <Avatar src={profile.avatar} alt={profile.name} className={styles.avatar} />
      )}
      <Box className={styles.userNameArea}>
        <Box className={styles.userNameArea}>
          <Typography variant="body2" className={styles.status}>
            {isEditing ? '' : profile.status}
          </Typography>
          <Typography variant="h6" className={styles.userName}>
            {isEditing ? 'Add New Profile' : profile.name}
          </Typography>
        </Box>
      </Box>
      {profile.isSelected && <CheckCircleIcon className={styles.selectedIcon} fontSize="large" color="primary" />}
    </Box>
  );
};

export default SelectProfileItem;
