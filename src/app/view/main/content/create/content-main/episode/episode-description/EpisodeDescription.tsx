'use client';

import React, {useState, useEffect, useRef, useMemo} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {updateEpisodeDescription} from '@/redux-store/slices/EpisodeInfo';

import styles from './EpisodeDescription.module.css'; // CSS 모듈 import
import ButtonSetupDrawer from '@/components/create/ButtonSetupDrawer';
import PostAddIcon from '@mui/icons-material/PostAdd';
import EpisodeConversationTemplate from '../episode-conversationtemplate/EpisodeConversationTemplate';

import getLocalizedText from '@/utils/getLocalizedText';

import MessageBox from '@/components/MessageBox/MessageBox';
import {string} from 'valibot';

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
}

interface MessageBoxText {
  title: string;
  text: string;
}

export const EpisodeDescription: React.FC<CharacterPopupProps> = ({
  dataDefault,
  isModify = false,
  open,
  onClose,
  onSubmit,
}) => {
  const dispatch = useDispatch();
  const currentEpisodeInfo = useSelector((state: RootState) => state.episode.currentEpisodeInfo);

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

  const worldScenarioRef = useRef<HTMLInputElement | null>(null);
  const introductionRef = useRef<HTMLInputElement | null>(null);
  const secretRef = useRef<HTMLInputElement | null>(null);

  const messageBoxText = useMemo(() => {
    return {
      title: getLocalizedText('SystemMessage', 'overwriteAlert_label_001'),
      text: getLocalizedText('SystemMessage', 'overwriteAlert_desc_001'),
    };
  }, []);

  const openConversationModal = () => {
    setConversationModalOpen(true);
  };

  const closeConversationModal = () => {
    setConversationModalOpen(false);
  };

  // 정보 제출 처리
  const handleSubmit = () => {
    const updatedEpisodeDescription = {
      scenarioDescription: worldScenario,
      introDescription: introduction,
      secret,
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

  const onChangesetWorldScenario = (worldScenario: string) => {
    setWorldScenario(worldScenario);
  };

  const onChangesetIntroduction = (introduction: string) => {
    setIntroduction(introduction);
  };

  const onChangesetSecret = (secret: string) => {
    setSecret(secret);
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
      ref: React.RefObject<HTMLInputElement | null>,
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
      updateField(worldScenario, worldScenarioRef, setWorldScenario);
    } else if (focusedField === 'introduction') {
      updateField(introduction, introductionRef, setIntroduction);
    } else if (focusedField === 'secret') {
      updateField(secret, secretRef, setSecret);
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
      //if (showMessageBoxIfNotEmpty(introduction)) return;

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

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Episode Description</DialogTitle>
      <DialogContent>
        <TextField
          style={{marginBottom: '16px'}}
          label="World Scenario"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={worldScenario}
          onChange={e => onChangesetWorldScenario(e.target.value)}
          onFocus={() => handleFocus('worldScenario')}
          onBlur={handleBlur}
          inputRef={worldScenarioRef}
        />
        <TextField
          style={{marginBottom: '16px'}}
          label="Introduction"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={introduction}
          onChange={e => onChangesetIntroduction(e.target.value)}
          onFocus={() => handleFocus('introduction')}
          onBlur={handleBlur}
          inputRef={introductionRef}
        />
        <TextField
          style={{marginBottom: '16px'}}
          label="Secret"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={secret}
          onChange={e => onChangesetSecret(e.target.value)}
          onFocus={() => handleFocus('secret')}
          onBlur={handleBlur}
          inputRef={secretRef}
        />
        <ButtonSetupDrawer icon={<PostAddIcon />} label="Conversation Setup" onClick={openConversationModal} />
        <Button onClick={handleSubmit} color="primary" className={styles.confirmButton}>
          확인
        </Button>
        <div style={{marginBottom: '20px'}} /> {/* 여백 추가 */}
        {error && <Typography className={styles.errorMessage}>{error}</Typography>}
      </DialogContent>
      {/* 버튼들이 focusField에 따라 보이거나 숨겨짐 */}
      {focusedField && (
        <div className={styles.keyboardButtons}>
          <Button variant="contained" color="primary" data-virtual-button onClick={handleClickAutoWrite}>
            Auto Write
          </Button>
          <Button
            variant="contained"
            color="secondary"
            data-virtual-button
            onClick={() => handleVirtualButtonClick('{{char}}')}
          >
            Character
          </Button>
          <Button
            variant="contained"
            color="success"
            data-virtual-button
            onClick={() => handleVirtualButtonClick('{{user}}')}
          >
            User
          </Button>
        </div>
      )}

      <EpisodeConversationTemplate open={isConversationModalOpen} closeModal={closeConversationModal} />
      {isMessageBoxOpen && (
        <MessageBox
          title={messageBoxText.title}
          message={messageBoxText.text}
          onClose={handleCloseMessageBox}
          buttons={[
            {
              label: '확인',
              onClick: () => {
                setMessageBoxOpen(false);
                handleAutoWriteClick();
              },
            },
            {
              label: '취소',
              onClick: handleCloseMessageBox,
            },
          ]}
        />
      )}
    </Dialog>
  );
};

export default EpisodeDescription;
