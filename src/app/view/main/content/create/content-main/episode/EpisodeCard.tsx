import React, {useEffect, useState} from 'react';
import styles from './EpisodeCard.module.css';
import {Avatar, Box, Typography, IconButton, Badge, Card, Modal} from '@mui/material';
import {EpisodeInfo, setCurrentEpisodeInfo} from '@/redux-store/slices/EpisodeInfo';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import {BoldArrowDown, BoldCirclePlus, BoldMenuDots, edit1Pixel, editPlusOpacity, LineMenu, plusRound} from '@ui/Icons';
import {CircleRounded} from '@mui/icons-material';
import {RootState, store} from '@/redux-store/ReduxStore';
import {useDispatch, useSelector} from 'react-redux';
import EpisodeTrigger from './episode-trigger/EpisodeTrigger';
import EpisodeDescription from './episode-description/EpisodeDescription';
import EpisodeImageSetup from './episode-imagesetup/EpisodeImageSetup';
import EpisodeConversationTemplate from './episode-conversationtemplate/EpisodeConversationTemplate';
import EpisodeCardDropDown from './EpisodeCardDropDown';
import {adjustEpisodeIndex, updateEpisodeInfoInContent} from '@/redux-store/slices/ContentInfo';
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

  const currentEpisode = useSelector((state: RootState) => state.episode.currentEpisodeInfo);
  const [isTriggerModalOpen, setTriggerModalOpen] = useState(false); // Trigger 모달 열림 상태
  const dispatch = useDispatch();
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
  const chapters = useSelector((state: RootState) => state.content.curEditingContentInfo.chapterInfoList);
  const handleChangeOrderEpisodeIndex = (targetId: number, direction: 'up' | 'down') => {
    const currentChapter = chapters.find(chapter => chapter.episodeInfoList.some(episode => episode.id === targetId));

    if (!currentChapter) {
      console.warn('해당 에피소드를 포함하는 챕터를 찾을 수 없습니다.');
      return;
    }

    const episodeIndex = currentChapter.episodeInfoList.findIndex(episode => episode.id === targetId);

    if (episodeIndex === -1) {
      console.warn('에피소드 인덱스를 찾을 수 없습니다.');
      return;
    }

    // 방향에 따른 인덱스 계산
    const swapIndex = direction === 'up' ? episodeIndex - 1 : episodeIndex + 1;
    const currentIndex = direction === 'up' ? episodeIndex + 1 : episodeIndex - 1;
    // 인덱스 범위 검사
    if (swapIndex < 0 || swapIndex >= currentChapter.episodeInfoList.length) {
      console.warn('더 이상 이동할 수 없습니다.');
      return;
    }
    console.log({episodeIndex}, currentChapter.episodeInfoList[episodeIndex]);
    dispatch(setCurrentEpisodeInfo(currentChapter.episodeInfoList[swapIndex]));
    // 인덱스를 기반으로 순서 변경 작업 디스패치
    dispatch(adjustEpisodeIndex({targetId, direction}));
  };

  const handleChangeOrderEpisodeIndex = (targetId: number, direction: 'up' | 'down') => {
    // 순서 변경
    dispatch(adjustEpisodeIndex({targetId, direction}));

    //순서 변경 시 현재 에피소드 바꾸는 작업 필요
  };

  const [isDropDownOpen, setDropDownOpen] = useState(false);

  useEffect(() => {
    dispatch(updateEpisodeInfoInContent(currentEpisode)); // 상태 업데이트
  }, [currentEpisode.name]);

  return (
    <div className={styles.episodeCard}>
      {/* 상단 제목 영역 */}
      <Box className={styles.header}>
        <div style={{display: 'flex'}}>
          <Typography style={{marginRight: '4px'}}>{`Ep.${episodeNum + 1}`}</Typography>

          <Typography>{`${episodeInfo?.name || 'None'}`}</Typography>
        </div>
        <div style={{display: 'flex'}}>
          <div
            className={styles.arrowIcon}
            onClick={() => {
              handleChangeOrderEpisodeIndex(currentEpisode.id, 'up');
            }}
          >
            <img src={BoldArrowDown.src} style={{transform: 'rotate(180deg)'}} alt="Main" />
          </div>
          <div
            className={styles.arrowIcon}
            onClick={() => {
              handleChangeOrderEpisodeIndex(currentEpisode.id, 'down');
            }}
          >
            <img src={BoldArrowDown.src} alt="Main" />
          </div>
          <div
            className={styles.arrowIcon}
            onClick={() => {
              setDropDownOpen(true);
            }}
          >
            <img src={BoldMenuDots.src} style={{transform: 'rotate(180deg)'}} alt="Main" />
          </div>
        </div>
      </Box>
      <Box className={styles.contentBox}>
        <div className={styles.contentTop}>
          <div className={styles.cardBox}>
            {/* Image Section */}
            <div className={styles.cardimageContainer}>
              <div className={styles.cardmainImage}>
                <img src={episodeInfo?.characterInfo.mainImageUrl} alt="Main" />
              </div>
              <div className={styles.cardtopRightButton} onClick={() => onInit()}>
                <img src={editPlusOpacity.src} />
              </div>
            </div>
          </div>
          <div className={styles.contentTopBox}>
            <div className={styles.contentTopName}>
              <b>Suyeon </b>
            </div>
            <div className={styles.contentTopItem}>
              Conversation Template
              <div className={styles.circlePlusIcon} onClick={() => openConversationModal()}>
                <img src={plusRound.src} />
              </div>
            </div>
            <div className={styles.contentTopItem}>
              Trigger Event
              <div className={styles.circlePlusIcon} onClick={() => openTriggerModal()}>
                <img src={plusRound.src} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.episodeScenario}>
          <div className={styles.episodeScenarioItem1}>
            Episode Scenario
            <div className={styles.circlePlusIcon} onClick={() => openEpisodeModal()}>
              <img src={edit1Pixel.src} />
            </div>
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
      {isDropDownOpen && (
        <>
          <div className={styles.editDropdDownBack} onClick={() => setDropDownOpen(false)}></div>
          <div className={styles.editDropdDown}>
            <EpisodeCardDropDown
              save={() => {}}
              close={() => setDropDownOpen(false)}
              open={isDropDownOpen}
              episodeInfo={episodeInfo}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default EpisodeCard;
