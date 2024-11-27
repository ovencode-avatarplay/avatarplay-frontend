import React, {useState, useRef} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {updateEpisodeDescription} from '@/redux-store/slices/EpisodeInfo';

import styles from './EpisodeDescription.module.css';

export const EpisodeDescription: React.FC = () => {
  const dispatch = useDispatch();

  const currentEpisodeInfo = useSelector((state: RootState) => state.episode.currentEpisodeInfo);

  const [worldScenario, setWorldScenario] = useState<string>(
    currentEpisodeInfo.episodeDescription.scenarioDescription || '',
  );
  const [introduction, setIntroduction] = useState<string>(
    currentEpisodeInfo.episodeDescription.introDescription || '',
  );
  const [secret, setSecret] = useState<string>(currentEpisodeInfo.episodeDescription.secret || '');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const worldScenarioRef = useRef<HTMLInputElement | null>(null);
  const introductionRef = useRef<HTMLInputElement | null>(null);
  const secretRef = useRef<HTMLInputElement | null>(null);

  const handleFocus = (field: string) => {
    setFocusedField(field);
  };

  const handleBlur = (event: React.FocusEvent) => {
    // 버튼 클릭으로 인한 blur는 무시
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (relatedTarget && relatedTarget.dataset && relatedTarget.dataset.virtualButton) {
      return;
    }
    setFocusedField(null);
  };

  const handleVirtualButtonClick = (buttonText: string) => {
    if (focusedField === 'worldScenario' && worldScenarioRef.current) {
      worldScenarioRef.current.focus();
      setWorldScenario(worldScenario + buttonText);
    } else if (focusedField === 'introduction' && introductionRef.current) {
      introductionRef.current.focus();
      setIntroduction(introduction + buttonText);
    } else if (focusedField === 'secret' && secretRef.current) {
      secretRef.current.focus();
      setSecret(secret + buttonText);
    }
  };

  return (
    <Dialog open={true} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography className={styles.dialogTitle}>Character Information</Typography>
      </DialogTitle>
      <DialogContent className={styles.dialogContent}>
        <TextField
          label="World Scenario"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={worldScenario}
          onChange={e => setWorldScenario(e.target.value)}
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
          onChange={e => setIntroduction(e.target.value)}
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
          onChange={e => setSecret(e.target.value)}
          onFocus={() => handleFocus('secret')}
          onBlur={handleBlur}
          inputRef={secretRef}
        />
      </DialogContent>
      <DialogActions className={styles.dialogActions}>
        <Button color="primary" className={styles.confirmButton}>
          확인
        </Button>
      </DialogActions>
      {focusedField && (
        <div className={styles.keyboardButtons}>
          <Button
            variant="contained"
            color="primary"
            data-virtual-button
            onClick={() => handleVirtualButtonClick('자동입력')}
          >
            자동입력
          </Button>
          <Button
            variant="contained"
            color="secondary"
            data-virtual-button
            onClick={() => handleVirtualButtonClick('캐릭터')}
          >
            캐릭터
          </Button>
          <Button
            variant="contained"
            color="success"
            data-virtual-button
            onClick={() => handleVirtualButtonClick('유저')}
          >
            유저
          </Button>
        </div>
      )}
    </Dialog>
  );
};

export default EpisodeDescription;
