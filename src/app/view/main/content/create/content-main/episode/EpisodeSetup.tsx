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
import EpisodeDescription from './episode-description/EpisodeDescription';
import { number } from 'valibot';

import { sendCharacterInfoDetail } from '@/app/NetWork/MyNetWork';
import EpisodeConversationTemplate from './episode-conversationtemplate/EpisodeConversationTemplate';

interface Props {
  onDrawerOpen: () => void;
}

// 캐릭터 팝업창 열때 해당 내용을 채워서 열기 위한 
interface UpdateUserDetail {
  characterID: number;
  secrets: string;
  char_name: string;
  first_mes: string;
  char_persona: string;
  world_scenario: string;
  thumbnail: string;
}

let updateUserDetail: UpdateUserDetail;

const EpisodeSetup: React.FC<Props> = ({ onDrawerOpen }) => {
  const [isTriggerModalOpen, setTriggerModalOpen] = useState(false); // Trigger 모달 열림 상태
  const [isConversationModalOpen, setConversationModalOpen] = useState(false); // Conversation 모달 열림 상태
  const [isEpisodeModalOpen, setEpisodeModalOpen] = useState(false); // Episode 모달 열림 상태

  // **상태 추가**: 팝업 열림 상태를 관리
  const [isPopupOpen, setPopupOpen] = useState<boolean>(false);

  const openTriggerModal = () => {
    setTriggerModalOpen(true); // Trigger 모달 열기
  };

  const closeTriggerModal = () => {
    setTriggerModalOpen(false); // Trigger 모달 닫기
  };

  const openConversationModal = () => {
    setConversationModalOpen(true); // Conversation 모달 열기
  };

  const closeConversationModal = () => {
    setConversationModalOpen(false); // Conversation 모달 닫기
  };

  const openEpisodeModal = () => {
    setEpisodeModalOpen(true); // Episode 모달 열기
  };

  const closeEpisodeModal = () => {
    setEpisodeModalOpen(false); // Episode 모달 닫기
  };

  // **팝업 열기**: 버튼 클릭 시 호출
  const handleOpenPopup = async () => {
    if (!isPopupOpen) {
      setPopupOpen(true);
    }
  };

  // **팝업 닫기**: 팝업을 닫기 위해 호출
  const handleClosePopup = () => {
    if (isPopupOpen) {
      setPopupOpen(false);
    }
  };

  // **팝업 제출 처리**: 팝업에서 제출된 데이터를 처리
  const handleSubmitPopup = (data: {
    /*characterName: string;
    characterDescription: string;
    worldview: string;
    introduction: string;
    secret: string;*/
  }) => {
    console.log('Submitted data:', data);
    // 필요한 처리를 여기에 추가
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
        <ButtonSetupDrawer icon={<PersonIcon />} label="SceneDescription" onClick={openEpisodeModal} />
        <ButtonSetupDrawer icon={<BookIcon />} label="TriggerSetup" onClick={openTriggerModal} />
        <ButtonSetupDrawer icon={<PostAddIcon />} label="Conversation Setup" onClick={openConversationModal} />
        <ButtonSetupDrawer icon={<ImageIcon />} label="AI Model Setup" onClick={() => { }} />
      </Box>

      {/* EpisodeTrigger 모달 */}
      <EpisodeTrigger open={isTriggerModalOpen} closeModal={closeTriggerModal} /> {/* 모달 상태 전달 */}
      <EpisodeConversationTemplate open={isConversationModalOpen} closeModal={closeConversationModal} /> {/* 모달 상태 전달 */}

      {/* Episode Description 모달 */}
      {isEpisodeModalOpen &&
        <EpisodeDescription
          dataDefault={{
            userId: updateUserDetail?.characterID,
            characterName: updateUserDetail?.char_name,
            characterDescription: updateUserDetail?.char_persona,
            worldScenario: updateUserDetail?.world_scenario,
            introduction: updateUserDetail?.first_mes,
            secret: updateUserDetail?.secrets,
            thumbnail: updateUserDetail?.thumbnail
          }}
          isModify={true}
          open={isEpisodeModalOpen}
          onClose={closeEpisodeModal}
          onSubmit={handleSubmitPopup}
        />}
    </main>
  );
};

export default EpisodeSetup;
