import React from 'react';
import {Box, IconButton, Typography, Chip} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import styles from './ProfileTopViewMenu.module.css';
import {Profile} from './ProfileType';

interface ProfileTopViewMenuProps {
  profile: Profile;
  onBack: () => void;
}

const ProfileTopViewMenu: React.FC<ProfileTopViewMenuProps> = ({profile, onBack}) => {
  return (
    <Box className={styles.profileTopViewMenu}>
      {/* Back Button */}
      <IconButton className={styles.backButton} onClick={onBack}>
        <ArrowBackIcon />
      </IconButton>

      {/* Name Area */}
      <Box className={styles.nameArea}>
        <Typography variant="h6" className={styles.name}>
          {profile.name}
        </Typography>
        {profile.type === 'Character' && profile.status && (
          <Chip
            label={profile.status}
            size="small"
            color={profile.status === 'Original' ? 'primary' : 'default'}
            className={styles.chip}
          />
        )}
      </Box>

      {/* Button Area */}
      <Box className={styles.buttonArea}>
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

export default ProfileTopViewMenu;
