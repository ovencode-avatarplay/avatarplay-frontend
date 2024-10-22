import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore'; // Redux Store의 RootState 가져오기
import {Box} from '@mui/material';
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

import EpisodeConversationTemplate from './episode-conversationtemplate/EpisodeConversationTemplate';
import EpisodeImageSetup from './episode-imagesetup/EpisodeImageSetup';

import EpisodeLLMSetup from './episode-LLMsetup/EpisodeLLMsetup';

interface Props {
  onDrawerOpen: () => void;
  contentId: number;
  chapterId: number;
  episodeId?: number;
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
const EpisodeSetup: React.FC<Props> = ({onDrawerOpen, contentId, chapterId = 0, episodeId = 0}) => {
  // episodeIndex 기본값 0

  const [isTriggerModalOpen, setTriggerModalOpen] = useState(false); // Trigger 모달 열림 상태
  const [isConversationModalOpen, setConversationModalOpen] = useState(false); // Conversation 모달 열림 상태
  const [isEpisodeModalOpen, setEpisodeModalOpen] = useState(false);
  const [isImageSetupModalOpen, setImageSetupModalOpen] = useState(false);
  const [isAdvanceImageSetupModalOpen, setAdvanceImageSetupModalOpen] = useState(false);
  const [isUploadImageDialogOpen, setUploadImageDialogOpen] = useState(false);
  const [isLLMSetupOpen, setLLMSetupOpen] = useState(false); // 모달 상태 관리

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

  const openImageSetup = () => {
    setImageSetupModalOpen(true); // 이미지 생성 모달 열기
  };

  const closeImageSetup = () => {
    setImageSetupModalOpen(false); // 이미지 생성 모달 닫기
  };

  const openAdvanceImageSetup = () => {
    setAdvanceImageSetupModalOpen(true);
  };

  const closeAdvanceImageSetup = () => {
    setAdvanceImageSetupModalOpen(false);
  };

  const openUploadImageDialog = () => {
    setUploadImageDialogOpen(true);
  };

  const closeUploadImageDialog = () => {
    setUploadImageDialogOpen(false);
  };

  const openLLMSetup = () => {
    setLLMSetupOpen(true); // 모달 열기
  };

  const closeLLMSetup = () => {
    setLLMSetupOpen(false); // 모달 닫기
  };

  // Redux에서 contentInfo 데이터 가져오기
  const contentInfo = useSelector((state: RootState) => state.content.curEditingContentInfo); // contentInfo 가져오기

  useEffect(() => {
    if (contentInfo) {
      const chapter = contentInfo.chapterInfoList.find(info => info.id === chapterId);

      if (chapter) {
        const episode = chapter.episodeInfoList.find(info => info.id === episodeId);
        if (episode) {
          console.log('Success!');
        } else {
          console.log(`Episode at id ${episodeId} not found in Content ${contentId}`);
        }
      } else {
        console.log(`Chapter With Id ${chapterId} not found in ${contentId}`);
      }
    } else {
      console.log(`Content with ID ${contentId} not found`);
    }
  }, [contentInfo, contentId, chapterId, episodeId]);

  const handleSubmitPopup = (data: any) => {
    console.log('Submitted data:', data);
    // 필요한 처리를 여기에 추가
  };
  return (
    <main className={Style.episodeSetup}>
      <ButtonEpisodeInfo
        onDrawerOpen={onDrawerOpen}
        chapterName={contentInfo.chapterInfoList[chapterId]?.name ?? ''}
        episodeName={contentInfo.chapterInfoList[chapterId]?.episodeInfoList[episodeId].name ?? ''}
      />
      <Box className={Style.imageArea}>
        <EpisodeImageUpload
          onClickEasyCreate={openImageSetup}
          onClickAdvanceCreate={openAdvanceImageSetup}
          uploadImageState={isUploadImageDialogOpen}
          onClickUploadImage={openUploadImageDialog}
          onCloseUploadImage={closeUploadImageDialog}
        />
      </Box>
      <Box className={Style.setupButtons}>
        <ButtonSetupDrawer icon={<PersonIcon />} label="SceneDescription" onClick={openEpisodeModal} />
        <ButtonSetupDrawer icon={<BookIcon />} label="TriggerSetup" onClick={openTriggerModal} />
        <ButtonSetupDrawer icon={<PostAddIcon />} label="Conversation Setup" onClick={openConversationModal} />
        <ButtonSetupDrawer icon={<ImageIcon />} label="AI Model Setup" onClick={openLLMSetup} />
      </Box>
      {/* EpisodeTrigger 모달 */}
      <EpisodeTrigger open={isTriggerModalOpen} closeModal={closeTriggerModal} /> {/* 모달 상태 전달 */}
      <EpisodeConversationTemplate open={isConversationModalOpen} closeModal={closeConversationModal} />{' '}
      {/* 모달 상태 전달 */}
      {/* Episode Description 모달 */}
      {isEpisodeModalOpen && (
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
        />
      )}
      {/*이미지 생성 모달*/}
      {isImageSetupModalOpen && <EpisodeImageSetup open={isImageSetupModalOpen} onClose={closeImageSetup} />}
      {/* {isAdvanceImageSetupModalOpen && <EpisodeAdvanceImageSetup open ={isAdvanceImageSetupModalOpen} onClose={closeAdvanceImageSetup} />} */}
      {/* EpisodeLLMSetup 모달 */}
      <EpisodeLLMSetup open={isLLMSetupOpen} onClose={closeLLMSetup} />
    </main>
  );
};

export default EpisodeSetup;
