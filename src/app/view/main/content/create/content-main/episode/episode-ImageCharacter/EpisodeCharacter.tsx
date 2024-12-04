import React, {useState, useEffect} from 'react';
import {Button, Box} from '@mui/material';
import CharacterGalleryGrid from '@/app/view/studio/characterDashboard/CharacterGalleryGrid';
import {GetCharacterInfoReq, sendGetCharacterInfo, sendGetCharacterList} from '@/app/NetWork/CharacterNetwork';
import {CharacterInfo, setCharacterInfo, setCurrentEpisodeInfo} from '@/redux-store/slices/EpisodeInfo';
import LoadingOverlay from '@/components/create/LoadingOverlay';
import CharacterGrid from '@/app/view/studio/characterDashboard/CharacterGrid';
import EpisodeCharacterView from './EpisodeCharacterView'; // Step 3에 사용할 컴포넌트

import styles from './EpisodeCharacter.module.css';
import {useDispatch} from 'react-redux';
import {TriggerInfo} from '@/types/apps/content/episode/TriggerInfo';

interface EpisodeCharacterProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  onClose: () => void;

  isTrigger?: boolean;
  setTriggerInfo?: React.Dispatch<React.SetStateAction<TriggerInfo>>;
}

const EpisodeCharacter: React.FC<EpisodeCharacterProps> = ({
  currentStep,
  onClose,
  setCurrentStep,
  isTrigger,
  setTriggerInfo,
}) => {
  const [currentSelectedCharacter, setCurrentSelectedCharacter] = useState<CharacterInfo | undefined>();
  const [characters, setCharacters] = useState<CharacterInfo[] | undefined>();
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  // Step 1: 캐릭터 리스트 가져오기
  const getCharacterList = async () => {
    setLoading(true);
    try {
      const response = await sendGetCharacterList({});
      if (response.data) {
        const characterInfoList: CharacterInfo[] = response.data?.characterInfoList;
        setCharacters(characterInfoList);
      } else {
        throw new Error(`No contentInfo in response`);
      }
    } catch (error) {
      console.error('Error fetching character list:', error);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: 선택된 캐릭터 정보 가져오기
  const getCharacterInfo = async (id: number) => {
    setLoading(true);
    try {
      const req: GetCharacterInfoReq = {characterId: id};
      const response = await sendGetCharacterInfo(req);

      if (response.data) {
        const characterInfo: CharacterInfo = response.data?.characterInfo;
        setCurrentSelectedCharacter(characterInfo);
      } else {
        throw new Error(`No characterInfo in response for ID: ${id}`);
      }
    } catch (error) {
      console.error('Error fetching character info:', error);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: 갤러리 URL 생성
  const galleryAllUrl = [
    ...(currentSelectedCharacter?.portraitGalleryImageUrl || []),
    ...(currentSelectedCharacter?.poseGalleryImageUrl || []),
    ...(currentSelectedCharacter?.expressionGalleryImageUrl || []),
  ];

  // 캐릭터 선택 핸들러
  const handleCharacterSelect = (id: number) => {
    setSelectedCharacterId(id);
  };

  // Step 진행 핸들러
  const handleConfirm = async () => {
    if (currentStep === 1 && selectedCharacterId) {
      await getCharacterInfo(selectedCharacterId);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3); // Step 3으로 이동
    }
  };

  const handleFinish = async () => {
    if (!currentSelectedCharacter || selectedGalleryIndex === null) {
      console.error('Character or selected gallery index is not set');
      console.error('currentSelectedCharacter', currentSelectedCharacter);
      console.error('selectedGalleryIndex', selectedGalleryIndex);
      return;
    }

    const updatedCharacterInfo = {
      ...currentSelectedCharacter,
      mainImageUrl: galleryAllUrl[selectedGalleryIndex].imageUrl, // 선택된 이미지 URL 추가
    };

    if (isTrigger && setTriggerInfo) {
      setTriggerInfo(prev => ({
        ...prev, // 기존 상태 복사
        actionCharacterInfo: updatedCharacterInfo,
      }));
    } else {
      dispatch(setCharacterInfo(updatedCharacterInfo)); // Redux 상태 업데이트
    }
    onClose(); // 모달 닫기
  };

  // Step 1 초기화: 컴포넌트 마운트 시 캐릭터 리스트 가져오기
  useEffect(() => {
    if (currentStep === 1) {
      getCharacterList();
    }
  }, [currentStep]);

  return (
    <>
      <Box
        sx={{
          height: '85vh', // 화면의 85% 높이
          overflowY: 'auto', // 세로 스크롤 허용
          padding: 2, // 패딩 추가
        }}
      >
        {currentStep === 1 && <CharacterGrid characters={characters || []} onCharacterSelect={handleCharacterSelect} />}
        {currentStep === 2 && (
          <CharacterGalleryGrid
            itemUrl={galleryAllUrl}
            selectedItemIndex={selectedGalleryIndex}
            onSelectItem={i => {
              setSelectedGalleryIndex(i);
            }}
            isTrigger={true}
          />
        )}
        {currentStep === 3 && currentSelectedCharacter && (
          <EpisodeCharacterView
            imageUrl={galleryAllUrl?.[selectedGalleryIndex || 0].imageUrl || ''}
            characterInfo={currentSelectedCharacter}
            open={true}
            onClose={() => setCurrentStep(2)} // 닫으면 Step 2로 돌아가기
            onChange={() => setCurrentStep(2)} // Change 버튼 클릭 시 Step 2로 돌아가기
          />
        )}
      </Box>
      <Box>
        <Button
          className={styles.confirmButton}
          variant="outlined"
          onClick={currentStep === 3 ? handleFinish : handleConfirm} // Step 3에서 Finish 버튼 클릭 시 모달 닫기
          disabled={(currentStep === 1 && !selectedCharacterId) || (currentStep === 2 && selectedGalleryIndex == null)} // Step 1에서 캐릭터 선택이 없으면 비활성화
        >
          {currentStep === 3 ? 'Finish' : 'Confirm'}
        </Button>

        <LoadingOverlay loading={loading} />
      </Box>
    </>
  );
};

export default EpisodeCharacter;
