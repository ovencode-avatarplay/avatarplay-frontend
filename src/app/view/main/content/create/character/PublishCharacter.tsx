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
  const [loading, setLoading] = useState(false);

  const defaultCharacterInfo: CharacterInfo = {
    id: 0,
    name: '',
    introduction: '',
    description: '',

    worldScenario: "",
    greeting: "",
    secret: "",

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
  const [visibility, setVisibility] = useState(currentCharacter.visibilityType);
  const [monetization, setMonetization] = useState(currentCharacter.isMonetization);

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
          id: currentCharacter.id ?? 0,
          name: characterName,
          introduction: characterIntroduction,
          description: characterDescription,

          worldScenario: currentCharacter.worldScenario,
          greeting: currentCharacter.greeting,
          secret: currentCharacter.secret,

          genderType: currentCharacter.genderType,
          mainImageUrl: currentCharacter.mainImageUrl,

          portraitGalleryImageUrl: [],
          poseGalleryImageUrl: [],
          expressionGalleryImageUrl: [],
          visibilityType: visibility, // Visibility를 숫자로 변환
          isMonetization: monetization,
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

  function GetVisibilityText() {
    if (visibility === 0) {
      return 'Private';
    } else if (visibility === 1) {
      return 'Unlisted';
    } else if (visibility === 2) {
      return 'Public';
    } else {
      return 'Err';
    }
  }

  function getMonetizationText() {
    if (monetization === true) {
      return 'Original';
    } else if (monetization === false) {
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

      {/* Character Description */}
      <Typography className={styles.label}>World Scenario</Typography>
      <TextField
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        placeholder="Describe the background of the character..."
        value={currentCharacter.worldScenario}
        onChange={e => {
          currentCharacter.worldScenario = e.target.value
          setCurrentCharacter({ ...currentCharacter })
        }}
      />
      {/* Character Description */}
      <Typography className={styles.label}>Greeting</Typography>
      <TextField
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        placeholder="Describe the situation at the start of the conversation..."
        value={currentCharacter.greeting}
        onChange={e => {
          currentCharacter.greeting = e.target.value
          setCurrentCharacter({ ...currentCharacter })
        }}
      />
      {/* Character Description */}
      <Typography className={styles.label}>Secrets</Typography>
      <TextField
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        placeholder="This information will not be exposed to the user in conversation, and will be passed to the prompt generator...."
        value={currentCharacter.secret}
        onChange={e => {
          currentCharacter.secret = e.target.value
          setCurrentCharacter({ ...currentCharacter })
        }}
      />

      {/* Setting Button Area */}
      <Box className={styles.settingButtonArea}>
        <Box className={styles.settingButton} onClick={handleDrawerVisibilityToggle}>
          <PublicIcon />
          <Typography className={styles.label}>Visibility</Typography>
          <Typography className={styles.toggleState}>{GetVisibilityText()}</Typography>
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
            onChange={e => setVisibility(parseInt(e.target.value, 10))}
            className={styles.toggleGroup}
            sx={{zIndex: 1500}}
          >
            <FormControlLabel value={0} control={<Radio />} label="Private" />
            <FormControlLabel value={1} control={<Radio />} label="Unlisted" />
            <FormControlLabel value={2} control={<Radio />} label="Public" />
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
            onChange={e => setMonetization(e.target.value === 'true')}
            className={styles.toggleGroup}
          >
            <FormControlLabel value={true} control={<Radio />} label="Original" />
            <FormControlLabel value={false} control={<Radio />} label="Fan" />
          </RadioGroup>
        </Box>
      </Drawer>
    </>
  );
};

export default PublishCharacter;
