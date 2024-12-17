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
// import EpisodeBackgroundUpload from './episode-ImageCharacter/EpisodeImageUpload';

interface Props {}

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

interface Props {
  onOpenEpisodeInitialize: () => void;
  episodeId: number;
}

const EpisodeSetup: React.FC<Props> = ({onOpenEpisodeInitialize, episodeId}) => {
  // episodeIndex 기본값 0
  // Redux에서 contentInfo 데이터 가져오기
  const contentInfo = useSelector((state: RootState) => state.content.curEditingContentInfo); // contentInfo 가져오기

  const [isTriggerModalOpen, setTriggerModalOpen] = useState(false); // Trigger 모달 열림 상태

  const [isEpisodeModalOpen, setEpisodeModalOpen] = useState(false);
  const [isImageSetupModalOpen, setImageSetupModalOpen] = useState(false);

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
    <main className={styles.episodeSetup}>
      {/* TODO : 이 아래의 내용 Image, SeceneDesc, EpisodeTrigger 전부 하나의 컴포넌트 EpisodeItem 으로 만들어서 EpisodeList로 감싸기.*/}
      <div className={styles.imageBox}>
        <EpisodeUploadCharacter />
        <button onClick={onOpenEpisodeInitialize}>
          {' '}
          임시 EpisodeInitialize 열기버튼 <br />
          이미지에 붙은 버튼에 연결하고 삭제{' '}
        </button>
      </div>
      <Box className={styles.setupButtons}>
        <ButtonSetupDrawer icon={<PersonIcon />} label="SceneDescription" onClick={openEpisodeModal} />
        <ButtonSetupDrawer icon={<BookIcon />} label="TriggerSetup" onClick={openTriggerModal} />
      </Box>
    </main>
  );
};

export default EpisodeSetup;
