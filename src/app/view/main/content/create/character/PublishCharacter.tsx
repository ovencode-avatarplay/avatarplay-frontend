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

import {useEffect, useState} from 'react';
import {CreateCharacterReq, sendCreateCharacter} from '@/app/NetWork/CharacterNetwork';

import LoadingOverlay from '@/components/create/LoadingOverlay';
import {CharacterInfo} from '@/redux-store/slices/EpisodeInfo';

interface PublishCharacterProps {
  characterInfo: Partial<CharacterInfo>;
  debugparam: string;
  publishRequested: boolean;
  publishRequestedAction: () => void;
  publishFinishAction: () => void;
}

const PublishCharacter: React.FC<PublishCharacterProps> = ({
  characterInfo,
  debugparam,
  publishRequested,
  publishRequestedAction,
  publishFinishAction,
}) => {
  const [drawerVisibilityOpen, setDrawerVisibilityOpen] = useState(false);
  const [drawerMonetizationOpen, setDrawerMonetizationOpen] = useState(false);
  const [visibility, setVisibility] = useState('Private');
  const [monetization, setMonetization] = useState('Off');
  const [loading, setLoading] = useState(false);

  const defaultCharacterInfo: CharacterInfo = {
    id: 0,
    name: '',
    introduction: '',
    description: '',
    genderType: 0,
    mainImageUrl: '',
    portraitGalleryImageUrl: [],
    poseGalleryImageUrl: [],
    expressionGalleryImageUrl: [],
    visibilityType: 0,
    isMonetization: false,
    state: 0,
  };

  const mergedCharacterInfo: CharacterInfo = {
    ...defaultCharacterInfo,
    ...characterInfo,
  };

  const [currentCharacter, setCurrentCharacter] = useState<CharacterInfo>(mergedCharacterInfo);

  const [characterName, setCharacterName] = useState<string>(currentCharacter.name || '');
  const [characterIntroduction, setCharacterIntroduction] = useState<string>(currentCharacter.introduction || '');
  const [characterDescription, setCharacterDescription] = useState<string>(currentCharacter.description || '');

  const [isPublishRequested, setIsPublishRequested] = useState<boolean>(false);
  const handleDrawerVisibilityToggle = () => {
    setDrawerVisibilityOpen(!drawerVisibilityOpen);
  };
  const handleDrawerMonetizationToggle = () => {
    setDrawerMonetizationOpen(!drawerMonetizationOpen);
  };

  const handleCreateCharacter = async () => {
    setLoading(true);

    try {
      // 사용자의 입력 데이터를 수집하여 CreateCharacterReq로 구성
      const req: CreateCharacterReq = {
        characterInfo: {
          id: characterInfo.id ?? 0,
          name: characterName,
          introduction: characterIntroduction,
          description: characterDescription,
          genderType: currentCharacter.genderType,
          mainImageUrl: currentCharacter.mainImageUrl,

          portraitGalleryImageUrl: [],
          poseGalleryImageUrl: [],
          expressionGalleryImageUrl: [],
          visibilityType: visibility === 'Public' ? 2 : visibility === 'Unlisted' ? 1 : 0, // Visibility를 숫자로 변환
          isMonetization: monetization === 'On',
          state: 1,
        },
        debugParameter: debugparam,
      };

      // API 호출
      const response = await sendCreateCharacter(req);

      if (response.data) {
        console.log('Character created successfully:', response.data);

        publishFinishAction();
      } else {
        throw new Error('Character creation failed.');
      }
    } catch (error) {
      console.error('Error creating character:', error);
    } finally {
      setLoading(false);
    }
  };

  function getMonetizationText() {
    if (monetization === 'On') {
      return 'Original';
    } else if (monetization === 'Off') {
      return 'Fan';
    }
  }

  useEffect(() => {
    if (characterInfo) setCurrentCharacter(mergedCharacterInfo);
  }, []);

  useEffect(() => {
    if (publishRequested) setIsPublishRequested(true);
  }, [publishRequested]);

  useEffect(() => {
    if (isPublishRequested) {
      handleCreateCharacter();
      publishRequestedAction();
      setIsPublishRequested(false);
    }
  }, [isPublishRequested]);

  return (
    <>
      <LoadingOverlay loading={loading} />
      {/* Thumbnail Area */}
      <Box className={styles.thumbnailArea}>
        <Box className={styles.portraitArea}>
          <Typography className={styles.label}>Base Portrait</Typography>
          <Box
            style={{
              backgroundImage: `url(${currentCharacter.mainImageUrl || ''})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: '100%',
              width: '100%',
            }}
          ></Box>
        </Box>
        <Box className={styles.nameArea}>
          <Typography className={styles.label}>Character Name</Typography>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Enter Character Name"
            value={characterName}
            onChange={e => setCharacterName(e.target.value)} // 이름 상태 업데이트
          />
          <Typography className={styles.label}>Character Introduction</Typography>
          <TextField
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            placeholder="Write a brief introduction about the character..."
            value={characterIntroduction}
            onChange={e => setCharacterIntroduction(e.target.value)}
          />
        </Box>
      </Box>

      {/* Character Description */}
      <Typography className={styles.label}>Character Description</Typography>
      <TextField
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        placeholder="Write a brief description about the character..."
        value={characterDescription}
        onChange={e => setCharacterDescription(e.target.value)}
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
          <Typography className={styles.toggleState}>{getMonetizationText()}</Typography>
          <ChevronRightIcon />
        </Box>
      </Box>

      {/* Publish Button */}
      {/* <Button variant="contained" color="primary" className={styles.publishButton} onClick={handleCreateCharacter}>
        Publish Character
      </Button> */}

      {/* Drawer */}
      <Drawer
        className={styles.drawerindex}
        anchor="right"
        open={drawerVisibilityOpen}
        onClose={handleDrawerVisibilityToggle}
        sx={{zIndex: 1500}}
      >
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
          <RadioGroup
            value={visibility}
            onChange={e => setVisibility(e.target.value)}
            className={styles.toggleGroup}
            sx={{zIndex: 1500}}
          >
            <FormControlLabel value="Private" control={<Radio />} label="Private" />
            <FormControlLabel value="Unlisted" control={<Radio />} label="Unlisted" />
            <FormControlLabel value="Public" control={<Radio />} label="Public" />
          </RadioGroup>
        </Box>
      </Drawer>
      {/* Drawer */}
      <Drawer anchor="right" open={drawerMonetizationOpen} onClose={handleDrawerMonetizationToggle} sx={{zIndex: 1500}}>
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
            <FormControlLabel value="On" control={<Radio />} label="Original" />
            <FormControlLabel value="Off" control={<Radio />} label="Fan" />
          </RadioGroup>
        </Box>
      </Drawer>
    </>
  );
};

export default PublishCharacter;
