// Story 생성의 가장 Main이 되는 Component. ContentMain에서 항상 켜져있습니다.

import React from 'react';
import { Box } from '@mui/material';
import ButtonSetupDrawer from '@/components/create/ButtonSetupDrawer';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ImageIcon from '@mui/icons-material/Image';

import Style from './EpisodeSetup.module.css'; 

import EpisodeImageSetup from './episode-imagesetup/EpisodeImageSetup';
import EpisodeDescription from './episode-description/EpisodeDescription';
import EpisodeTrigger from './episode-trigger/EpisodeTrigger';
import EpisodeConversationTemplate from './episode-conversationtemplate/EpisodeConversationTemplate';
import EpisodeLLMSetup from './episode-LLMsetup/EpisodeLLMsetup';

const EpisodeSetup: React.FC = () => {
  return (
    <main className={Style.episodeSetup}>
      <ButtonSetupDrawer icon={<PersonIcon />} label="Setup" onClick={() => { }} />
      {/* 이미지 영역 */}
      <Box className={Style.imageArea}>
        <img src="/Images/001.png" alt="Episode Setup" className={Style.setupImage} />
      </Box>

      {/* SetupButton 4개 */}
      <Box className={Style.setupButtons}>
        <ButtonSetupDrawer icon={<PersonIcon />} label="SceneDescription" onClick={() => { }} />
        <ButtonSetupDrawer icon={<BookIcon />} label="TriggerSetup" onClick={() => { }} />
        <ButtonSetupDrawer icon={<PostAddIcon />} label="Conversation Setup" onClick={() => { }} />
        <ButtonSetupDrawer icon={<ImageIcon />} label="AI Model Setup" onClick={() => { }} />
      </Box>
      <EpisodeImageSetup />
      <EpisodeDescription />
      <EpisodeTrigger />
      <EpisodeConversationTemplate />
      <EpisodeLLMSetup />
    </main>
  );
};

export default EpisodeSetup;
