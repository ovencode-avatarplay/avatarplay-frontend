import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import {Drawer} from '@mui/material';
import {useRouter} from 'next/navigation';

import styles from './EpisodeInitialize.module.css';

import {GetCharacterInfoReq, sendGetCharacterInfo, sendGetCharacterList} from '@/app/NetWork/CharacterNetwork';
import {CharacterInfo, EpisodeInfo, GalleryImageInfo} from '@/redux-store/slices/EpisodeInfo';

import emptyContent from '@/data/create/empty-content-info-data.json';

import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import CustomStepper from '@/components/layout/shared/CustomStepper';
import CharacterGrid from '@/app/view/studio/characterDashboard/CharacterGrid';
import CharacterGalleryGrid from '@/app/view/studio/characterDashboard/CharacterGalleryGrid';
import EpisodeSetNamePopup from './EpisodeSetNamePopup';
import EpisodeUploadImage from './EpisodeUploadImage';
import {RootState} from '@/redux-store/ReduxStore';
import ImageUploadDialog from '../episode-ImageCharacter/ImageUploadDialog';
import {
  GenerateImageReq2,
  MediaState,
  MediaUploadReq,
  sendGenerateImageReq2,
  sendUpload,
} from '@/app/NetWork/ImageNetwork';
import {GalleryCategory} from '@/app/view/studio/characterDashboard/CharacterGalleryData';
import CharacterGalleryToggle from '@/app/view/studio/characterDashboard/CharacterGalleryToggle';
import EpisodeInitializeBackground from './EpisodeInitializeBackground';

import styleData from './EpisodeGenerateInputStyles.json';
import bgData from './EpisodeBackground.json';
import loRaStyles from '@/data/stable-diffusion/episode-temporary-character-lora.json';

import CreateTempCharacterImage from '../../../character/CreateTempCharacterImage';
import CreateTempCharacterSelect from '../../../character/CreateTempCharacterSelect';
import {BoldRuby, LineArrowLeft, LineArrowRight, LineCharacter, LineCheck, LineUpload} from '@ui/Icons';
import MaxTextInput, {displayType} from '@/components/create/MaxTextInput';
import CustomButton from '@/components/layout/shared/CustomButton';
import CustomPopup from '@/components/layout/shared/CustomPopup';
import CustomInput from '@/components/layout/shared/CustomInput';

interface Props {
  open: boolean;
  isFromInitFirstEpisode: boolean;
  setIsFromInitFirstEpisode: React.Dispatch<React.SetStateAction<boolean>>;
  isEditing: boolean;
  isFromChapterFirstEpisode: boolean;
  onClose: () => void;
  modifyEpisodeOper: (episodeInfo: EpisodeInfo) => void;
  addEpisodeOper: (episodeInfo: EpisodeInfo) => void;
  addChapterOper: (episodeInfo: EpisodeInfo) => void;
  episodeName: string;
  isInitFinished: boolean;
  setIsInitFinished: React.Dispatch<React.SetStateAction<boolean>>;
}

const EpisodeInitialize: React.FC<Props> = ({
  open,
  isFromInitFirstEpisode,
  setIsFromInitFirstEpisode,
  isEditing,
  isFromChapterFirstEpisode,
  onClose,
  modifyEpisodeOper,
  addEpisodeOper,
  addChapterOper,
  episodeName,
  isInitFinished,
  setIsInitFinished,
}) => {
  //#region 선언
  // 공통
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

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

  const [episodeNameValue, setEpisodeNameValue] = useState<string>(episodeName);

  // 캐릭터 선택
  const [currentSelectedCharacter, setCurrentSelectedCharacter] = useState<CharacterInfo | undefined>();
  const [characters, setCharacters] = useState<CharacterInfo[] | undefined>();
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number | null>(null);
  const [category, setCategory] = useState<GalleryCategory>(GalleryCategory.Portrait);
  const [lastCategory, setLastCategory] = useState<GalleryCategory>(GalleryCategory.All);
  const [itemUrl, setItemUrl] = useState<GalleryImageInfo[] | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<number>(0);
  const [backgrounds, setBackgrounds] = useState(bgData);

  // 이미지 업로드
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // 이미지 생성
  const [generatePromptValue, setGeneratePromptValue] = useState<string>('');
  const maxGeneratePromptLength: number = 500;
  const [selectedStyle, setSelectedStyle] = useState<number>(0);
  const [selectedGeneratedImage, setSelectedGeneratedImage] = useState<number>(0);
  const [generatedImage, setGeneratedImage] = useState<string[]>([
    'https://avatar-play.s3.ap-northeast-2.amazonaws.com/image/3badeb75-c620-4086-b283-743064d62f67.jpg',
    'https://avatar-play.s3.ap-northeast-2.amazonaws.com/image/3badeb75-c620-4086-b283-743064d62f67.jpg',
    'https://avatar-play.s3.ap-northeast-2.amazonaws.com/image/3badeb75-c620-4086-b283-743064d62f67.jpg',
    'https://avatar-play.s3.ap-northeast-2.amazonaws.com/image/3badeb75-c620-4086-b283-743064d62f67.jpg',
  ]);
  const generateCost = 30;

  // 저장될 데이터
  const [curEpisodeName, setCurEpisodeName] = useState<string>(episodeName);
  const [curEpisodeCharacterImage, setCurEpisodeCharacterImage] = useState<string>('');

  // SVG
  const getAIImage = (color: string) => {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${styles.buttonIcon}`}
      >
        <path
          d="M12 3H9.4C7.15979 3 6.03969 3 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3 6.03969 3 7.15979 3 9.4V14.6C3 16.8402 3 17.9603 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C6.03969 21 7.15979 21 9.4 21H15.3337C16.8847 21 17.6602 21 18.2855 20.7878C19.4633 20.3881 20.3881 19.4633 20.7878 18.2855C21 17.6602 21 16.8847 21 15.3337C21 14.3567 21 13.8682 20.8549 13.5627C20.5794 12.9828 19.9655 12.6426 19.3278 12.7163C18.9918 12.7551 18.5775 13.014 17.749 13.5319L14.8889 15.3194C13.7591 16.0256 12.3053 15.9355 11.2712 15.0954C9.99433 14.0579 8.13101 14.1914 7.01509 15.4003L6 16.5"
          style={{stroke: color}}
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M18.9706 1.64505C18.9772 1.61278 19.0233 1.61278 19.0299 1.64505C19.3722 3.31953 20.6808 4.62812 22.3552 4.97038C22.3875 4.97697 22.3875 5.02307 22.3552 5.02966C20.6808 5.37191 19.3722 6.68051 19.0299 8.35499C19.0233 8.38725 18.9772 8.38725 18.9706 8.35499C18.6284 6.68051 17.3198 5.37191 15.6453 5.02966C15.613 5.02307 15.613 4.97697 15.6453 4.97038C17.3198 4.62812 18.6284 3.31953 18.9706 1.64505Z"
          stroke="#FD55D3"
          stroke-width="1.5"
        />
        <path d="M9 9V9.1" style={{stroke: color}} stroke-width="1.5" stroke-linecap="round" />
      </svg>
    );
  };

  //#endregion

  //#region  함수
  // 데이터 초기화
  const initData = () => {
    setIsEpisodeNameOn(false);
    setCurStep(0);
    setUploadType('SelectCharacter');
    setNameValue('');
    setEpisodeNameValue('');
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

  function checkCenterButtonStep() {
    if (uploadType === 'GenerateImage' && curStep === 2) return true;

    return false;
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
            if (curStep === 1 && generatedImage.length < 1) {
              return false;
            }
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

  const getGalleryAllUrl = (): GalleryImageInfo[] => {
    return [
      ...(currentSelectedCharacter?.portraitGalleryImageUrl || []),
      ...(currentSelectedCharacter?.poseGalleryImageUrl || []),
      ...(currentSelectedCharacter?.expressionGalleryImageUrl || []),
    ];
  };

  // 이미지 생성
  const handleImageGeneration = async () => {
    setLoading(true);
    try {
      const selectedModel = loRaStyles.hairStyles.find(style => style.value === selectedStyle);
      const modelId = selectedModel ? selectedModel.label : 'MeinaHentai'; // 선택된 모델 ID 설정

      const payload: GenerateImageReq2 = {
        modelId: modelId, // 필요한 모델 ID를 지정
        prompt: generatePromptValue,
        negativePrompt: '',
        batchSize: 4, // 슬라이더 값 사용
        seed: -1, // Seed 처리
      };

      const response = await sendGenerateImageReq2(payload); // API 요청
      const newImages = response.data?.imageUrl || [];

      // 기존 로컬스토리지 값 가져오기
      addToLocalStorage(newImages);

      // 상태도 업데이트
      setGeneratedImage(prev => [...prev, ...newImages]);
    } catch (error) {
      alert('Failed to generate images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addToLocalStorage = (newImages: string[]) => {
    // 기존 로컬 스토리지 데이터 가져오기
    const savedImages = JSON.parse(localStorage.getItem('generatedImages') || '[]');

    // 기존 데이터와 새 데이터를 병합
    const updatedImages = [...savedImages, ...newImages];

    // 병합된 데이터를 로컬 스토리지에 저장
    localStorage.setItem('generatedImages', JSON.stringify(updatedImages));
  };

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

  const handleSetEpisodeNameComplete = () => {
    setCurEpisodeName(episodeNameValue);
    setIsEpisodeNameOn(false);

    handlerOnCompleteInit(episodeNameValue);
  };

  const handlerOnCompleteInit = (name: string) => {
    let episodeInfo: EpisodeInfo;

    const baseEpisodeInfo = isEditing ? editingEpisodeInfo : emptyEpisodeInfo;

    if (uploadType === 'SelectCharacter') {
      if (!currentSelectedCharacter) {
        console.error("No character selected. Can't complete initialization.");
        return;
      }

      episodeInfo = {
        ...baseEpisodeInfo,
        name: name,
        backgroundImageUrl: '',
        characterInfo: {
          greeting: currentSelectedCharacter.greeting,
          secret: currentSelectedCharacter.secret,
          worldScenario: currentSelectedCharacter.worldScenario,
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
        name: name,
        characterInfo: {
          ...emptyEpisodeInfo.characterInfo,
          name: nameValue,
          description: promptValue,
          mainImageUrl: curEpisodeCharacterImage,
          secret: '',
          worldScenario: '',
          greeting: '',
        },
      };
    } else {
      console.error('Invalid uploadType. Unable to generate episodeInfo.');
      return;
    }
    setIsInitFinished(true);
    if (isFromInitFirstEpisode || isEditing) {
      modifyEpisodeOper(episodeInfo);
      setIsFromInitFirstEpisode(false);
    } else if (isFromChapterFirstEpisode) {
      addChapterOper(episodeInfo);
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
      setCategory(GalleryCategory.All);
      await getCharacterInfo(selectedCharacterId);
    }
  };

  const handleCategoryChange = (newCategory: GalleryCategory) => {
    if (newCategory !== category) {
      setCategory(newCategory);
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

  const handleGeneratePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxPromptLength) {
      setGeneratePromptValue(e.target.value);
    }
  };
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

  useEffect(() => {
    // 카테고리 전환 시 아이템과 인덱스를 갱신

    if (currentSelectedCharacter && uploadType === 'SelectCharacter' && curStep === 2) {
      switch (category) {
        case GalleryCategory.Portrait:
          setItemUrl(currentSelectedCharacter?.portraitGalleryImageUrl || null);
          break;
        case GalleryCategory.Pose:
          setItemUrl(currentSelectedCharacter?.poseGalleryImageUrl || null);
          break;
        case GalleryCategory.Expression:
          setItemUrl(currentSelectedCharacter?.expressionGalleryImageUrl || null);
          break;
        default:
          setItemUrl(getGalleryAllUrl() || null);
      }
      setSelectedGalleryIndex(0);
      setLastCategory(category);
    }
  }, [category, currentSelectedCharacter, curStep]);

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
                  <img src={LineCharacter.src} className={`${styles.buttonIcon} ${styles.blackIcon}`} />
                </div>
                <div className={styles.buttonText}>Select Character</div>
              </button>

              <button className={styles.uploadButton} onClick={handleOnUploadImageClick}>
                <div className={styles.buttonIconBack}>
                  <img src={LineUpload.src} className={`${styles.buttonIcon} ${styles.blackIcon}`} />
                </div>
                <div className={styles.buttonText}>Upload Image</div>
              </button>

              <button className={styles.uploadButton} onClick={handleOnGenerateImage}>
                <div className={styles.buttonIconBack}>{getAIImage('black')}</div>
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
              <CreateTempCharacterImage
                styleData={styleData}
                generatePromptValue={generatePromptValue}
                maxGeneratePromptLength={maxGeneratePromptLength}
                handleGeneratePromptChange={handleGeneratePromptChange}
                onClickGenerate={handleImageGeneration}
                selectedIdx={selectedStyle}
                onSelect={setSelectedStyle}
              />
            )}
          </>
        );
      case 2:
        return (
          <>
            {uploadType === 'SelectCharacter' ? (
              <>
                <CharacterGalleryToggle category={category} onCategoryChange={handleCategoryChange} />

                <CharacterGalleryGrid
                  itemUrl={itemUrl}
                  selectedItemIndex={selectedGalleryIndex}
                  onSelectItem={i => {
                    setSelectedGalleryIndex(i);
                  }}
                  category={category}
                  isTrigger={true}
                />
              </>
            ) : uploadType === 'UploadImage' ? (
              <div>{getInputCharacterDesc()}</div>
            ) : (
              <CreateTempCharacterSelect
                urls={generatedImage}
                selectedIdx={selectedGeneratedImage}
                onSelect={setSelectedGeneratedImage}
              />
            )}
          </>
        );
      case 3:
        return (
          <>
            {uploadType === 'SelectCharacter' ? (
              <EpisodeInitializeBackground
                data={bgData}
                selectedIdx={selectedBackground}
                onSelect={setSelectedBackground}
              />
            ) : (
              <div>{getInputCharacterDesc()}</div>
            )}
          </>
        );
    }
  };

  const getInputCharacterDesc = () => {
    return (
      <div className={styles.inputCharacterDesc}>
        <div className={styles.characterDesc}>
          <CustomInput
            inputType="Basic"
            textType="Label"
            value={nameValue}
            onChange={handleCharacterDescNameChange}
            maxLength={maxNameLength}
            label="Character Name"
            customClassName={[styles.inputBox]}
          />
        </div>
        <div className={styles.characterDesc}>
          <MaxTextInput
            promptValue={promptValue}
            handlePromptChange={handleCharacterDescPromptChange}
            maxPromptLength={maxPromptLength}
            displayDataType={displayType.LabelAndHint}
            labelText="CharacterPrompt"
          />
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
          sx: {
            width: 'var(--full-width)',
            height: '100vh',
            margin: '0 auto',
            overflowX: 'hidden',
            overflowY: 'hidden',
          },
        }}
      >
        <CreateDrawerHeader title="EpisodeCreate" onClose={handlerOnClose} />
        {curStep > 0 && (
          <>
            <CustomStepper maxStep={maxStep} curStep={curStep} />
            <div className={styles.stepDesc}>
              Step {curStep}. {getStepText()}
            </div>
          </>
        )}
        {getStepContent(curStep)}
        {/* Float Button */}
        <div className={styles.floatButtonArea}>
          <CustomButton
            size="Medium"
            type="Tertiary"
            state="IconLeft"
            icon={LineArrowLeft.src}
            iconClass={`${styles.buttonIcon} ${styles.blackIcon}`}
            customClassName={[
              styles.floatButton,
              styles.prevButton,
              checkCenterButtonStep() ? styles.centerSideButton : '',
            ]}
            onClick={() => {
              subStep();
            }}
          >
            Previous
          </CustomButton>
          {checkCenterButtonStep() && (
            <CustomButton
              size="Medium"
              type="Tertiary"
              state="IconLeft"
              icon={BoldRuby.src}
              iconClass={`${styles.buttonIcon} ${styles.blackIcon}`}
              customClassName={[
                styles.floatButton,
                styles.centerButton,
                checkCenterButtonStep() ? styles.centerSideButton : '',
              ]}
            >
              Generate
            </CustomButton>
          )}
          <CustomButton
            size="Medium"
            type="Primary"
            state="IconRight"
            icon={checkCenterButtonStep() ? LineCheck.src : LineArrowRight.src}
            iconClass={checkCenterButtonStep() ? styles.buttonCheckIcon : styles.buttonIcon}
            customClassName={[
              styles.floatButton,
              styles.nextButton,
              checkCenterButtonStep() ? styles.centerSideButton : '',
            ]}
            onClick={() => {
              {
                checkFinalStep() === true ? handleOnSetEpisodeName() : addStep();
              }
            }}
          >
            {checkFinalStep() === true ? 'Complete' : checkCenterButtonStep() ? 'Confirm' : 'Next'}
          </CustomButton>
        </div>
        {isEpisodeNameOn && (
          <CustomPopup
            type="input"
            title="Episode Title"
            inputField={{
              value: episodeNameValue,
              onChange: e => setEpisodeNameValue(e.target.value),
              maxLength: 50,
              placeholder: 'Input Episode Name',
            }}
            buttons={[
              {
                label: 'Cancel',
                onClick: () => {
                  setIsEpisodeNameOn(false);
                },
                isPrimary: false,
              },
              {
                label: 'Complete',
                onClick: handleSetEpisodeNameComplete,
                isPrimary: true,
              },
            ]}
          />
        )}
      </Drawer>
    </>
  );
};

export default EpisodeInitialize;
