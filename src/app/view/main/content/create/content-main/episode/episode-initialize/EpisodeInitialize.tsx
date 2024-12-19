import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {Drawer} from '@mui/material';
import {useRouter} from 'next/navigation';

import styles from './EpisodeInitialize.module.css';

import {GetCharacterInfoReq, sendGetCharacterInfo, sendGetCharacterList} from '@/app/NetWork/CharacterNetwork';
import {CharacterInfo, EpisodeInfo} from '@/redux-store/slices/EpisodeInfo';

import emptyContent from '@/data/create/empty-content-info-data.json';

import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import EpisodeInitializeStep from './EpisodeInitializeStep';
import CharacterGrid from '@/app/view/studio/characterDashboard/CharacterGrid';
import CharacterGalleryGrid from '@/app/view/studio/characterDashboard/CharacterGalleryGrid';
import EpisodeSetNamePopup from './EpisodeSetNamePopup';
import EpisodeUploadImage from './EpisodeUploadImage';
import {RootState} from '@/redux-store/ReduxStore';
import ImageUploadDialog from '../episode-ImageCharacter/ImageUploadDialog';
import {MediaState, MediaUploadReq, sendUpload} from '@/app/NetWork/ImageNetwork';

interface Props {
  open: boolean;
  isEditing: boolean;
  onClose: () => void;
  modifyEpisodeOper: (episodeInfo: EpisodeInfo) => void;
  addEpisodeOper: (episodeInfo: EpisodeInfo) => void;
  episodeName: string;
}

const EpisodeInitialize: React.FC<Props> = ({
  open,
  isEditing,
  onClose,
  modifyEpisodeOper,
  addEpisodeOper,
  episodeName,
}) => {
  //#region 선언
  // 공통
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);

  const [isInitFinished, setIsInitFinished] = useState<boolean>(false);
  const [isEpisodeNameOn, setIsEpisodeNameOn] = useState<boolean>(false);

  // 에피소드 생성시 가져올 빈 데이터
  let emptyEpisodeInfo = emptyContent.data.contentInfo.chapterInfoList[0].episodeInfoList[0];
  // 편집시 가져올데이터
  const editingEpisodeInfo = useSelector((state: RootState) => state.episode.currentEpisodeInfo);

  // 스텝
  const [maxStep, setMaxStep] = useState<number>(4);
  const [curStep, setCurStep] = useState<number>(0); // 0일때는 max 수치가 변동이 있을 수 있기때문에 step이 가려집니다.
  type UploadType = 'SelectCharacter' | 'UploadImage' | 'GenerateImage';
  const [uploadType, setUploadType] = useState<UploadType>('SelectCharacter');
  const stepTexts: Record<UploadType, string[]> = {
    SelectCharacter: ['Select a character', 'Select an image', 'Select a background'],
    UploadImage: ['Upload your image', 'Describe character in scene'],
    GenerateImage: ['Write an image you want', 'Select an image', 'Describe character in the scene'],
  };
  const finalStepText = 'Write the title of the episode';

  const maxNameLength: number = 50;
  const maxPromptLength: number = 500;
  const [nameValue, setNameValue] = useState<string>('');
  const [promptValue, setPromptValue] = useState<string>('');

  // 캐릭터 선택
  const [currentSelectedCharacter, setCurrentSelectedCharacter] = useState<CharacterInfo | undefined>();
  const [characters, setCharacters] = useState<CharacterInfo[] | undefined>();
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number | null>(null);

  // 이미지 업로드
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // 이미지 생성

  // 저장될 데이터
  const [curEpisodeName, setCurEpisodeName] = useState<string>(episodeName);
  const [curEpisodeCharacterImage, setCurEpisodeCharacterImage] = useState<string>('');

  //#endregion

  //#region  함수
  // 데이터 초기화
  const initData = () => {
    setIsEpisodeNameOn(false);
    setCurStep(0);
    setUploadType('SelectCharacter');
    setNameValue('');
    setPromptValue('');
    setCurrentSelectedCharacter(undefined);
    setSelectedCharacterId(null);
    setSelectedGalleryIndex(null);
    setCurEpisodeName('');
    setCurEpisodeCharacterImage('');
  };

  // 공통
  const getStepText = () => {
    if (curStep >= maxStep) {
      return finalStepText;
    }
    const currentStep = stepTexts[uploadType][curStep - 1]; // 0부터 시작이므로 curStep - 1
    return currentStep || '';
  };

  // 스텝
  function checkFinalStep() {
    if (curStep === maxStep) return true;
    return false;
  }
  function addStep() {
    if (!checkEssential()) {
      alert('필수 선택 항목이 선택되지 않았습니다.');
      return;
    }

    setCurStep(prev => Math.min(prev + 1, maxStep));
    handleConfirm();
  }

  function checkEssential() {
    if (curStep > 0) {
      switch (uploadType) {
        case 'SelectCharacter':
          {
            if (curStep === 1 && selectedCharacterId === null) {
              return false;
            }
            if (
              curStep === 2 &&
              (selectedGalleryIndex === null ||
                currentSelectedCharacter === null ||
                currentSelectedCharacter === undefined)
            ) {
              return false;
            }
          }
          break;
        case 'UploadImage':
          {
            if (curStep === 1 && curEpisodeCharacterImage === '') {
              return false;
            }
            if (curStep === 2 && (nameValue === '' || promptValue === '')) {
              return false;
            }
          }
          break;
        case 'GenerateImage':
          {
            if (curStep === 3 && (nameValue === '' || promptValue === '')) {
              return false;
            }
          }
          break;
      }
    }
    return true;
  }

  function subStep() {
    setCurStep(prev => Math.max(prev - 1, 0));
  }

  // 캐릭터 선택
  const getCharacterList = async () => {
    if (characters) {
      // 이미 데이터를 불러온 후
      return;
    }
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

  const galleryAllUrl = [
    ...(currentSelectedCharacter?.portraitGalleryImageUrl || []),
    ...(currentSelectedCharacter?.poseGalleryImageUrl || []),
    ...(currentSelectedCharacter?.expressionGalleryImageUrl || []),
  ];
  //#endregion

  //#region handler
  // 공통

  const handleOnSetEpisodeName = () => {
    if (!checkEssential()) {
      alert('필수 선택 항목이 선택되지 않았습니다.');
      return;
    }
    setIsEpisodeNameOn(true);
  };

  const handleSetEpisodeNameComplete = (name: string) => {
    if (!checkEssential()) {
      alert('필수 선택 항목이 선택되지 않았습니다.');
      return;
    }

    setCurEpisodeName(name);
    setIsEpisodeNameOn(false);

    handlerOnCompleteInit();
  };

  const handlerOnCompleteInit = () => {
    let episodeInfo: EpisodeInfo;

    const baseEpisodeInfo = isEditing ? editingEpisodeInfo : emptyEpisodeInfo;

    if (uploadType === 'SelectCharacter') {
      if (!currentSelectedCharacter) {
        console.error("No character selected. Can't complete initialization.");
        return;
      }

      episodeInfo = {
        ...baseEpisodeInfo,
        name: curEpisodeName,
        characterInfo: {
          id: currentSelectedCharacter.id,
          name: currentSelectedCharacter.name,
          introduction: currentSelectedCharacter.introduction,
          description: currentSelectedCharacter.description,
          genderType: currentSelectedCharacter.genderType,
          mainImageUrl: currentSelectedCharacter.mainImageUrl,
          portraitGalleryImageUrl: currentSelectedCharacter.portraitGalleryImageUrl,
          poseGalleryImageUrl: currentSelectedCharacter.poseGalleryImageUrl,
          expressionGalleryImageUrl: currentSelectedCharacter.expressionGalleryImageUrl,
          visibilityType: currentSelectedCharacter.visibilityType,
          isMonetization: currentSelectedCharacter.isMonetization,
          state: currentSelectedCharacter.state,
        },
      };
    } else if (uploadType === 'UploadImage' || uploadType === 'GenerateImage') {
      episodeInfo = {
        ...baseEpisodeInfo,
        name: curEpisodeName,
        characterInfo: {
          ...emptyEpisodeInfo.characterInfo,
          name: nameValue,
          description: promptValue,
          mainImageUrl: curEpisodeCharacterImage,
        },
      };
    } else {
      console.error('Invalid uploadType. Unable to generate episodeInfo.');
      return;
    }

    console.log('Final Episode Info:', episodeInfo);

    setIsInitFinished(true);
    if (isEditing) {
      modifyEpisodeOper(episodeInfo);
    } else {
      addEpisodeOper(episodeInfo);
    }
    onClose();
    initData();
  };

  const handlerOnClose = () => {
    if (isInitFinished) {
      onClose();
      initData();
    } else {
      router.back();
    }
  };

  // 업로드 타입 선택
  const handleOnSelectCharacter = () => {
    setMaxStep(3);
    setUploadType('SelectCharacter');
    addStep();
  };

  const handleOnUploadImageClick = () => {
    if (curEpisodeCharacterImage !== '') {
      handleOnUploadImage();
    } else {
      setUploadDialogOpen(true);
    }
  };

  const handleOnUploadImage = () => {
    setMaxStep(2);
    setUploadType('UploadImage');
    addStep();
  };

  const handleOnGenerateImage = () => {
    setMaxStep(3);
    setUploadType('GenerateImage');
    addStep();
  };

  // 캐릭터 설명

  const handleCharacterDescNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= maxNameLength) {
      setNameValue(e.target.value);
    }
  };

  const handleCharacterDescPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxPromptLength) {
      setPromptValue(e.target.value);
    }
  };

  //캐릭터 선택
  const handleCharacterSelect = (id: number) => {
    setSelectedCharacterId(id);
  };

  const handleConfirm = async () => {
    if (curStep === 1 && selectedCharacterId) {
      await getCharacterInfo(selectedCharacterId);
    }
  };

  // 이미지 업로드

  const handleFileSelection = async (file: File) => {
    setLoading(true);
    try {
      const req: MediaUploadReq = {
        mediaState: MediaState.CharacterImage,
        file: file,
      };
      const response = await sendUpload(req);
      if (response?.data) {
        const imgUrl: string = response.data.url;

        setCurEpisodeCharacterImage(imgUrl);

        handleOnUploadImage();
      } else {
        throw new Error('Unexpected API response: No data');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  // 이미지 생성

  //#endregion

  //#region Hook

  useEffect(() => {
    // 에피소드카드 이미지의 버튼으로 편집 들어왔을때 값 세팅
    if (isEditing) {
      setCurEpisodeCharacterImage(editingEpisodeInfo.characterInfo.mainImageUrl);
      setNameValue(editingEpisodeInfo.characterInfo.name);
      setPromptValue(editingEpisodeInfo.characterInfo.description);
    }
  }, [isEditing]);

  // 캐릭터 선택
  useEffect(() => {
    if (uploadType === 'SelectCharacter' && curStep === 1) {
      getCharacterList();
    }
  }, [curStep]);

  //#endregion

  //#region 렌더링을 위한 함수
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div className={styles.uploadType}>
            <div className={styles.buttonArea}>
              <button className={styles.uploadButton} onClick={handleOnSelectCharacter}>
                <div className={styles.buttonIconBack}>
                  <img className={styles.buttonIcon} />
                </div>
                <div className={styles.buttonText}>Select Character</div>
              </button>

              <button className={styles.uploadButton} onClick={handleOnUploadImageClick}>
                <div className={styles.buttonIconBack}>
                  <img className={styles.buttonIcon} />
                </div>
                <div className={styles.buttonText}>Upload Image</div>
              </button>

              <button className={styles.uploadButton} onClick={handleOnGenerateImage}>
                <div className={styles.buttonIconBack}>
                  <img className={styles.buttonIcon} />
                </div>
                <div className={styles.buttonText}>Generate Image</div>
              </button>
            </div>
            <ImageUploadDialog
              isOpen={uploadDialogOpen}
              onClose={() => setUploadDialogOpen(false)}
              onFileSelect={handleFileSelection}
            />
          </div>
        );
      case 1:
        return (
          <>
            {uploadType === 'SelectCharacter' ? (
              <CharacterGrid characters={characters || []} onCharacterSelect={handleCharacterSelect} />
            ) : uploadType === 'UploadImage' ? (
              <>
                <EpisodeUploadImage imgUrl={curEpisodeCharacterImage} setImgUrl={setCurEpisodeCharacterImage} />
              </>
            ) : (
              <>GenerateImage1</>
            )}
          </>
        );
      case 2:
        return (
          <>
            {uploadType === 'SelectCharacter' ? (
              <CharacterGalleryGrid
                itemUrl={galleryAllUrl}
                selectedItemIndex={selectedGalleryIndex}
                onSelectItem={i => {
                  setSelectedGalleryIndex(i);
                }}
                isTrigger={true}
              />
            ) : uploadType === 'UploadImage' ? (
              <div>{getInputCharacterDesc()}</div>
            ) : (
              <>GenerateImage2</>
            )}
          </>
        );
      case 3:
        return <>{uploadType === 'SelectCharacter' ? <>SelectCharacter3</> : <div>{getInputCharacterDesc()}</div>}</>;
    }
  };

  const getInputCharacterDesc = () => {
    return (
      <div className={styles.inputCharacterDesc}>
        <div className={styles.characterDesc}>
          <div className={styles.title}>CharacterName</div>
          <input
            className={styles.inputBox}
            placeholder="Text Placeholder"
            value={nameValue}
            onChange={handleCharacterDescNameChange}
            maxLength={maxNameLength}
          />
        </div>
        <div className={styles.characterDesc}>
          <div className={styles.title}>CharacterPrompt</div>
          <div className={styles.inputArea}>
            <textarea
              className={styles.inputPrompt}
              placeholder="Text Placeholder"
              value={promptValue}
              onChange={handleCharacterDescPromptChange}
              maxLength={maxPromptLength}
            />

            <div className={styles.inputHint}>
              {promptValue.length} / {maxPromptLength}
            </div>
          </div>
        </div>
      </div>
    );
  };
  //#endregion

  return (
    <>
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {width: '100vw', height: '100vh', maxWidth: '500px', margin: '0 auto'},
        }}
      >
        <CreateDrawerHeader title="EpisodeCreate" onClose={handlerOnClose} />
        {curStep > 0 && (
          <>
            <EpisodeInitializeStep maxStep={maxStep} curStep={curStep} />
            <div className={styles.stepDesc}>
              Step {curStep}. {getStepText()}
            </div>
          </>
        )}
        {getStepContent(curStep)}
        {/* Float Button */}
        <div className={styles.floatButtonArea}>
          <button
            className={`${styles.floatButton} ${styles.prevButton}`}
            onClick={() => {
              subStep();
            }}
          >
            <img className={styles.buttonIcon} />
            <div>Previous</div>
          </button>
          <button
            className={`${styles.floatButton} ${styles.nextButton}`}
            onClick={() => {
              {
                checkFinalStep() === true ? handleOnSetEpisodeName() : addStep();
              }
            }}
          >
            <div>{checkFinalStep() === true ? 'Set Episode Name' : 'Next'}</div>
            <img className={styles.buttonIcon} />
          </button>
        </div>

        <EpisodeSetNamePopup
          open={isEpisodeNameOn}
          onClickCancel={() => {
            setIsEpisodeNameOn(false);
          }}
          onClickComplete={handleSetEpisodeNameComplete}
        />
      </Drawer>
    </>
  );
};

export default EpisodeInitialize;
