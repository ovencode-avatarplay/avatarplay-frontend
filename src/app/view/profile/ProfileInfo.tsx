import {Avatar, Box, Button, Typography} from '@mui/material';
import styles from './ProfileInfo.module.css';
import {Profile} from './ProfileType';

interface ProfileInfoProps {
  profile: Profile;
  editMode: boolean;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({profile, editMode}) => {
  const {avatar, name, posts, followers, following} = profile;

  return (
    <Box className={styles.profileInfo}>
      <Box className={styles.profileDetail}>
        <Box className={styles.avatarArea}>
          <Avatar src={avatar} className={styles.avatar} />
          <Typography className={styles.name}>{name}</Typography>
        </Box>
        <Typography className={styles.stat}>{`Posts: ${posts}`}</Typography>
        <Typography className={styles.stat}>{`Followers: ${followers}`}</Typography>
        <Typography className={styles.stat}>{`Following: ${following}`}</Typography>
        {!editMode && <Button variant="contained">Follow</Button>}
      </Box>

      <Box className={styles.buttonArea}>
        {editMode ? (
          <>
            <Button variant="outlined">Edit Character</Button>
            <Button variant="outlined">Ad Promotion</Button>
          </>
        ) : (
          <>
            <Button variant="outlined">Donate</Button>
            <Button variant="outlined">Subscription Plan</Button>
            <Button variant="outlined">Message</Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ProfileInfo;
