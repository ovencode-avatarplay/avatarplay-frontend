import React, {useState, useEffect} from 'react';
import {Button, Box} from '@mui/material';
import CharacterGalleryGrid from '@/app/view/studio/characterDashboard/CharacterGalleryGrid';
import {GetCharacterInfoReq, sendGetCharacterInfo, sendGetCharacterList} from '@/app/NetWork/CharacterNetwork';
import {CharacterInfo} from '@/redux-store/slices/EpisodeInfo';
import LoadingOverlay from '@/components/create/LoadingOverlay';
import CharacterGrid from '@/app/view/studio/characterDashboard/CharacterGrid';

interface EpisodeCharacterProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
}

const EpisodeCharacter: React.FC<EpisodeCharacterProps> = ({currentStep, setCurrentStep}) => {
  const [currentSelectedCharacter, setCurrentSelectedCharacter] = useState<CharacterInfo | undefined>();
  const [characters, setCharacters] = useState<CharacterInfo[] | undefined>();
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
      console.log('Proceed to next step'); // Step 3 로직 추가
    }
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
          height: '85vh', // 화면의 80% 높이
          overflowY: 'auto', // 세로 스크롤 허용
          padding: 2, // 패딩 추가
        }}
      >
        {currentStep === 1 && <CharacterGrid characters={characters || []} onCharacterSelect={handleCharacterSelect} />}
        {currentStep === 2 && (
          <CharacterGalleryGrid
            itemUrl={galleryAllUrl}
            selectedItemIndex={0}
            onSelectItem={() => {}}
            isTrigger={true}
          />
        )}
      </Box>
      <Box>
        <Button
          sx={{
            m: 1,
            color: 'black',
            borderColor: 'gray',
          }}
          variant="outlined"
          onClick={handleConfirm}
          disabled={currentStep === 1 && !selectedCharacterId} // Step 1에서 캐릭터 선택이 없으면 비활성화
        >
          Confirm
        </Button>
        <LoadingOverlay loading={loading} />
      </Box>
    </>
  );
};

export default EpisodeCharacter;
