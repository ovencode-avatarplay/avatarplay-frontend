import {
  Box,
  Button,
  Drawer,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InfoIcon from '@mui/icons-material/Info';
import PublicIcon from '@mui/icons-material/Public';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

import styles from './PublishCharacter.module.css';

import {useState} from 'react';

interface PublishCharacterProps {
  url: string;
}

const PublishCharacter: React.FC<PublishCharacterProps> = ({url}) => {
  const [drawerVisibilityOpen, setDrawerVisibilityOpen] = useState(false);
  const [drawerMonetizationOpen, setDrawerMonetizationOpen] = useState(false);
  const [visibility, setVisibility] = useState('Private');
  const [monetization, setMonetization] = useState('Off');

  const handleDrawerVisibilityToggle = () => {
    setDrawerVisibilityOpen(!drawerVisibilityOpen);
  };
  const handleDrawerMonetizationToggle = () => {
    setDrawerMonetizationOpen(!drawerMonetizationOpen);
  };

  return (
    <>
      {/* Thumbnail Area */}
      <Box className={styles.thumbnailArea}>
        <Box className={styles.portraitArea}>
          <Typography className={styles.label}>Base Portrait</Typography>
          <Box
            style={{
              backgroundImage: `url(${url || ''})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '100%',
              width: '100%',
            }}
          ></Box>
        </Box>
        <Box className={styles.nameArea}>
          <Typography className={styles.label}>Character Name</Typography>
          <TextField variant="outlined" fullWidth placeholder="Enter Character Name" />
          <Button variant="outlined" className={styles.regenerateButton}>
            Regenerate
          </Button>
        </Box>
      </Box>

      {/* Character Introduction */}
      <Typography className={styles.label}>Character Introduction</Typography>
      <TextField
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        placeholder="Write a brief introduction about the character..."
      />

      {/* Setting Button Area */}
      <Box className={styles.settingButtonArea}>
        <Box className={styles.settingButton} onClick={handleDrawerVisibilityToggle}>
          <PublicIcon />
          <Typography className={styles.label}>Visibility</Typography>
          <Typography className={styles.toggleState}>{visibility}</Typography>
          <ChevronRightIcon />
        </Box>
        <Box className={styles.settingButton} onClick={handleDrawerMonetizationToggle}>
          <MonetizationOnIcon />
          <Typography className={styles.label}>Monetization</Typography>
          <Typography className={styles.toggleState}>{monetization}</Typography>
          <ChevronRightIcon />
        </Box>
      </Box>

      {/* Publish Button */}
      <Button variant="contained" color="primary" className={styles.publishButton}>
        Publish Character
      </Button>

      {/* Drawer */}
      <Drawer anchor="right" open={drawerVisibilityOpen} onClose={handleDrawerVisibilityToggle}>
        <Box className={styles.drawer}>
          {/* Drawer Header */}
          <Box className={styles.drawerHeader}>
            <Button onClick={handleDrawerVisibilityToggle}>
              <ChevronLeftIcon />
            </Button>
            <Typography className={styles.drawerTitle}>Visibility</Typography>
            <IconButton>
              <InfoIcon />
            </IconButton>
          </Box>

          {/* Visibility Toggle */}
          <RadioGroup value={visibility} onChange={e => setVisibility(e.target.value)} className={styles.toggleGroup}>
            <FormControlLabel value="Private" control={<Radio />} label="Private" />
            <FormControlLabel value="Unlisted" control={<Radio />} label="Unlisted" />
            <FormControlLabel value="Public" control={<Radio />} label="Public" />
          </RadioGroup>
        </Box>
      </Drawer>
      {/* Drawer */}
      <Drawer anchor="right" open={drawerMonetizationOpen} onClose={handleDrawerMonetizationToggle}>
        <Box className={styles.drawer}>
          {/* Drawer Header */}
          <Box className={styles.drawerHeader}>
            <Button onClick={handleDrawerMonetizationToggle}>
              <ChevronLeftIcon />
            </Button>
            <Typography className={styles.drawerTitle}>Monetization</Typography>
            <IconButton>
              <InfoIcon />
            </IconButton>
          </Box>

          {/* Monetization Toggle */}
          <RadioGroup
            value={monetization}
            onChange={e => setMonetization(e.target.value)}
            className={styles.toggleGroup}
          >
            <FormControlLabel value="Off" control={<Radio />} label="Off" />
            <FormControlLabel value="On" control={<Radio />} label="On" />
          </RadioGroup>
        </Box>
      </Drawer>
    </>
  );
};

export default PublishCharacter;
