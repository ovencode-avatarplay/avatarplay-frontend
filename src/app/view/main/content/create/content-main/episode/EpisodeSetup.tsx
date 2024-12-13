import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore'; // Redux Store의 RootState 가져오기
import {Box} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';

import styles from './EpisodeSetup.module.css';

import ButtonSetupDrawer from '@/components/create/ButtonSetupDrawer';

import EpisodeTrigger from './episode-trigger/EpisodeTrigger';
import ButtonEpisodeInfo from './ButtonEpisodeInfo';

import EpisodeDescription from './episode-description/EpisodeDescription';

import EpisodeImageSetup from './episode-imagesetup/EpisodeImageSetup';

import EpisodeUploadCharacter from './episode-ImageCharacter/EpisodeUploadCharacter';
import EpisodeBackgroundUpload from './episode-ImageCharacter/EpisodeImageUpload';

interface Props {
  onDrawerOpen: () => void;
  contentId: number;
  chapterIdx: number;
  episodeIdx: number;
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

const EpisodeSetup: React.FC<Props> = ({onDrawerOpen, contentId, chapterIdx = 0, episodeIdx = 0}) => {
  // episodeIndex 기본값 0
  // Redux에서 contentInfo 데이터 가져오기
  const contentInfo = useSelector((state: RootState) => state.content.curEditingContentInfo); // contentInfo 가져오기

  const [isTriggerModalOpen, setTriggerModalOpen] = useState(false); // Trigger 모달 열림 상태

  const [isEpisodeModalOpen, setEpisodeModalOpen] = useState(false);
  const [isImageSetupModalOpen, setImageSetupModalOpen] = useState(false);
  const [isAdvanceImageSetupModalOpen, setAdvanceImageSetupModalOpen] = useState(false);
  const [isUploadImageDialogOpen, setUploadImageDialogOpen] = useState(false);

  const [chapterName, setChapterName] = useState('chapterName');
  const [episodeName, setEpisodeName] = useState('episodeName');

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

  useEffect(() => {
    if (contentInfo) {
      const chapter = contentInfo.chapterInfoList[chapterIdx];

      if (chapter) {
        setChapterName(chapter.name);
        const episode = chapter.episodeInfoList[episodeIdx];
        if (episode) {
          // console.log('Success!');
          setEpisodeName(episode.name);
        } else {
          console.log(`Episode at idx ${episodeIdx} not found in Content ${contentId}`);
        }
      } else {
        console.log(`Chapter With Idx ${chapterIdx} not found in ${contentId}`);
      }
    } else {
      console.log(`Content with ID ${contentId} not found`);
    }
  }, [contentInfo, contentId, chapterIdx, episodeIdx]);

  const handleSubmitPopup = (data: any) => {
    console.log('Submitted data:', data);
    // 필요한 처리를 여기에 추가

    setEpisodeModalOpen(false); // Episode 모달 닫기
  };
  return (
    <main className={styles.episodeSetup}>
      <ButtonEpisodeInfo onDrawerOpen={onDrawerOpen} chapterName={chapterName ?? ''} episodeName={episodeName ?? ''} />
      <div className={styles.imageBox}>
        <EpisodeUploadCharacter />
        <EpisodeBackgroundUpload
          onClickEasyCreate={openImageSetup}
          onClickAdvanceCreate={openAdvanceImageSetup}
          uploadImageState={isUploadImageDialogOpen}
          onClickUploadImage={openUploadImageDialog}
          onCloseUploadImage={closeUploadImageDialog}
        />
      </div>
      <Box className={styles.setupButtons}>
        <ButtonSetupDrawer icon={<PersonIcon />} label="SceneDescription" onClick={openEpisodeModal} />
        <ButtonSetupDrawer icon={<BookIcon />} label="TriggerSetup" onClick={openTriggerModal} />
        {/*TODO : Move This into Trigger Setup */}
      </Box>
      {/* EpisodeTrigger 모달 */}
      <EpisodeTrigger open={isTriggerModalOpen} closeModal={closeTriggerModal} /> {/* 모달 상태 전달 */}
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
    </main>
  );
};

export default EpisodeSetup;
