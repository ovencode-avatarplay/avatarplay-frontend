'use client';
// Modal or Drawer

import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from '@mui/material';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {updateEpisodeDescription} from '@/redux-store/slices/EpisodeInfo';

import styles from './EpisodeDescription.module.css'; // CSS 모듈 import

export interface CharacterDataType {
  userId: number;
  characterName: string;
  characterDescription: string;
  worldScenario: string;
  introduction: string;
  secret: string;
  //thumbnail: string;
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

  // 현재 에피소드 정보 가져오기
  const currentEpisodeInfo = useSelector((state: RootState) => state.episode.currentEpisodeInfo);

  // 상태 초기화
  const [characterName, setCharacterName] = useState<string>(currentEpisodeInfo.episodeDescription.characterName || '');
  const [characterDescription, setCharacterDescription] = useState<string>(
    currentEpisodeInfo.episodeDescription.characterDescription || '',
  );
  const [worldScenario, setWorldScenario] = useState<string>(
    currentEpisodeInfo.episodeDescription.scenarioDescription || '',
  );
  const [introduction, setIntroduction] = useState<string>(
    currentEpisodeInfo.episodeDescription.introDescription || '',
  );
  const [secret, setSecret] = useState<string>(currentEpisodeInfo.episodeDescription.secret || '');

  //const [thumbnail, setThumbnail] = useState<string>(dataDefault?.thumbnail || "");
  const [error, setError] = useState<string | null>(null);

  // 정보 제출 처리
  const handleSubmit = () => {
    const updatedEpisodeDescription = {
      characterName,
      characterDescription,
      scenarioDescription: worldScenario,
      introDescription: introduction,
      secret,
    };

    dispatch(updateEpisodeDescription(updatedEpisodeDescription)); // Redux에 정보 업데이트

    onClose(); // 다이얼로그 닫기
  };

  const onChangeName = (name: string) => {
    setCharacterName(name);
  };
  const onChangeCharacterDescription = (description: string) => {
    setCharacterDescription(description);
  };
  const onChangesetWorldScenario = (worldScenario: string) => {
    setWorldScenario(worldScenario);
  };

  const onChangesetIntroduction = (worldScenario: string) => {
    setIntroduction(worldScenario);
  };

  const onChangesetSecret = (worldScenario: string) => {
    setSecret(worldScenario);
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
        <TextField label="User ID" variant="outlined" fullWidth margin="normal" type="number" value={userId} disabled />
        <TextField
          label="Character Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={characterName}
          onChange={e => onChangeName(e.target.value)}
        />
        <TextField
          label="Character Description"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={characterDescription}
          onChange={e => onChangeCharacterDescription(e.target.value)}
        />
        <TextField
          label="World Scenario"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={worldScenario}
          onChange={e => onChangesetWorldScenario(e.target.value)}
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
        />
        {/* <TextField
                    label="Thumbnail"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                /> */}
        {error && <Typography className={styles.errorMessage}>{error}</Typography>}
      </DialogContent>
      <DialogActions className={styles.dialogActions}>
        {/* <div>
                <Button onClick={handleSubmit} color="primary">
                        {isModify ? "Modify" : "Create"}
                    </Button>
                </div> */}
        <Button onClick={handleSubmit} color="primary" className={styles.confirmButton}>
          확인
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EpisodeDescription;
