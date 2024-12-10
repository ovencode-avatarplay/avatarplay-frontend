import React from 'react';
import {TextField, Box, Typography, IconButton, DialogContent} from '@mui/material';
import {ArrowBackIos} from '@mui/icons-material';
import styles from './ChangeBehaviour.module.css';
import {TriggerMainDataType, TriggerSubDataType} from '@/types/apps/DataTypes';
import {TriggerInfo} from '@/types/apps/content/episode/TriggerInfo';
import PlayMediaComponent from './PlayMediaComponent';
import TriggerChangeCharacter from './TriggerChangeCharacter';
interface RenderTargetValueFieldProps {
  triggerInfo: TriggerInfo; // TriggerInfo 타입 지정
  setTriggerInfo: React.Dispatch<React.SetStateAction<TriggerInfo>>;
}

export const RenderTargetValueField: React.FC<RenderTargetValueFieldProps> = ({triggerInfo, setTriggerInfo}) => {
  console.log('asd');
  switch (triggerInfo.triggerType) {
    case TriggerMainDataType.triggerValueIntimacy:
      return (
        <TextField
          className={styles.input}
          variant="outlined"
          label="Target Value (Intimacy)"
          type="number"
          value={triggerInfo.triggerValueIntimacy || ''}
          onChange={e => {
            let value = e.target.value;

            if (value && Number(value) > 100) {
              value = '100';
            }

            setTriggerInfo(prev => ({
              ...prev,
              triggerValueIntimacy: value ? Number(value) : 0,
            }));
          }}
          inputProps={{
            min: 0,
            max: 100,
          }}
        />
      );

    case TriggerMainDataType.triggerValueChatCount:
      return (
        <TextField
          className={styles.input}
          variant="outlined"
          label="Target Value (Chat Count)"
          type="number"
          value={triggerInfo.triggerValueChatCount || ''}
          onChange={e => {
            setTriggerInfo(prev => ({
              ...prev,
              triggerValueChatCount: Number(e.target.value),
            }));
          }}
        />
      );

    case TriggerMainDataType.triggerValueTimeMinute:
      return (
        <TextField
          className={styles.input}
          variant="outlined"
          label="Target Value (Time Minute)"
          type="number"
          value={triggerInfo.triggerValueTimeMinute || 0}
          onChange={e =>
            setTriggerInfo(prev => ({
              ...prev,
              triggerValueTimeMinute: Number(e.target.value),
            }))
          }
        />
      );

    case TriggerMainDataType.triggerValueKeyword:
      return (
        <TextField
          className={styles.input}
          variant="outlined"
          label="Target Keywords"
          value={triggerInfo.triggerValueKeyword || ''}
          onChange={e => {
            setTriggerInfo(prev => ({
              ...prev,
              triggerValueKeyword: e.target.value,
            }));
          }}
        />
      );

    default:
      return null;
  }
};

interface RenderSubDataFieldsProps {
  triggerInfo: TriggerInfo; // TriggerInfo 타입 지정
  setTriggerInfo: React.Dispatch<React.SetStateAction<TriggerInfo>>;
  selectedChapter: string;
  selectedEpisode: string;
  handleOpenChapterBoard: () => void;
  handleOpenEpisodeConversationTemplate: () => void;
}

export const RenderSubDataFields: React.FC<RenderSubDataFieldsProps> = ({
  triggerInfo,
  setTriggerInfo,
  selectedChapter,
  selectedEpisode,
  handleOpenChapterBoard,
  handleOpenEpisodeConversationTemplate,
}) => {
  console.log(selectedChapter);
  console.log(selectedEpisode);
  switch (triggerInfo.triggerActionType) {
    case TriggerSubDataType.EpisodeChange:
      return (
        <Box className={styles.destinationContainer}>
          <Typography className={styles.destinationLabel}>Destination Episode</Typography>
          <Box className={styles.destinationDetails}>
            <Box className={styles.destinationIcon} />
            <Box>
              <Typography className={styles.chapter}>{selectedChapter}</Typography>
              <Typography className={styles.episode}>{selectedEpisode}</Typography>
            </Box>
            <IconButton className={styles.rightButton} onClick={handleOpenChapterBoard}>
              <ArrowBackIos />
            </IconButton>
          </Box>
        </Box>
      );

    case TriggerSubDataType.GetIntimacyPoint:
      return (
        <Box className={styles.intimacyContainer}>
          <Typography className={styles.label}>Get Point</Typography>
          <TextField
            className={styles.input}
            variant="outlined"
            value={triggerInfo.actionIntimacyPoint}
            onChange={e => {
              const value = Math.min(Number(e.target.value), 100);
              setTriggerInfo(prev => ({
                ...prev,
                actionIntimacyPoint: value,
              }));
            }}
            inputProps={{
              min: 0,
              max: 100,
            }}
          />

          <Typography className={styles.label}>Max Repetition Count</Typography>
          <TextField
            className={styles.input}
            variant="outlined"
            value={triggerInfo.maxIntimacyCount}
            onChange={e => {
              const value = Math.min(Number(e.target.value), 10);
              setTriggerInfo(prev => ({
                ...prev,
                maxIntimacyCount: value,
              }));
            }}
            inputProps={{
              min: 0,
              max: 10,
            }}
          />
        </Box>
      );

    case TriggerSubDataType.ChangePrompt:
      return (
        <Box className={styles.promptContainer}>
          <DialogContent className={styles.dialogContent}>
            <TextField
              label="ScenarioDescription"
              variant="outlined"
              fullWidth
              margin="normal"
              value={triggerInfo.actionPromptScenarioDescription}
              onChange={e =>
                setTriggerInfo(prev => ({
                  ...prev,
                  actionPromptScenarioDescription: e.target.value, // 문자열로 바로 업데이트
                }))
              }
            />
          </DialogContent>
          <Typography className={styles.label}>Guide Preset (Optional)</Typography>
          <Box className={styles.conversationTemplate}>
            <IconButton className={styles.rightButton} onClick={handleOpenEpisodeConversationTemplate}>
              <ArrowBackIos />
            </IconButton>
            <Typography className={styles.conversationLabel}>Conversation Template</Typography>
          </Box>
        </Box>
      );
    case TriggerSubDataType.PlayMedia:
      return (
        <PlayMediaComponent
          onMediaSelect={urlList => {
            setTriggerInfo(prev => ({
              ...prev,
              actionMediaUrlList: urlList, // 선택된 파일 URL 저장
            }));
          }}
          onTypeSelect={num => {
            setTriggerInfo(prev => ({
              ...prev,
              actionMediaState: num, // 선택된 파일 URL 저장
            }));
          }}
          type={triggerInfo.actionMediaState}
          initUrls={triggerInfo.actionMediaUrlList}
        />
      );
    case TriggerSubDataType.ChangeCharacter:
      return <TriggerChangeCharacter triggerInfo={triggerInfo} setTriggerInfo={setTriggerInfo} />;
    default:
      return null;
  }
};
