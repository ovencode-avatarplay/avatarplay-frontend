import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux-store/ReduxStore'; // Redux Store의 RootState 가져오기
import { Box } from '@mui/material';
import ButtonSetupDrawer from '@/components/create/ButtonSetupDrawer';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ImageIcon from '@mui/icons-material/Image';
import Style from './EpisodeSetup.module.css';
import EpisodeTrigger from './episode-trigger/EpisodeTrigger';
import ButtonEpisodeInfo from './ButtonEpisodeInfo';
import EpisodeImageUpload from './EpisodeImageUpload';
import EpisodeDescription from './episode-description/EpisodeDescription';
import { ContentInfo } from '@/types/apps/content/contentInfo';
import { ChapterInfo } from '@/types/apps/content/chapter/chapterInfo';
import { EpisodeInfo } from '@/types/apps/content/episode/episodeInfo';

import { number } from 'valibot';
import EpisodeConversationTemplate from './episode-conversationtemplate/EpisodeConversationTemplate';

interface Props {
  onDrawerOpen: () => void;
  contentId : number;
  chapterId: number;
  episodeId?: number;

}

  // 캐릭터 팝업창 열때 해당 내용을 채워서 열기 위한 
  interface UpdateUserDetail {
    characterID: number,
    secrets: string,
    char_name: string,
    first_mes: string,
    char_persona: string,
    world_scenario: string,
    thumbnail: string
  }
  let updateUserDetail: UpdateUserDetail;
  const EpisodeSetup: React.FC<Props> = ({ onDrawerOpen, contentId, chapterId = 0, episodeId = 0 }) => { // episodeIndex 기본값 0

  const [isTriggerModalOpen, setTriggerModalOpen] = useState(false); // Trigger 모달 열림 상태
  const [isConversationModalOpen, setConversationModalOpen] = useState(false); // Conversation 모달 열림 상태
  const [isEpisodeModalOpen, setEpisodeModalOpen] = useState(false); 
 
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

  const [contentData, setContentData] = useState<ContentInfo>();
  const [chapterData, setChapterData] = useState<ChapterInfo>();
  const [episodeData, setEpisodeData] = useState<EpisodeInfo>();


  // Redux에서 contentInfo 데이터 가져오기
  const contentInfo = useSelector((state: RootState) => state.content.contentInfo ?? []); // contentInfo 가져오기

  useEffect(() => {
    const content = contentInfo.find(item => item.id === contentId);
    setContentData(content);
    if (content) {
      const chapter = content.chapterInfoList.find(info => info.id === chapterId);
      if (chapter) {
        setChapterData(chapter);

        const episode = chapter.episodeInfoList.find(info => info.id === episodeId);
        if (episode) {
          setEpisodeData(episode);
          updateEpisodeData(episode);
        }
        else {
          console.log(`Episode at id ${episodeId} not found in Content ${contentId}`);
        }
      }
      else {
        console.log(`Chapter With Id ${chapterId} not found in ${contentId}`);
      }
    } else {
      console.log(`Content with ID ${contentId} not found`);
    }
  }, [contentInfo, contentId, chapterId, episodeId]);
  // **팝업 열기**: 버튼 클릭 시 호출
  const handleOpenPopup = async () => {
    if (!isPopupOpen) {
      setPopupOpen(true);
    }
  };

  useEffect(() => {
    if (episodeData) {
      console.log("Episode data has been updated:", episodeData);
    }
  }, [episodeData]);
  
  const updateEpisodeData = (newData: EpisodeInfo) => {
    setEpisodeData(newData);
  };

  const handleClosePopup = () => {
    if (isPopupOpen) {
      setPopupOpen(false);
    }
  };

  const handleSubmitPopup = (data: any) => {
    console.log('Submitted data:', data);
    // 필요한 처리를 여기에 추가

  };

  return (
    <main className={Style.episodeSetup}>
      <ButtonEpisodeInfo onDrawerOpen={onDrawerOpen} />

      <Box className={Style.imageArea}>
        <EpisodeImageUpload />
      </Box>

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
            //thumbnail: updateUserDetail?.thumbnail
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
