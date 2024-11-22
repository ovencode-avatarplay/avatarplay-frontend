import React from 'react';
import {TextField, Box, Typography, IconButton, DialogContent} from '@mui/material';
import {ArrowBackIos} from '@mui/icons-material';
import styles from './ChangeBehaviour.module.css';
import {TriggerMainDataType, TriggerSubDataType} from '@/types/apps/DataTypes';
import {TriggerInfo} from '@/types/apps/content/episode/TriggerInfo';
interface RenderTargetValueFieldProps {
  triggerInfo: TriggerInfo; // TriggerInfo 타입 지정
  setTriggerInfo: React.Dispatch<React.SetStateAction<TriggerInfo>>;
}

export const RenderTargetValueField: React.FC<RenderTargetValueFieldProps> = ({triggerInfo, setTriggerInfo}) => {
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
  switch (triggerInfo.triggerActionType) {
    case TriggerSubDataType.actionEpisodeChangeId:
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

    case TriggerSubDataType.actionIntimacyPoint:
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
              label="Character Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={triggerInfo.actionChangePrompt.characterName}
              onChange={e =>
                setTriggerInfo(prev => ({
                  ...prev,
                  actionChangePrompt: {
                    ...prev.actionChangePrompt,
                    characterName: e.target.value,
                  },
                }))
              }
            />
            <TextField
              label="Character Description"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              value={triggerInfo.actionChangePrompt.characterDescription}
              onChange={e =>
                setTriggerInfo(prev => ({
                  ...prev,
                  actionChangePrompt: {
                    ...prev.actionChangePrompt,
                    characterDescription: e.target.value,
                  },
                }))
              }
            />
            <TextField
              label="World Scenario"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              value={triggerInfo.actionChangePrompt.scenarioDescription}
              onChange={e =>
                setTriggerInfo(prev => ({
                  ...prev,
                  actionChangePrompt: {
                    ...prev.actionChangePrompt,
                    scenarioDescription: e.target.value,
                  },
                }))
              }
            />
            <TextField
              label="Introduction"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              value={triggerInfo.actionChangePrompt.introDescription}
              onChange={e =>
                setTriggerInfo(prev => ({
                  ...prev,
                  actionChangePrompt: {
                    ...prev.actionChangePrompt,
                    introDescription: e.target.value,
                  },
                }))
              }
            />
            <TextField
              label="Secret"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              value={triggerInfo.actionChangePrompt.secret}
              onChange={e =>
                setTriggerInfo(prev => ({
                  ...prev,
                  actionChangePrompt: {
                    ...prev.actionChangePrompt,
                    secret: e.target.value,
                  },
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

    default:
      return null;
  }
};
