import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';

import styles from './TriggerCreate.module.css';

import {
  GalleryImageInfo,
  GetCharacterInfoReq,
  sendGetCharacterProfileInfo,
  sendGetCharacterList,
} from '@/app/NetWork/CharacterNetwork';
import {
  addTriggerInfo,
  CharacterInfo,
  duplicateTriggerInfo,
  EpisodeInfo,
  TriggerActionType,
  TriggerInfo,
  TriggerMediaState,
  TriggerTypeNames,
  updateTriggerInfo,
} from '@/redux-store/slices/StoryInfo';

import emptyStory from '@/data/create/empty-story-info-data.json';

import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import CharacterGrid from '@/app/view/studio/characterDashboard/CharacterGrid';
import CharacterGalleryGrid from '@/app/view/studio/characterDashboard/CharacterGalleryGrid';
import {RootState} from '@/redux-store/ReduxStore';
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
import CustomStepper from '@/components/layout/shared/CustomStepper';
import Modal from '@mui/material/Modal/Modal';
import MaxTextInput, {inputType as inputType} from '@/components/create/MaxTextInput';
import TriggerCreateMedia from './TriggerCreateMedia';
import CustomPopup from '@/components/layout/shared/CustomPopup';
import {useDispatch} from 'react-redux';
import ChapterItemList from '../../chapter/ChapterItemList';
import CustomButton from '@/components/layout/shared/CustomButton';
import {getCurrentLanguage} from '@/utils/UrlMove';
interface Props {
  open: boolean;
  onClose: () => void;
  isEditing: boolean;
  updateInfo?: TriggerInfo;
}

const TriggerCreate: React.FC<Props> = ({open, isEditing, onClose, updateInfo}) => {
  //#region 선언
  // 공통
  const dispatch = useDispatch();
  const tempTriggerInfo: TriggerInfo = {
    episodeId: 0, // 기본 에피소드 ID
    id: -1, // 임시 값, addTriggerInfo에서 자동 생성됨
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

    actionCharacterInfo: emptyStory.data.storyInfo.chapterInfoList[0].episodeInfoList[0].characterInfo,
    actionMediaState: 0, // 기본 미디어 상태
    actionMediaUrlList: [], // 기본 미디어 URL 리스트
    actionConversationList: [], // 기본 대화 리스트
  };

  const [triggerInfo, setTriggerInfo] = useState<TriggerInfo>(() => {
    return updateInfo && isEditing == true ? updateInfo : tempTriggerInfo;
  });

  // open 상태가 변경될 때마다 triggerInfo를 업데이트
  useEffect(() => {
    if (open) {
      console.log('updateInfo:', updateInfo);
      console.log('isEditing:', isEditing);
      console.log('Condition result:', updateInfo && isEditing === true ? 'updateInfo' : 'tempTriggerInfo');

      setTriggerInfo(updateInfo && isEditing ? updateInfo : tempTriggerInfo);
    }
  }, [open, updateInfo, isEditing]); // 의존성 배열에 open, updateInfo, isEditing 추가

  const [loading, setLoading] = useState<boolean>(true);
  const [isCompletePopupOpen, setIsCompletePopupOpen] = useState<boolean>(false);
  const [onBackButton, setOnBackButton] = useState<boolean>(false);
  //   // 에피소드 생성시 가져올 빈 데이터
  //   let emptyEpisodeInfo = emptyStory.data.storyInfo.chapterInfoList[0].episodeInfoList[0];
  // 편집시 가져올데이터
  const selectedChapterIdx = useSelector((state: RootState) => state.story.selectedChapterIdx);
  const selectedEpisodeIdx = useSelector((state: RootState) => state.story.selectedEpisodeIdx);
  const editingEpisodeInfo = useSelector(
    (state: RootState) =>
      state.story.curEditingStoryInfo.chapterInfoList[selectedChapterIdx].episodeInfoList[selectedEpisodeIdx],
  );

  // 스텝
  const [maxStep, setMaxStep] = useState<number>(7);
  const [curStep, setCurStep] = useState<number>(0); // 0일때는 max 수치가 변동이 있을 수 있기때문에 step이 가려집니다.

  const [actionStepType, setActionType] = useState<TriggerActionType>(0);
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

  // 에피소드 선택
  const editingStoryInfo = useSelector((state: RootState) => state.story.curEditingStoryInfo); // 현재 수정중인 컨텐츠 정보
  const [targetChapterIdx, setTargetChapterIdx] = useState(0);
  const [targetEpisodeIdx, setTargetEpisodeIdx] = useState(0);

  useEffect(() => {
    if (selectedCharacterId !== null && selectedGalleryIndex !== null && characters) {
      // characters 배열에서 id가 selectedCharacterId와 같은 CharacterInfo를 찾음
      const character = characters.find(char => char.id === selectedCharacterId);

      if (character) {
        if (itemUrl && itemUrl[selectedGalleryIndex] && itemUrl[selectedGalleryIndex].imageUrl != null) {
          const updatedCharacter = {
            ...character,
            mainImageUrl: itemUrl[selectedGalleryIndex].imageUrl,
          };

          // actionCharacterInfo 값 설정
          setTriggerInfo(prevTriggerInfo => ({
            ...prevTriggerInfo,
            actionCharacterInfo: updatedCharacter, // 새로운 객체를 설정
          }));
        }
      } else {
        console.warn('Character not found for the given selectedCharacterId');
      }
    }
  }, [selectedCharacterId, selectedGalleryIndex, characters, itemUrl]);

  //#endregion

  //#region  함수
  // 데이터 초기화
  const initData = () => {
    setCurStep(0);
    setTriggerInfo(tempTriggerInfo);
    setActionType(0);
    resetAllStates();
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
    if (curStep == 0) {
      if (triggerInfo.triggerType == -1) return false;

      if (!types.some(item => item.isActive)) return false;
    }
    if (curStep == 1 && triggerInfo.triggerType == TriggerTypeNames.Intimacy) {
      if (triggerInfo.triggerValueIntimacy == 0) return false;
    }
    if (curStep == 1 && triggerInfo.triggerType == TriggerTypeNames.Keyword) {
      if (triggerInfo.triggerValueKeyword == '') return false;
    }
    if (curStep == 1 && triggerInfo.triggerType == TriggerTypeNames.ChatCount) {
      if (triggerInfo.triggerValueChatCount == 0) return false;
    }
    if (curStep == 1 && triggerInfo.triggerType == TriggerTypeNames.TimeMinute) {
      if (triggerInfo.triggerValueTimeMinute == 0) return false;
    }
    // if (curStep == 1 && triggerInfo.triggerType == TriggerTypeNames.EmotionStatus) {
    //   if (triggerInfo.emotionState == EmotionState.) return false;
    // }

    if (curStep == 2) {
      if (triggerInfo.triggerActionType == -1) return false;
      if (!actions.some(item => item.isActive)) return false;
    }
    if (curStep == 3 && triggerInfo.triggerActionType == TriggerActionType.PlayMedia) {
      if (triggerInfo.actionMediaUrlList.length == 0) return false;
    }
    if (curStep == 3 && triggerInfo.triggerActionType == TriggerActionType.ChangeCharacter) {
      if (selectedCharacterId == null) return false;
    }
    if (curStep == 3 && triggerInfo.triggerActionType == TriggerActionType.EpisodeChange) {
      // if (targetEpisodeIdx == null || targetEpisodeIdx == 0) return false;
    }
    if (curStep == 3 && triggerInfo.triggerActionType == TriggerActionType.ChangePrompt) {
      if (triggerInfo.actionPromptScenarioDescription == '') return false;
    }
    if (curStep == 3 && triggerInfo.triggerActionType == TriggerActionType.GetIntimacyPoint) {
      if (triggerInfo.actionIntimacyPoint == 0) return false;
    }
    if (curStep == 4 && triggerInfo.triggerActionType == TriggerActionType.ChangeCharacter) {
      if (selectedGalleryIndex == null) return false;
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
      const response = await sendGetCharacterList({languageType: getCurrentLanguage()});
      if (response.data) {
        const characterInfoList: CharacterInfo[] = response.data?.characterInfoList;
        setCharacters(characterInfoList);
      } else {
        throw new Error(`No StoryInfo in response`);
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
      const req: GetCharacterInfoReq = {languageType: getCurrentLanguage(), profileId: id};
      const response = await sendGetCharacterProfileInfo(req);

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

  //#endregion

  //#region handler
  // 공통

  const handleOnComplete = () => {
    if (!checkEssential()) {
      alert('필수 선택 항목이 선택되지 않았습니다.');
      return;
    }
    if (isEditing == true) {
      dispatch(updateTriggerInfo({id: triggerInfo.id, info: triggerInfo}));
      setIsCompletePopupOpen(true);
      return;
    }
    dispatch(addTriggerInfo(triggerInfo));
    setIsCompletePopupOpen(true);
  };

  const handlerOnCompleteInit = () => {
    setIsCompletePopupOpen(false);
    onClose();
    initData();
  };

  const handlerOnClose = () => {
    setIsCompletePopupOpen(false);
    onClose();
    initData();
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
    console.log(getActionsActive());
    if (curStep === 3 && selectedCharacterId) {
      await getCharacterInfo(selectedCharacterId);
    }
  };

  const handleCategoryChange = (newCategory: GalleryCategory) => {
    if (newCategory !== category) {
      setCategory(newCategory);
    }
  };

  // 에피소드 선택
  const handleChapterSelect = (chapterIdx: number) => {
    setTargetChapterIdx(chapterIdx);
  };

  const handleEpisodeSelect = (chapterIdx: number, episodeIdx: number) => {
    setTargetChapterIdx(chapterIdx);
    setTargetEpisodeIdx(episodeIdx);
    console.log('episodeIdx', episodeIdx);
    setTriggerInfo(prevTriggerInfo => ({
      ...prevTriggerInfo,
      actionChangeEpisodeId: episodeIdx,
    }));
  };

  useEffect(() => {
    // 에피소드카드 이미지의 버튼으로 편집 들어왔을때 값 세팅
    if (isEditing) {
      setCurEpisodeCharacterImage(editingEpisodeInfo.characterInfo.mainImageUrl);
    }
  }, [isEditing]);

  // 캐릭터 선택
  useEffect(() => {
    console.log(getActionsActive());
    if (getActionsActive() === TriggerActionType.ChangeCharacter && curStep === 3) {
      getCharacterList();
    }
  }, [curStep]);

  useEffect(() => {
    // 카테고리 전환 시 아이템과 인덱스를 갱신

    if (currentSelectedCharacter && getActionsActive() === TriggerActionType.ChangeCharacter && curStep === 4) {
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

  const resetAllStates = () => {
    setTypes(prevTypes => prevTypes.map(type => ({...type, isActive: false})));
    setActions(prevActions => prevActions.map(action => ({...action, isActive: false})));
    setEmotions(prevEmotions => prevEmotions.map(emotion => ({...emotion, isActive: false})));
  };
  interface OptionType {
    text: string;
    isActive: boolean;
  }

  const [types, setTypes] = useState<OptionType[]>([]);
  const [actions, setActions] = useState<OptionType[]>([]);

  // triggerInfo 변경 시 types, actions 업데이트
  useEffect(() => {
    if (!triggerInfo) return;

    const triggerTypeIndex = triggerInfo.triggerType;
    const triggerActionTypeIndex = triggerInfo.triggerActionType;

    // types 업데이트
    setTypes([
      {text: 'Check\nProgress Point', isActive: triggerTypeIndex === 0},
      {text: 'Check\nKeyword', isActive: triggerTypeIndex === 1},
      {text: 'Check\nChat Count', isActive: triggerTypeIndex === 2},
      {text: 'Check\nIdle Time', isActive: triggerTypeIndex === 3},
      {text: "Check\nCharacter's Emotion", isActive: triggerTypeIndex === 4},
      {text: 'When\nEpisode starts at first', isActive: triggerTypeIndex === 5},
    ]);

    // actions 업데이트
    setActions([
      {text: 'Change\nEpisode', isActive: triggerActionTypeIndex === 0},
      {text: 'Change\nEpisode Guide', isActive: triggerActionTypeIndex === 1},
      {text: 'Get\nProgress Point', isActive: triggerActionTypeIndex === 2},
      {text: 'Change\nCharacter', isActive: triggerActionTypeIndex === 3},
      {text: 'Show\nImage', isActive: triggerActionTypeIndex === 4},
      {text: 'Play\nVideo', isActive: triggerActionTypeIndex === 5},
      {text: 'Play\nAudio', isActive: triggerActionTypeIndex === 6},
    ]);
  }, [triggerInfo.triggerType, triggerInfo.triggerActionType]); // triggerInfo가 변경될 때 실행

  const [emotions, setEmotions] = useState([
    {text: 'Happy', isActive: true, src: EmotionHappy},
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
  const maxPromptLength: number = 500;
  const handleCharacterDescPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxPromptLength) {
      setPromptValue(e.target.value);
    }
  };

  // 동적으로 MaxTextInput props 설정
  const getTriggerValueInputType = (): inputType => {
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
  const getActionValueInputType = (): inputType => {
    switch (triggerInfo.triggerActionType) {
      case TriggerActionType.ChangePrompt:
        return inputType.None; // 100까지만 입력 가능
      case TriggerActionType.GetIntimacyPoint:
        return inputType.OnlyNumMax100; // 숫자만 입력 가능
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
        triggerValueTimeMinute: s.target.value ? Number(s.target.value) : 0,
      }));
    } else if (triggerInfo.triggerType === TriggerTypeNames.Keyword) {
      setTriggerInfo(prevTriggerInfo => ({
        ...prevTriggerInfo,
        triggerValueKeyword: s.target.value,
      }));
    }
  };

  const handleActionTextValueChange = (s: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (triggerInfo.triggerActionType === TriggerActionType.ChangePrompt) {
      setTriggerInfo(prevTriggerInfo => ({
        ...prevTriggerInfo,
        actionPromptScenarioDescription: s.target.value,
      }));
    } else if (triggerInfo.triggerActionType === TriggerActionType.GetIntimacyPoint) {
      setTriggerInfo(prevTriggerInfo => ({
        ...prevTriggerInfo,
        actionIntimacyPoint: s.target.value ? Number(s.target.value) : 0,
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

  const getActionValue = (): string => {
    if (triggerInfo.triggerActionType === TriggerActionType.ChangePrompt) {
      return triggerInfo.actionPromptScenarioDescription.toString();
    } else if (triggerInfo.triggerActionType === TriggerActionType.GetIntimacyPoint) {
      return triggerInfo.actionIntimacyPoint.toString();
    }
    return ''; // 기본 반환 값
  };

  React.useEffect(() => {
    console.log('Updated triggerType:', triggerInfo.triggerType);
  }, [triggerInfo.triggerType]);

  const getStepStory = (step: number) => {
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
                inputDataType={getTriggerValueInputType()}
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
            {getActionStory(getActionsActive())}
          </div>
        );
      case 4:
        return (
          <>
            {/* <CharacterGalleryToggle category={category} onCategoryChange={handleCategoryChange} /> */}
            <div className={styles.characterScrollArea}>
              <CharacterGalleryGrid
                itemUrl={itemUrl}
                selectedItemIndex={selectedGalleryIndex}
                onSelectItem={i => {
                  console.log(i);
                  setSelectedGalleryIndex(i);
                }}
                category={category}
                isTrigger={true}
                style={{paddingBottom: '60px'}}
              />
            </div>
          </>
        );
      default:
        return <div>Unknown step</div>;
    }
  };
  const getActionStory = (actionType: number) => {
    switch (actionType) {
      case 0:
        return (
          <>
            <ChapterItemList
              canEdit={false}
              chapters={editingStoryInfo.chapterInfoList}
              selectedChapterIdx={targetChapterIdx}
              selectedEpisodeIdx={targetEpisodeIdx}
              onClose={onClose}
              onSelect={handleChapterSelect}
              onSelectEpisode={handleEpisodeSelect}
              hideSelectedEpisode={false}
              onDelete={() => {}}
              onRename={() => {}}
            />
          </>
        );
      case 1: {
        return (
          <MaxTextInput
            handlePromptChange={handleActionTextValueChange}
            maxPromptLength={maxPromptLength}
            promptValue={getActionValue()}
            inputDataType={getActionValueInputType()}
            allowSpecialCharacters={false}
          />
        );
      }
      case 2:
        return (
          <MaxTextInput
            handlePromptChange={handleActionTextValueChange}
            maxPromptLength={maxPromptLength}
            promptValue={getActionValue()}
            inputDataType={getActionValueInputType()}
            allowSpecialCharacters={false}
          />
        );
      case 3:
        return (
          <>
            <div className={styles.characterScrollArea}>
              <CharacterGrid
                characters={characters || []}
                onCharacterSelect={handleCharacterSelect}
                style={{paddingBottom: '60px'}}
              />
            </div>
          </>
        );
      case 4:
        return (
          <TriggerCreateMedia
            onMediaUrlsChange={s => {
              setTriggerInfo(prevTriggerInfo => ({
                ...prevTriggerInfo,
                actionMediaState: TriggerMediaState.TriggerImage,
                actionMediaUrlList: s,
              }));
            }}
            mediaType="image"
          ></TriggerCreateMedia>
        );
      case 5:
        return (
          <TriggerCreateMedia
            onMediaUrlsChange={s => {
              setTriggerInfo(prevTriggerInfo => ({
                ...prevTriggerInfo,
                actionMediaState: TriggerMediaState.TriggerVideo,
                actionMediaUrlList: s,
              }));
            }}
            mediaType="video"
          ></TriggerCreateMedia>
        );
      case 6:
        return (
          <TriggerCreateMedia
            onMediaUrlsChange={s => {
              setTriggerInfo(prevTriggerInfo => ({
                ...prevTriggerInfo,
                actionMediaState: TriggerMediaState.TriggerAudio,
                actionMediaUrlList: s,
              }));
            }}
            mediaType="audio"
          ></TriggerCreateMedia>
        );
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
      sx={{width: 'var(--full-width)', height: '100vh', margin: '0 auto', overflow: 'hidden'}}
    >
      <div
        style={{
          backgroundColor: 'white',
          width: '100%',
          height: '100%',
          overflowY: 'hidden',
          justifyItems: 'center',
        }}
      >
        <CreateDrawerHeader
          title={getStepTitleText(curStep)}
          onClose={() => {
            setOnBackButton(true);
          }}
        />
        {curStep >= 3 && getActionsActive() == TriggerActionType.ChangeCharacter && (
          <>
            <CustomStepper maxStep={maxStep} curStep={curStep} />
          </>
        )}
        {getStepStory(curStep)}
        {/* Float Button */}
        <div className={styles.floatButtonArea}>
          <CustomButton
            size="Medium"
            type="Tertiary"
            state="IconLeft"
            icon={LineArrowLeft.src}
            iconClass={styles.blackIcon}
            onClick={() => {
              subStep();
            }}
          >
            Previous
          </CustomButton>
          {checkCenterButtonStep() && (
            <button className={`${styles.floatButton} ${styles.centerButton}`}>
              <div>Generate</div>
              <img src={BoldRuby.src} className={`${styles.buttonIcon} ${styles.blackIcon}`} />
            </button>
          )}
          <CustomButton
            size="Medium"
            type="Primary"
            state="IconRight"
            icon={LineArrowRight.src}
            iconClass={styles.whiteIcon}
            onClick={() => {
              checkFinalStep() === true ? handleOnComplete() : addStep();
            }}
            customClassName={[styles.nextButton]}
          >
            {checkFinalStep() === true ? 'Complete' : checkCenterButtonStep() ? 'Confirm' : 'Next'}
          </CustomButton>
        </div>
        {isCompletePopupOpen && (
          <CustomPopup
            type="alert"
            title="Completed"
            description="The trigger has been successfully created"
            buttons={[
              {
                label: 'Duplicate',
                onClick: () => {
                  dispatch(addTriggerInfo(triggerInfo));
                  handlerOnCompleteInit();
                },

                isPrimary: false,
              },
              {
                label: 'Add New',
                onClick: () => {
                  initData();
                  setIsCompletePopupOpen(false);
                },
                isPrimary: true,
              },
            ]}
            textButton={{
              label: 'Move to the list',
              onClick: handlerOnCompleteInit,
            }}
          />
        )}
        {onBackButton && (
          <CustomPopup
            type="alert"
            title="Alert"
            description="Are you sure you want to exit?\nYour Change will be lost"
            buttons={[
              {
                label: 'No',
                onClick: () => {
                  setOnBackButton(false);
                },

                isPrimary: false,
              },
              {
                label: 'Yes',
                onClick: () => {
                  handlerOnClose();
                  setOnBackButton(false);
                },
                isPrimary: true,
              },
            ]}
          />
        )}
      </div>
    </Modal>
  );
};

export default TriggerCreate;
