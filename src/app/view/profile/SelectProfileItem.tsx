import React from 'react';
import {Avatar, Box, Typography, Radio, Checkbox} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import styles from './SelectProfileItem.module.css';
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
        <Avatar src={profile.avatar} alt={profile.userName} className={styles.avatar} />
      )}
      <Box className={styles.userNameArea}>
        <Box className={styles.userNameArea}>
          <Typography variant="body2" className={styles.status}>
            {isEditing ? '' : profile.status}
          </Typography>
          <Typography variant="h6" className={styles.userName}>
            {isEditing ? 'Add New Profile' : profile.userName}
          </Typography>
        </Box>
      </Box>
      <Checkbox
        className={styles.checkbox}
        checked={profile.isSelected}
        inputProps={{'aria-label': profile.userName}}
        disabled={isEditing} // isEditing 상태에서는 체크박스 비활성화
      />
    </Box>
  );
};

export default SelectProfileItem;
