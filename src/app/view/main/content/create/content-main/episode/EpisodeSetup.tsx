import React, { useState } from 'react';
import ReactDOM from 'react-dom/client'; // react-dom/client에서 import
import { Box, Icon } from '@mui/material';
import ButtonSetupDrawer from '@/components/create/ButtonSetupDrawer';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ImageIcon from '@mui/icons-material/Image';

import Style from './EpisodeSetup.module.css';
import EpisodeTrigger from './episode-trigger/EpisodeTrigger'; // EpisodeTrigger import
import ButtonEpisodeInfo from './ButtonEpisodeInfo';
import EpisodeImageSetup from './episode-imagesetup/EpisodeImageSetup';
import EpisodeImageUpload from './EpisodeImageUpload';

interface Props {
  onDrawerOpen: () => void;

}

const EpisodeSetup: React.FC<Props> = ({onDrawerOpen}) => {
  const [modalOpen, setModalOpen] = useState(false); // 모달 열림 상태

  const openModal = () => {
    setModalOpen(true); // 모달 열기
  };

  const closeModal = () => {
    setModalOpen(false); // 모달 닫기
  };

  return (
    <main className={Style.episodeSetup}>
      <ButtonEpisodeInfo chapterName='Chapter.1' episodeName='Ep.1 FirstDay' onDrawerOpen={onDrawerOpen} />

      {/* 이미지 영역 */}
      <Box className={Style.imageArea}>
        <EpisodeImageUpload />
      </Box>

      {/* SetupButton 4개 */}
      <Box className={Style.setupButtons}>
        <ButtonSetupDrawer icon={<PersonIcon />} label="SceneDescription" onClick={() => { }} />
        <ButtonSetupDrawer icon={<BookIcon />} label="TriggerSetup" onClick={openModal} /> {/* openModal 호출 */}
        <ButtonSetupDrawer icon={<PostAddIcon />} label="Conversation Setup" onClick={() => { }} />
        <ButtonSetupDrawer icon={<ImageIcon />} label="AI Model Setup" onClick={() => { }} />
      </Box>

      {/* EpisodeTrigger 모달 */}
      <EpisodeTrigger open={modalOpen} closeModal={closeModal} /> {/* 모달 상태 전달 */}
    </main>
  );
};

export default EpisodeSetup;
