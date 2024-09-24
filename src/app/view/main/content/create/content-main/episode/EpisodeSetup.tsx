// Story 생성의 가장 Main이 되는 Component. ContentMain에서 항상 켜져있습니다.

import React from 'react';
import { Box } from '@mui/material';
import ButtonSetupDrawer from '@/components/create/ButtonSetupDrawer';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ImageIcon from '@mui/icons-material/Image';
import './EpisodeSetup.css'; // CSS 파일 임포트

const EpisodeSetup: React.FC = () => {
  return (
    <main className='search-board-container'>
        <ButtonSetupDrawer icon={<PersonIcon />} label="Setup" onClick={() => {}} />
      {/* 이미지 영역 */}
      <Box className="image-area">
        <img src="/Images/001.png" alt="Episode Setup" className="setup-image" />
      </Box>

      {/* SetupButton 4개 */}
      <Box className="setup-buttons">
        <ButtonSetupDrawer icon={<PersonIcon />} label="SceneDescription" onClick={() => {}} />
        <ButtonSetupDrawer icon={<BookIcon />} label="TriggerSetup" onClick={() => {}} />
        <ButtonSetupDrawer icon={<PostAddIcon />} label="Conversation Setup" onClick={() => {}} />
        <ButtonSetupDrawer icon={<ImageIcon />} label="AI Model Setup" onClick={() => {}} />
      </Box>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      <p>AAAA</p>
      </main>
  );
};

export default EpisodeSetup;
