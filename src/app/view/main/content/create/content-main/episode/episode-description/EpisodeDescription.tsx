'use client';

import React, {useState, useEffect, useRef} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {updateEpisodeDescription} from '@/redux-store/slices/EpisodeInfo';

import styles from './EpisodeDescription.module.css'; // CSS 모듈 import
import ButtonSetupDrawer from '@/components/create/ButtonSetupDrawer';

import PostAddIcon from '@mui/icons-material/PostAdd';
import EpisodeConversationTemplate from '../episode-conversationtemplate/EpisodeConversationTemplate';

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

export const EpisodeDescription: React.FC<CharacterPopupProps> = ({
  dataDefault,
  isModify = false,
  open,
  onClose,
  onSubmit,
}) => {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.userId);
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

  const worldScenarioRef = useRef<HTMLInputElement | null>(null);
  const introductionRef = useRef<HTMLInputElement | null>(null);
  const secretRef = useRef<HTMLInputElement | null>(null);

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

    dispatch(updateEpisodeDescription(updatedEpisodeDescription)); // Redux에 정보 업데이트
    onClose(); // 다이얼로그 닫기
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

  // 키보드 열림 상태 감지
  useEffect(() => {
    const handleResize = () => {
      const viewport = window.visualViewport;
      setKeyboardOpen(viewport ? viewport.height < window.innerHeight : false);
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    return () => {
      window.visualViewport?.removeEventListener('resize', handleResize);
    };
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

        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + buttonText.length, start + buttonText.length);
        });
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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography className={styles.dialogTitle}>Character Information</Typography>
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <Typography variant="subtitle1" gutterBottom>
          Please enter the character details below:
        </Typography>
        <TextField
          label="World Scenario"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={worldScenario}
          onChange={e => onChangesetWorldScenario(e.target.value)}
          onFocus={() => handleFocus('worldScenario')}
          onBlur={handleBlur}
          inputRef={worldScenarioRef}
        />
        <TextField
          label="Introduction"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={introduction}
          onChange={e => onChangesetIntroduction(e.target.value)}
          onFocus={() => handleFocus('introduction')}
          onBlur={handleBlur}
          inputRef={introductionRef}
        />
        <TextField
          label="Secret"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={secret}
          onChange={e => onChangesetSecret(e.target.value)}
          onFocus={() => handleFocus('secret')}
          onBlur={handleBlur}
          inputRef={secretRef}
        />

        <ButtonSetupDrawer icon={<PostAddIcon />} label="Conversation Setup" onClick={openConversationModal} />
        {error && <Typography className={styles.errorMessage}>{error}</Typography>}
      </DialogContent>
      <DialogActions className={styles.dialogActions}>
        <Button onClick={handleSubmit} color="primary" className={styles.confirmButton}>
          확인
        </Button>
      </DialogActions>

      {/* 버튼들이 focusField에 따라 보이거나 숨겨짐 */}
      {focusedField && !isKeyboardOpen && (
        <div className={styles.keyboardButtons}>
          <Button
            variant="contained"
            color="primary"
            data-virtual-button
            onClick={() => handleVirtualButtonClick('자동입력')}
          >
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
    </Dialog>
  );
};

export default EpisodeDescription;
