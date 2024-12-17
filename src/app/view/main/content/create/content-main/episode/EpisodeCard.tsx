import React, {useState} from 'react';
import styles from './EpisodeCard.module.css';
import {Avatar, Box, Typography, IconButton, Badge, Card} from '@mui/material';
import {EpisodeInfo} from '@/redux-store/slices/EpisodeInfo';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import {BoldCirclePlus, edit1Pixel, editPlusOpacity, plusRound} from '@ui/Icons';
import {CircleRounded} from '@mui/icons-material';
import {RootState} from '@/redux-store/ReduxStore';
import {useSelector} from 'react-redux';
import EpisodeTrigger from './episode-trigger/EpisodeTrigger';
import EpisodeDescription from './episode-description/EpisodeDescription';
import EpisodeImageSetup from './episode-imagesetup/EpisodeImageSetup';
import EpisodeConversationTemplate from './episode-conversationtemplate/EpisodeConversationTemplate';
interface EpisodeCardProps {
  episodeNum: number;
  episodeId: number;
  onInit: () => void;
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
let updateUserDetail: UpdateUserDetail = {
  characterID: 0,
  secrets: '',
  char_name: '',
  first_mes: '',
  char_persona: '',
  world_scenario: '',
  thumbnail: '',
};
const EpisodeCard: React.FC<EpisodeCardProps> = ({episodeNum, episodeId, onInit}) => {
  const episodeInfo = useSelector((state: RootState) => {
    const flatEpisodes = state.content.curEditingContentInfo.chapterInfoList.flatMap(
      chapter => chapter.episodeInfoList,
    );

    return flatEpisodes.find(episode => episode.id === episodeId) || flatEpisodes[0]; // 기본값 처리
  });
  const [isTriggerModalOpen, setTriggerModalOpen] = useState(false); // Trigger 모달 열림 상태

  const [isEpisodeModalOpen, setEpisodeModalOpen] = useState(false);
  const [isImageSetupModalOpen, setImageSetupModalOpen] = useState(false);
  const [isConversationModalOpen, setConversationModalOpen] = useState(false);
  const openConversationModal = () => {
    setConversationModalOpen(true);
  };

  const closeConversationModal = () => {
    setConversationModalOpen(false);
  };

  const openTriggerModal = () => {
    setTriggerModalOpen(true); // Trigger 모달 열기
  };

  const closeTriggerModal = () => {
    setTriggerModalOpen(false); // Trigger 모달 닫기
  };

  const openEpisodeModal = () => {
    (document.activeElement as HTMLElement).blur(); // 하위 컴포넌트에 브레이크포인트가 걸렸을때 aria-hidden 애러가 발생해서 넣음
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

  const handleSubmitPopup = (data: any) => {
    console.log('Submitted data:', data);
    // 필요한 처리를 여기에 추가

    setEpisodeModalOpen(false); // Episode 모달 닫기
  };

  return (
    <div className={styles.episodeCard}>
      {/* 상단 제목 영역 */}
      <Box className={styles.header}>
        <div style={{display: 'flex'}}>
          <Typography style={{marginRight: '4px'}}>{`Ep.${episodeNum || '?'}`}</Typography>

          <Typography>{`${episodeInfo?.name || 'None'}`}</Typography>
        </div>
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </Box>
      <Box className={styles.contentBox}>
        <div className={styles.contentTop}>
          <div className={styles.cardBox}>
            {/* Image Section */}
            <div className={styles.cardimageContainer}>
              <img src={episodeInfo?.characterInfo.mainImageUrl} alt="Main" className={styles.cardmainImage} />
              <img src={editPlusOpacity.src} className={styles.cardtopRightButton} onClick={() => onInit()} />
            </div>
          </div>
          <div className={styles.contentTopBox}>
            <div className={styles.contentTopName}>
              <b>Suyeon </b>
            </div>
            <div className={styles.contentTopItem}>
              Conversation Template
              <img src={plusRound.src} className={styles.circlePlusIcon} onClick={() => openConversationModal()} />
            </div>
            <div className={styles.contentTopItem}>
              Trigger Event
              <img src={plusRound.src} className={styles.circlePlusIcon} onClick={() => openTriggerModal()} />
            </div>
          </div>
        </div>

        <div className={styles.episodeScenario}>
          <div className={styles.episodeScenarioItem1}>
            Episode Scenario
            <img src={edit1Pixel.src} className={styles.circlePlusIcon} onClick={() => openEpisodeModal()} />
          </div>
          <div className={styles.episodeScenarioItem2}>{episodeInfo.episodeDescription.scenarioDescription}</div>
        </div>
      </Box>

      {/* EpisodeTrigger 모달 */}
      <EpisodeTrigger open={isTriggerModalOpen} closeModal={closeTriggerModal} episodeInfo={episodeInfo} />
      {/* 여기까지 묶기 */}
      <EpisodeConversationTemplate
        open={isConversationModalOpen}
        closeModal={closeConversationModal}
        episodeInfo={episodeInfo}
      />
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
          }}
          isModify={true}
          open={isEpisodeModalOpen}
          onClose={closeEpisodeModal}
          onSubmit={handleSubmitPopup}
          episodeInfo={episodeInfo}
        />
      )}
      {/*이미지 생성 모달*/}
      {isImageSetupModalOpen && (
        <EpisodeImageSetup open={isImageSetupModalOpen} onClose={closeImageSetup} episodeInfo={episodeInfo} />
      )}
    </div>
  );
};

export default EpisodeCard;
