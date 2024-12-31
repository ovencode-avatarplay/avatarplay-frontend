import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useRouter} from 'next/navigation';

import styles from './TriggerCreate.module.css';

import {GetCharacterInfoReq, sendGetCharacterInfo, sendGetCharacterList} from '@/app/NetWork/CharacterNetwork';
import {CharacterInfo, EpisodeInfo, GalleryImageInfo} from '@/redux-store/slices/EpisodeInfo';

import emptyContent from '@/data/create/empty-content-info-data.json';

import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import CharacterGrid from '@/app/view/studio/characterDashboard/CharacterGrid';
import CharacterGalleryGrid from '@/app/view/studio/characterDashboard/CharacterGalleryGrid';
import {RootState} from '@/redux-store/ReduxStore';
import {MediaState, MediaUploadReq, sendUpload} from '@/app/NetWork/ImageNetwork';
import {GalleryCategory} from '@/app/view/studio/characterDashboard/CharacterGalleryData';
import CharacterGalleryToggle from '@/app/view/studio/characterDashboard/CharacterGalleryToggle';
import {
  BoldRuby,
  EmotionAngry,
  EmotionBored,
  EmotionExcited,
  EmotionHappy,
  EmotionSad,
  EmotionScared,
  LineArrowLeft,
  LineArrowRight,
  LineCharacter,
  LineCheck,
  LineUpload,
} from '@ui/Icons';
import {TriggerActionType, TriggerTypeNames} from '@/types/apps/DataTypes';
import {TriggerInfo} from '@/types/apps/content/episode/TriggerInfo';
import EpisodeInitializeStep from '../episode-initialize/EpisodeInitializeStep';
import Modal from '@mui/material/Modal/Modal';
import MaxTextInput, {inputType as inputType} from '@/components/create/MaxTextInput';

interface Props {
  open: boolean;
  onClose: () => void;
  isEditing: boolean;
}

const TriggerCreate: React.FC<Props> = ({open, isEditing, onClose}) => {
  //#region 선언
  // 공통

  const tempTriggerInfo: TriggerInfo = {
    episodeId: 0, // 기본 에피소드 ID
    id: 0, // 임시 값, addTriggerInfo에서 자동 생성됨
    name: '새 트리거', // 기본 이름
    triggerType: 0, // 기본 트리거 유형
    triggerValueIntimacy: 0, // 기본 친밀도 값
    triggerValueChatCount: 0, // 기본 채팅 횟수
    triggerValueKeyword: '', // 기본 키워드
    triggerValueTimeMinute: 0, // 기본 시간 값
    triggerActionType: 0, // 기본 액션 유형
    emotionState: 0,
    actionChangeEpisodeId: 0, // 기본 에피소드 변경 ID
    actionPromptScenarioDescription: '', // 기본 설명
    actionIntimacyPoint: 0, // 기본 친밀도 포인트
    maxIntimacyCount: 0, // 기본 최대 친밀도 횟수
    actionCharacterInfo: {
      id: 0,
      name: '',
      introduction: '',
      description: '',
      genderType: 0,
      mainImageUrl: '',
      portraitGalleryImageUrl: [],
      poseGalleryImageUrl: [],
      expressionGalleryImageUrl: [],
      visibilityType: 0,
      isMonetization: false,
      state: 0,
    }, // 기본 캐릭터 정보
    actionMediaState: 0, // 기본 미디어 상태
    actionMediaUrlList: [], // 기본 미디어 URL 리스트
    actionConversationList: [], // 기본 대화 리스트
  };

  const [triggerInfo, setTriggerInfo] = useState<TriggerInfo>(tempTriggerInfo);

  const [loading, setLoading] = useState<boolean>(true);

  //   // 에피소드 생성시 가져올 빈 데이터
  //   let emptyEpisodeInfo = emptyContent.data.contentInfo.chapterInfoList[0].episodeInfoList[0];
  // 편집시 가져올데이터
  const editingEpisodeInfo = useSelector((state: RootState) => state.episode.currentEpisodeInfo);

  // 스텝
  const [maxStep, setMaxStep] = useState<number>(7);
  const [curStep, setCurStep] = useState<number>(0); // 0일때는 max 수치가 변동이 있을 수 있기때문에 step이 가려집니다.

  const [actionStepType, setActionType] = useState<TriggerActionType>(TriggerActionType.ChangeCharacter);
  const [triggerType, setTriggerType] = useState<TriggerTypeNames>(TriggerTypeNames.Intimacy);

  // 캐릭터 선택
  const [currentSelectedCharacter, setCurrentSelectedCharacter] = useState<CharacterInfo | undefined>();
  const [characters, setCharacters] = useState<CharacterInfo[] | undefined>();
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number | null>(null);
  const [category, setCategory] = useState<GalleryCategory>(GalleryCategory.Portrait);
  const [lastCategory, setLastCategory] = useState<GalleryCategory>(GalleryCategory.All);
  const [itemUrl, setItemUrl] = useState<GalleryImageInfo[] | null>(null);

  // 저장될 데이터
  const [curEpisodeCharacterImage, setCurEpisodeCharacterImage] = useState<string>('');

  //#endregion

  //#region  함수
  // 데이터 초기화
  const initData = () => {
    setCurStep(0);
    setActionType(TriggerActionType.ChangeCharacter);
    setCurrentSelectedCharacter(undefined);
    setSelectedCharacterId(null);
    setSelectedGalleryIndex(null);
    setCurEpisodeCharacterImage('');
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

    if (triggerInfo.triggerType == TriggerTypeNames.EpisodeStart && curStep == 0) {
      setCurStep(prev => Math.min(prev + 2, maxStep));
      handleConfirm();
      return;
    }
    setCurStep(prev => Math.min(prev + 1, maxStep));
    handleConfirm();
  }

  function checkCenterButtonStep() {
    return false;
  }
  function subStep() {
    if (triggerInfo.triggerType == TriggerTypeNames.EpisodeStart && curStep == 2) {
      setCurStep(prev => Math.max(prev - 2, 0));
      return;
    }
    setCurStep(prev => Math.max(prev - 1, 0));
  }

  //스탭에 따른 빠꾸 케이스
  function checkEssential() {
    if (curStep > 0) {
      switch (actionStepType) {
        case TriggerActionType.ChangeCharacter:
          break;
        case TriggerActionType.ChangePrompt:
          break;
        case TriggerActionType.EpisodeChange:
          break;
        case TriggerActionType.GetIntimacyPoint:
          break;
        case TriggerActionType.PlayMedia:
          break;
      }
    }
    return true;
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
  };

  const handleSetEpisodeNameComplete = (name: string) => {
    if (!checkEssential()) {
      alert('필수 선택 항목이 선택되지 않았습니다.');
      return;
    }

    handlerOnCompleteInit(name);
  };

  const handlerOnCompleteInit = (name: string) => {
    let episodeInfo: EpisodeInfo;

    onClose();
    initData();
  };

  const handlerOnClose = () => {
    onClose();
  };

  // 업로드 타입 선택
  const handleOnSelectCharacter = () => {
    setMaxStep(3);
    setActionType(TriggerActionType.ChangeCharacter);
    addStep();
  };

  const handleOnUploadImageClick = () => {
    if (curEpisodeCharacterImage !== '') {
      handleOnUploadImage();
    }
  };

  const handleOnUploadImage = () => {
    setMaxStep(2);
    setActionType(TriggerActionType.PlayMedia);
    addStep();
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

  const handleCategoryChange = (newCategory: GalleryCategory) => {
    if (newCategory !== category) {
      setCategory(newCategory);
    }
  };

  // 파일 업로드

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

  useEffect(() => {
    // 에피소드카드 이미지의 버튼으로 편집 들어왔을때 값 세팅
    if (isEditing) {
      setCurEpisodeCharacterImage(editingEpisodeInfo.characterInfo.mainImageUrl);
    }
  }, [isEditing]);

  // 캐릭터 선택
  useEffect(() => {
    if (actionStepType === TriggerActionType.ChangeCharacter && curStep === 1) {
      getCharacterList();
    }
  }, [curStep]);

  useEffect(() => {
    // 카테고리 전환 시 아이템과 인덱스를 갱신

    if (
      currentSelectedCharacter &&
      actionStepType === TriggerActionType.ChangeCharacter &&
      curStep === 2 &&
      category !== lastCategory
    ) {
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
          setItemUrl(galleryAllUrl);
      }
      setSelectedGalleryIndex(0);
      setLastCategory(category);
    }
  }, [category, currentSelectedCharacter, galleryAllUrl, curStep]);
  //#endregion

  //#region 렌더링을 위한 함수
  const [types, setTypes] = useState([
    {text: 'Check\nProgress Point', isActive: false},
    {text: 'Check\nKeyword', isActive: false},
    {text: 'Check\nChat Count', isActive: false},
    {text: 'Check\nIdle Time', isActive: false},
    {text: "Check\nCharacter's Emotion", isActive: false},
    {text: 'When\nEpisode starts at first', isActive: false},
  ]);

  //#region 렌더링을 위한 함수
  const [actions, setActions] = useState([
    {text: 'Change\nEpisode', isActive: false},
    {text: 'Change\nEpisode Guide', isActive: false},
    {text: 'Get\nProgress Point', isActive: false},
    {text: 'Change\nCharacter', isActive: false},
    {text: 'Show\nImage', isActive: false},
    {text: 'Play\nVideo', isActive: false},
    {text: 'Play\nAudio', isActive: false},
  ]);

  const [emotions, setEmotions] = useState([
    {text: 'Happy', isActive: false, src: EmotionHappy},
    {text: 'Angry', isActive: false, src: EmotionAngry},
    {text: 'Sad', isActive: false, src: EmotionSad},
    {text: 'Excited', isActive: false, src: EmotionExcited},
    {text: 'Scared', isActive: false, src: EmotionScared},
    {text: 'Bored', isActive: false, src: EmotionBored},
  ]);
  const setEmotionsActive = (index: number) => {
    // 상태를 업데이트하며 선택된 step만 활성화
    setEmotions(prevSteps =>
      prevSteps.map((step, i) => ({
        ...step,
        isActive: i === index, // 선택된 index만 활성화
      })),
    );
  };

  const setTypesActive = (index: number) => {
    // 상태를 업데이트하며 선택된 step만 활성화
    setTypes(prevSteps =>
      prevSteps.map((step, i) => ({
        ...step,
        isActive: i === index, // 선택된 index만 활성화
      })),
    );
  };

  const setActionsActive = (index: number) => {
    // 상태를 업데이트하며 선택된 step만 활성화
    setActions(prevSteps =>
      prevSteps.map((step, i) => ({
        ...step,
        isActive: i === index, // 선택된 index만 활성화
      })),
    );

    switch (index) {
      case TriggerActionType.EpisodeChange:
        setMaxStep(3);
        break;
      case TriggerActionType.ChangePrompt:
        setMaxStep(3);
        break;
      case TriggerActionType.GetIntimacyPoint:
        setMaxStep(3);
        break;
      case TriggerActionType.ChangeCharacter:
        setMaxStep(4);
        break;
      case 4:
      case 5:
      case 6:
        setMaxStep(3);
    }
  };

  const getActionsActive = () => {
    // isActive가 true인 action의 index를 반환
    return actions.findIndex(action => action.isActive);
  };

  const [textValue, setPromptValue] = useState<string>('');
  const maxPromptLength: number = 10;
  const handleCharacterDescPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxPromptLength) {
      setPromptValue(e.target.value);
    }
  };

  // 동적으로 MaxTextInput props 설정
  const getInputType = (): inputType => {
    switch (triggerInfo.triggerType) {
      case TriggerTypeNames.Intimacy:
        return inputType.OnlyNumMax100; // 100까지만 입력 가능
      case TriggerTypeNames.ChatCount:
        return inputType.OnlyNum; // 숫자만 입력 가능
      case TriggerTypeNames.TimeMinute:
        return inputType.OnlyNum; // 숫자만 입력 가능
      case TriggerTypeNames.Keyword:
        return inputType.None; // 제한 없음
      default:
        return inputType.None; // 제한 없음
    }
  };

  const handlePromptChange = (s: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (triggerInfo.triggerType === TriggerTypeNames.ChatCount) {
      setTriggerInfo(prevTriggerInfo => ({
        ...prevTriggerInfo,
        triggerValueChatCount: s.target.value ? Number(s.target.value) : 0,
      }));
    } else if (triggerInfo.triggerType === TriggerTypeNames.Intimacy) {
      setTriggerInfo(prevTriggerInfo => ({
        ...prevTriggerInfo,
        triggerValueIntimacy: s.target.value ? Number(s.target.value) : 0,
      }));
    } else if (triggerInfo.triggerType === TriggerTypeNames.TimeMinute) {
      setTriggerInfo(prevTriggerInfo => ({
        ...prevTriggerInfo,
        triggerValueIntimacy: s.target.value ? Number(s.target.value) : 0,
      }));
    } else if (triggerInfo.triggerType === TriggerTypeNames.Keyword) {
      setTriggerInfo(prevTriggerInfo => ({
        ...prevTriggerInfo,
        triggerValueKeyword: s.target.value,
      }));
    }
  };

  const getTriggerValue = (): string => {
    if (triggerInfo.triggerType === TriggerTypeNames.ChatCount) {
      return triggerInfo.triggerValueChatCount.toString();
    } else if (triggerInfo.triggerType === TriggerTypeNames.Intimacy) {
      return triggerInfo.triggerValueIntimacy.toString();
    } else if (triggerInfo.triggerType === TriggerTypeNames.TimeMinute) {
      return triggerInfo.triggerValueTimeMinute.toString();
    } else if (triggerInfo.triggerType === TriggerTypeNames.Keyword) {
      return triggerInfo.triggerValueKeyword;
    }
    return ''; // 기본 반환 값
  };
  React.useEffect(() => {
    console.log('Updated triggerType:', triggerInfo.triggerType);
  }, [triggerInfo.triggerType]);

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div style={{backgroundColor: 'white', width: '100%', height: '100%', overflowY: 'hidden'}}>
            <div className={styles.step_grid}>
              {types.map((stepData, index) => (
                <div
                  key={index}
                  className={`${styles.step_button} ${stepData.isActive ? styles.active : ''}`} // active 클래스가 CSS 모듈 내에서 정의된 경우
                  style={{whiteSpace: 'pre-wrap'}} // 줄바꿈 처리
                  onClick={() => {
                    setTriggerInfo(prevTriggerInfo => ({
                      ...prevTriggerInfo,
                      triggerType: index,
                    }));
                    setTypesActive(index);
                  }}
                >
                  {stepData.text}
                </div>
              ))}
            </div>
          </div>
        );
      case 1:
        if (triggerInfo.triggerType == TriggerTypeNames.EmotionStatus) {
          return (
            <div style={{backgroundColor: 'white', width: '100%', height: '100%', overflowY: 'hidden'}}>
              <div className={styles.step_grid}>
                {emotions.map((stepData, index) => (
                  <div
                    key={index}
                    className={`${styles.step_button} ${stepData.isActive ? styles.active : ''}`} // active 클래스가 CSS 모듈 내에서 정의된 경우
                    style={{whiteSpace: 'pre-wrap'}} // 줄바꿈 처리
                    onClick={() => {
                      setTriggerInfo(prevTriggerInfo => ({
                        ...prevTriggerInfo,
                        emotionState: index,
                      }));
                      setEmotionsActive(index);
                    }}
                  >
                    <img src={stepData.src.src}></img> {stepData.text}
                  </div>
                ))}
              </div>
            </div>
          );
        } else {
          return (
            <div
              style={{
                backgroundColor: 'white',
                width: '100%',
                height: '100%',
                overflowY: 'hidden',
                justifyItems: 'center',
              }}
            >
              <MaxTextInput
                handlePromptChange={handlePromptChange}
                maxPromptLength={maxPromptLength}
                promptValue={getTriggerValue()}
                type={getInputType()}
                allowSpecialCharacters={false}
              />
            </div>
          );
        }
      case 2:
        return (
          <div style={{backgroundColor: 'white', width: '100%', height: '100%', overflowY: 'hidden'}}>
            <div className={styles.step_grid}>
              {actions.map((stepData, index) => (
                <div
                  key={index}
                  className={`${styles.step_button} ${stepData.isActive ? styles.active : ''}`} // active 클래스가 CSS 모듈 내에서 정의된 경우
                  style={{whiteSpace: 'pre-wrap'}} // 줄바꿈 처리
                  onClick={() => {
                    if (index >= TriggerActionType.PlayMedia) {
                      setTriggerInfo(prevTriggerInfo => ({
                        ...prevTriggerInfo,
                        triggerActionType: TriggerActionType.PlayMedia,
                      }));
                    } else {
                      setTriggerInfo(prevTriggerInfo => ({
                        ...prevTriggerInfo,
                        triggerActionType: index,
                      }));
                    }
                    setActionsActive(index);
                  }}
                >
                  {stepData.text}
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div
            style={{
              backgroundColor: 'white',
              width: '100%',
              height: '100%',
              overflowY: 'hidden',
              justifyItems: 'center',
            }}
          >
            {getActionContent(getActionsActive())}
          </div>
        );
      case 4:
        return (
          <>
            {actionStepType === TriggerActionType.ChangeCharacter && (
              <>
                <CharacterGalleryToggle category={category} onCategoryChange={handleCategoryChange} />

                <CharacterGalleryGrid
                  itemUrl={itemUrl}
                  selectedItemIndex={selectedGalleryIndex}
                  onSelectItem={i => setSelectedGalleryIndex(i)}
                  category={category}
                  isTrigger={true}
                />
              </>
            )}
          </>
        );
      default:
        return <div>Unknown step</div>;
    }
  };
  const getActionContent = (actionType: number) => {
    switch (actionType) {
      case 0:
        return <></>;
      case 1: {
        return (
          <MaxTextInput
            handlePromptChange={handlePromptChange}
            maxPromptLength={maxPromptLength}
            promptValue={getTriggerValue()}
            type={getInputType()}
            allowSpecialCharacters={false}
          />
        );
      }
      case 2:
        return <></>;
      case 3:
        return <></>;
      case 4:
        return <></>;
      default:
        return <div>Unknown step</div>;
    }
  };
  //#endregion
  const getStepTitleText = (step: number): string => {
    switch (step) {
      case 0:
        return 'Select a criteria type';
      case 1:
        if (triggerInfo.triggerType === TriggerTypeNames.EmotionStatus) {
          return "Check Character's Emotion";
        } else return 'Title';
      case 2:
        return 'Select an action type';
      case 3:
        switch (getActionsActive()) {
          case TriggerActionType.EpisodeChange:
            return 'Change Episode';
          case TriggerActionType.ChangePrompt:
            return 'Change Episode Guide';

          case TriggerActionType.GetIntimacyPoint:
            return 'Get Progress Point';

          case TriggerActionType.ChangeCharacter:
            return 'Select a character';

          case 4:
            return 'Show Image';

          case 5:
            return 'Play Video';
          case 6:
            return 'Play Audio';
          default:
            return 'None';
        }
      default:
        return '';
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{width: '100vw', height: '100vh', maxWidth: '402px', margin: '0 auto', overflow: 'hidden'}}
    >
      <>
        <CreateDrawerHeader title={getStepTitleText(curStep)} onClose={handlerOnClose} />
        {curStep >= 3 && getActionsActive() == TriggerActionType.ChangeCharacter && (
          <>
            <EpisodeInitializeStep maxStep={maxStep} curStep={curStep} />
          </>
        )}
        {getStepContent(curStep)}
        {/* Float Button */}
        <div className={styles.floatButtonArea}>
          <button
            className={`${styles.floatButton} ${styles.prevButton} ${
              checkCenterButtonStep() && styles.centerSideButton
            }`}
            onClick={() => {
              subStep();
            }}
          >
            <img src={LineArrowLeft.src} className={`${styles.buttonIcon} ${styles.blackIcon} `} />
            <div>Previous</div>
          </button>
          {checkCenterButtonStep() && (
            <button className={`${styles.floatButton} ${styles.centerButton}`}>
              <div>Generate</div>
              <img src={BoldRuby.src} className={`${styles.buttonIcon} ${styles.blackIcon}`} />
            </button>
          )}
          <button
            className={`${styles.floatButton} ${styles.nextButton} ${
              checkCenterButtonStep() && styles.centerSideButton
            }`}
            onClick={() => {
              {
                checkFinalStep() === true ? handleOnSetEpisodeName() : addStep();
              }
            }}
          >
            <div>{checkFinalStep() === true ? 'Complete' : checkCenterButtonStep() ? 'Confirm' : 'Next'}</div>
            <img
              src={checkCenterButtonStep() ? LineCheck.src : LineArrowRight.src}
              className={checkCenterButtonStep() ? styles.buttonCheckIcon : styles.buttonIcon}
            />
          </button>
        </div>
      </>
    </Modal>
  );
};

export default TriggerCreate;
