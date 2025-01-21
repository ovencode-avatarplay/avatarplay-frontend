'use client';

import React, {useState, useEffect, useRef} from 'react';
import {Modal} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';

import styles from './EpisodeDescription.module.css'; // CSS 모듈 import

import getLocalizedText from '@/utils/getLocalizedText';

import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import MaxTextInput, {displayType} from '@/components/create/MaxTextInput';
import {BoldAI, BoldCharacter, BoldChatRoundDots} from '@ui/Icons';
import CustomPopup from '@/components/layout/shared/CustomPopup';
import {EpisodeInfo, updateEpisodeDescription} from '@/redux-store/slices/ContentInfo';

interface CharacterDataType {
  userId: number;
  characterName: string;
  characterDescription: string;
  worldScenario: string;
  introduction: string;
  secret: string;
}

interface CharacterPopupProps {
  dataDefault?: CharacterDataType;
  isModify: boolean;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CharacterDataType) => void;
  episodeInfo: EpisodeInfo;
}

export const EpisodeDescription: React.FC<CharacterPopupProps> = ({
  dataDefault,
  isModify = false,
  open,
  onClose,
  onSubmit,
  episodeInfo,
}) => {
  const selectedChapterIdx = useSelector((state: RootState) => state.content.selectedChapterIdx);
  const selectedEpisodeIdx = useSelector((state: RootState) => state.content.selectedEpisodeIdx);
  const currentEpisodeInfo = useSelector(
    (state: RootState) =>
      state.content.curEditingContentInfo.chapterInfoList[selectedChapterIdx].episodeInfoList[selectedEpisodeIdx],
  );

  const dispatch = useDispatch();
  useEffect(() => {
    if (open) {
      // TODO : CurEpisode
      // dispatch(setCurrentEpisodeInfo(episodeInfo));
    }
  }, [episodeInfo]);

  // 상태 초기화
  const [worldScenario, setWorldScenario] = useState<string>(
    currentEpisodeInfo.episodeDescription.scenarioDescription || '',
  );
  const [introduction, setIntroduction] = useState<string>(
    currentEpisodeInfo.episodeDescription.introDescription || '',
  );
  const [secret, setSecret] = useState<string>(currentEpisodeInfo.episodeDescription.secret || '');

  const [error, setError] = useState<string | null>(null);
  const [isConversationModalOpen, setConversationModalOpen] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null); // 포커스된 필드 상태
  const [isKeyboardOpen, setKeyboardOpen] = useState(false);

  const [autoWriteWorldScenario, setAutoWriteWorldScenario] = useState<string[]>(['', '', '', '']);
  const [autoWriteIntroduction, setAutoWriteIntroduction] = useState<string[]>(['', '', '', '']);
  const [autoWriteSecret, setAutoWriteSecret] = useState<string[]>(['', '', '', '']);

  const [worldScenarioIndex, setWorldScenarioIndex] = useState<number>(0);
  const [introductionIndex, setIntroductionIndex] = useState<number>(0);
  const [secretIndex, setSecretIndex] = useState<number>(0);

  const [isFirstClickWorldScenario, setIsFirstClickWorldScenario] = useState<boolean>(true);
  const [isFirstClickIntroduction, setIsFirstClickIntroduction] = useState<boolean>(true);
  const [isFirstClickSecret, setIsFirstClickSecret] = useState<boolean>(true);

  // messageBox 사용
  const [isMessageBoxOpen, setMessageBoxOpen] = useState(false);
  const handleOpenMessageBox = () => setMessageBoxOpen(true);
  const handleCloseMessageBox = () => setMessageBoxOpen(false);

  const worldScenarioRef = useRef<HTMLTextAreaElement | null>(null);
  const introductionRef = useRef<HTMLTextAreaElement | null>(null);
  const secretRef = useRef<HTMLTextAreaElement | null>(null);

  const LIMIT_WORLD_SCENARIO = 1000; // 월드 시나리오 필드 입력가능 최대값
  const LIMIT_INTRODUCTION = 1000; // 인트로 필드 입력가능 최대값
  const LIMIT_SECRET = 500; // 비밀 필드 입력가능 최대값

  // 정보 제출 처리
  const handleSubmit = () => {
    const updatedEpisodeDescription = {
      scenarioDescription: worldScenario,
      introDescription: introduction,
      secret: '',
      greeting: '',
      worldScenario: '',
    };

    const submitData: CharacterDataType = {
      userId: 0,
      characterName: '',
      characterDescription: worldScenario,
      worldScenario: '',
      introduction: introduction,
      secret: secret,
    };

    dispatch(updateEpisodeDescription(updatedEpisodeDescription)); // Redux에 정보 업데이트
    onSubmit(submitData);
  };

  const onChangesetWorldScenario = (newText: string) => {
    if (isInputLimit(newText, LIMIT_WORLD_SCENARIO) === false || newText.length < worldScenario.length) {
      setWorldScenario(newText);
    }
  };

  const onChangesetIntroduction = (newText: string) => {
    if (isInputLimit(newText, LIMIT_INTRODUCTION) === false || newText.length < introduction.length) {
      setIntroduction(newText);
    }
  };

  const onChangesetSecret = (newText: string) => {
    if (isInputLimit(newText, LIMIT_SECRET) === false || newText.length < secret.length) {
      setSecret(newText);
    }
  };

  // Auto Write 문자열을 Json Table에서 한번만 읽어옴
  useEffect(() => {
    const data1: string[] = [
      getLocalizedText('EpisodeDescription', 'episodeDescription_label_001'),
      getLocalizedText('EpisodeDescription', 'episodeDescription_label_002'),
      getLocalizedText('EpisodeDescription', 'episodeDescription_label_003'),
      getLocalizedText('EpisodeDescription', 'episodeDescription_label_004'),
    ];
    const data2: string[] = [
      getLocalizedText('EpisodeDescription', 'scenarioIntroduction_desc_001'),
      getLocalizedText('EpisodeDescription', 'scenarioIntroduction_desc_002'),
      getLocalizedText('EpisodeDescription', 'scenarioIntroduction_desc_003'),
      getLocalizedText('EpisodeDescription', 'scenarioIntroduction_desc_004'),
    ];
    const data3: string[] = [
      getLocalizedText('EpisodeDescription', 'scenarioGuide_desc_001'),
      getLocalizedText('EpisodeDescription', 'scenarioGuide_desc_002'),
      getLocalizedText('EpisodeDescription', 'scenarioGuide_desc_003'),
      getLocalizedText('EpisodeDescription', 'scenarioGuide_desc_004'),
    ];

    setAutoWriteWorldScenario(data1);
    setAutoWriteIntroduction(data2);
    setAutoWriteSecret(data3);
  }, []);

  const handleFocus = (field: string) => {
    setFocusedField(field); // 포커스가 맞춰진 필드명을 설정
  };

  const handleBlur = (event: React.FocusEvent) => {
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (relatedTarget && relatedTarget.dataset && relatedTarget.dataset.virtualButton) {
      return; // 가상 버튼으로 포커스 이동 시, 상태 변경 방지
    }
    setFocusedField(null); // 포커스가 다른 곳으로 이동하면 null로 설정하여 버튼 숨김
  };

  const handleVirtualButtonClick = (buttonText: string) => {
    const updateField = (
      currentValue: string,
      ref: React.RefObject<HTMLTextAreaElement | null>,
      setValue: React.Dispatch<React.SetStateAction<string>>,
    ) => {
      if (ref.current) {
        const textarea = ref.current;
        const start = textarea.selectionStart || 0;
        const end = textarea.selectionEnd || 0;
        const newValue = currentValue.slice(0, start) + buttonText + currentValue.slice(end);
        setValue(newValue);

        textarea.focus();
        textarea.setSelectionRange(start + buttonText.length, start + buttonText.length);

        // setTimeout(() => {
        //   textarea.focus();
        //   textarea.setSelectionRange(start + buttonText.length, start + buttonText.length);
        // });
      }
    };

    if (focusedField === 'worldScenario') {
      if (isInputLimit(worldScenario + buttonText, LIMIT_WORLD_SCENARIO) === false)
        updateField(worldScenario, worldScenarioRef, setWorldScenario);
    } else if (focusedField === 'introduction') {
      if (isInputLimit(introduction + buttonText, LIMIT_INTRODUCTION) === false)
        updateField(introduction, introductionRef, setIntroduction);
    } else if (focusedField === 'secret') {
      if (isInputLimit(secret + buttonText, LIMIT_SECRET) === false) updateField(secret, secretRef, setSecret);
    }
  };

  const handleClickAutoWrite = () => {
    if (focusedField === 'worldScenario') {
      if (worldScenario.length > 0) {
        setMessageBoxOpen(true);
      } else handleAutoWriteClick();
    } else if (focusedField === 'introduction') {
      if (introduction.length > 0) {
        setMessageBoxOpen(true);
      } else handleAutoWriteClick();
    } else if (focusedField === 'secret') {
      if (secret.length > 0) {
        setMessageBoxOpen(true);
      } else handleAutoWriteClick();
    } // 입력창이 비어있다면 그냥 자동 텍스트를 출력해준다.
  };

  // 랜덤 텍스트 입력 함수 (첫 클릭 시 랜덤, 이후 순차적)
  const handleAutoWriteClick = () => {
    const showMessageBoxIfNotEmpty = (value: string) => {
      if (value.length > 0) {
        return true; // 실행 중단 신호
      }
      return false; // 실행 계속 신호
    };

    if (focusedField === 'worldScenario') {
      //if (showMessageBoxIfNotEmpty(worldScenario)) return; // 값이 존재하면 실행 중단

      if (isFirstClickWorldScenario) {
        const randomIndex = Math.floor(Math.random() * autoWriteWorldScenario.length);
        setWorldScenario(autoWriteWorldScenario[randomIndex]);
        setIsFirstClickWorldScenario(false);
      } else {
        const nextIndex = (worldScenarioIndex + 1) % autoWriteWorldScenario.length;
        setWorldScenarioIndex(nextIndex);
        setWorldScenario(autoWriteWorldScenario[nextIndex]);
      }
    } else if (focusedField === 'introduction') {
      if (isFirstClickIntroduction) {
        const randomIndex = Math.floor(Math.random() * autoWriteIntroduction.length);
        setIntroduction(autoWriteIntroduction[randomIndex]);
        setIsFirstClickIntroduction(false);
      } else {
        const nextIndex = (introductionIndex + 1) % autoWriteIntroduction.length;
        setIntroductionIndex(nextIndex);
        setIntroduction(autoWriteIntroduction[nextIndex]);
      }
    } else if (focusedField === 'secret') {
      //if (showMessageBoxIfNotEmpty(secret)) return;

      if (isFirstClickSecret) {
        const randomIndex = Math.floor(Math.random() * autoWriteSecret.length);
        setSecret(autoWriteSecret[randomIndex]);
        setIsFirstClickSecret(false);
      } else {
        const nextIndex = (secretIndex + 1) % autoWriteSecret.length;
        setSecretIndex(nextIndex);
        setSecret(autoWriteSecret[nextIndex]);
      }
    }
  };

  // 입력제한 길이를 넘겼는지 리턴
  const isInputLimit = (text: string, countMax: number): boolean => {
    if (text.length <= countMax) {
      return false;
    }
    return true;
  };

  const handleOnClose = () => {
    handleSubmit();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleOnClose}
      BackdropProps={{
        sx: {background: 'rgba(0, 0, 0, 0.7)'},
      }}
    >
      <div className={styles.modalContainer}>
        <CreateDrawerHeader title="Episode Scenario" onClose={handleOnClose} />
        <div className={styles.descContainer}>
          <div className={styles.descItem}>
            <MaxTextInput
              promptValue={worldScenario}
              handlePromptChange={e => onChangesetWorldScenario(e.target.value)}
              maxPromptLength={LIMIT_WORLD_SCENARIO}
              onFocus={() => handleFocus('worldScenario')}
              onBlur={handleBlur}
              inputRef={worldScenarioRef}
              displayDataType={displayType.Label}
              labelText="Description"
            />
          </div>

          <div className={styles.descItem}>
            <MaxTextInput
              promptValue={introduction}
              handlePromptChange={e => onChangesetIntroduction(e.target.value)}
              maxPromptLength={LIMIT_INTRODUCTION}
              onFocus={() => handleFocus('introduction')}
              onBlur={handleBlur}
              inputRef={introductionRef}
              displayDataType={displayType.Label}
              labelText="Scenario Introduction"
            />
          </div>
        </div>
        {!focusedField && (
          <div className={styles.supportButtonArea}>
            <button className={styles.supportButton} data-virtual-button onClick={handleClickAutoWrite}>
              <img className={styles.buttonIcon} src={BoldAI.src} />
              <div className={styles.buttonText}>AI</div>
            </button>
            <button
              className={styles.supportButton}
              data-virtual-button
              onClick={() => handleVirtualButtonClick('{{char}}')}
            >
              <img className={styles.buttonIcon} src={BoldCharacter.src} />
              <div className={styles.buttonText}>Character</div>
            </button>
            <button
              className={styles.supportButton}
              data-virtual-button
              onClick={() => handleVirtualButtonClick('{{user}}')}
            >
              <img className={styles.buttonIcon} src={BoldChatRoundDots.src} />
              <div className={styles.buttonText}>User</div>
            </button>
          </div>
        )}

        {isMessageBoxOpen && (
          <CustomPopup
            type="alert"
            title="Alert"
            description="override value?"
            buttons={[
              {
                label: 'Confirm',
                onClick: () => {
                  setMessageBoxOpen(false);
                  handleAutoWriteClick();
                },
                isPrimary: false,
              },
              {label: 'Cancel', onClick: handleCloseMessageBox, isPrimary: true},
            ]}
          />
        )}
      </div>
    </Modal>
  );
};

export default EpisodeDescription;
