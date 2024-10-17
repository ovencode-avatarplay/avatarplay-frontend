import React, {useState, useEffect} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Box,
  Typography,
  IconButton,
  Select,
  MenuItem,
  TextField,
  SelectChangeEvent,
} from '@mui/material';
import {ArrowBackIos} from '@mui/icons-material';
import styles from './ChangeBehaviour.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {updateTriggerInfo} from '@/redux-store/slices/EpisodeInfo';
import {TriggerMainDataType, TriggerSubDataType} from '@/types/apps/dataTypes';
import {TriggerInfo} from '@/types/apps/content/episode/triggerInfo';
import EpisodeConversationTemplate from '../episode-conversationtemplate/EpisodeConversationTemplate';
import ChapterBoardOnTrigger from '@/app/view/main/content/create/content-main/chapter/OnTrigger/ChapterBoardOnTrigger';

interface ChangeBehaviourProps {
  open: boolean;
  onClose: () => void;
  item: TriggerInfo;
}

const ChangeBehaviour: React.FC<ChangeBehaviourProps> = ({open, onClose, item}) => {
  const dispatch = useDispatch();
  const [triggerInfo, setTriggerInfo] = useState<TriggerInfo>({
    ...item,
    triggerType: item.triggerType || TriggerMainDataType.triggerValueIntimacy,
    actionChangeEpisodeId: item.actionChangeEpisodeId || 0, // 초기 값 설정
    actionChangePrompt: item.actionChangePrompt || '',
    actionConversationList: item.actionConversationList || [],
  });

  const [selectedChapter, setSelectedChapter] = useState<string>('Chapter.1');
  const [selectedEpisode, setSelectedEpisode] = useState<string>('Ep.2 Wanna go out?');

  const [isEpisodeConversationTemplateOpen, setEpisodeConversationTemplateOpen] = useState(false);
  const [isChapterBoardOpen, setIsChapterBoardOpen] = useState(false);

  const contentInfo = useSelector((state: RootState) => state.content.contentInfo ?? []);
  const curContentId = useSelector((state: RootState) => state.contentselection.contentID);

  const handleOpenEpisodeConversationTemplate = () => {
    setEpisodeConversationTemplateOpen(true);
  };

  const handleCloseEpisodeConversationTemplate = () => {
    setEpisodeConversationTemplateOpen(false);
  };

  const handleOpenChapterBoard = () => {
    setIsChapterBoardOpen(true); // ChapterBoard 열기
  };

  const handleCloseChapterBoard = () => {
    setIsChapterBoardOpen(false); // ChapterBoard 닫기
  };

  const handleSelectEpisode = (chapterId: number, episodeId: number) => {
    // 선택한 챕터와 에피소드의 이름 업데이트
    const selectedChapter = contentInfo.find(content =>
      content.chapterInfoList.some(chapter => chapter.id === chapterId),
    );
    const selectedChapterInfo = selectedChapter?.chapterInfoList.find(chapter => chapter.id === chapterId);
    const selectedEpisode = selectedChapterInfo?.episodeInfoList.find(episode => episode.id === episodeId);

    if (selectedEpisode) {
      setSelectedChapter(selectedChapterInfo?.name || 'Chapter.1');
      setSelectedEpisode(selectedEpisode.name || 'Ep.2 Wanna go out?');
    }

    setTriggerInfo(prev => ({
      ...prev,
      actionChangeEpisodeId: episodeId,
    }));

    setIsChapterBoardOpen(false);
  };

  const handleMainDataChange = (event: SelectChangeEvent<number>) => {
    const selectedTriggerType = event.target.value as TriggerMainDataType;
    setTriggerInfo(prev => ({
      ...prev,
      triggerType: selectedTriggerType,
    }));

    const subDataOptions = getSubDataOptionsForMainData(selectedTriggerType);
    if (!subDataOptions.some(option => option.key === triggerInfo.triggerActionType)) {
      setTriggerInfo(prev => ({
        ...prev,
        triggerActionType: subDataOptions[0].key,
        actionChangePrompt: '',
        actionIntimacyPoint: 0,
        actionCoversationList: [],
      }));
    }
  };

  const handleSubDataChange = (event: SelectChangeEvent<number>) => {
    const selectedSubType = event.target.value as TriggerSubDataType;
    setTriggerInfo(prev => ({
      ...prev,
      triggerActionType: selectedSubType,
    }));
  };

  const getSubDataOptionsForMainData = (mainDataKey: TriggerMainDataType) => {
    switch (mainDataKey) {
      case TriggerMainDataType.triggerValueIntimacy:
        return [
          {key: TriggerSubDataType.actionEpisodeChangeId, label: 'Episode Change'},
          {key: TriggerSubDataType.ChangePrompt, label: 'Change Prompt'},
        ];
      case TriggerMainDataType.triggerValueChatCount:
      case TriggerMainDataType.triggerValueKeyword:
        return [
          {key: TriggerSubDataType.actionEpisodeChangeId, label: 'Episode Change'},
          {key: TriggerSubDataType.ChangePrompt, label: 'Change Prompt'},
          {key: TriggerSubDataType.actionIntimacyPoint, label: 'Get Intimacy Point'},
        ];
      case TriggerMainDataType.triggerValueTimeMinute:
        return [
          {key: TriggerSubDataType.ChangePrompt, label: 'Change Prompt'},
          {key: TriggerSubDataType.actionIntimacyPoint, label: 'Get Intimacy Point'},
        ];
      default:
        return [{key: TriggerSubDataType.ChangePrompt, label: 'Change Prompt'}];
    }
  };

  useEffect(() => {
    const subDataOptions = getSubDataOptionsForMainData(triggerInfo.triggerType);
    if (subDataOptions.length > 0 && !subDataOptions.some(option => option.key === triggerInfo.triggerActionType)) {
      setTriggerInfo(prev => ({
        ...prev,
        triggerActionType: subDataOptions[0].key,
      }));
    }
  }, [triggerInfo.triggerType]);

  const handleClose = () => {
    dispatch(updateTriggerInfo({id: triggerInfo.id, info: {...triggerInfo}}));
    onClose();
  };

  const renderTargetValueField = (triggerType: TriggerMainDataType) => {
    switch (triggerType) {
      case TriggerMainDataType.triggerValueIntimacy:
      case TriggerMainDataType.triggerValueChatCount:
      case TriggerMainDataType.triggerValueTimeMinute:
        return (
          <TextField
            className={styles.input}
            variant="outlined"
            label="Target Value"
            type="number"
            value={triggerInfo.triggerValueIntimacy || 0}
            onChange={e =>
              setTriggerInfo(prev => ({
                ...prev,
                triggerValueIntimacy: Number(e.target.value),
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

  const renderSubDataFields = (triggerActionType: TriggerSubDataType) => {
    switch (triggerActionType) {
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
              onChange={e =>
                setTriggerInfo(prev => ({
                  ...prev,
                  actionIntimacyPoint: Number(e.target.value),
                }))
              }
            />
            <Typography className={styles.label}>Max Repetition Count</Typography>
            <TextField
              className={styles.input}
              variant="outlined"
              value={triggerInfo.maxIntimacyCount}
              onChange={e =>
                setTriggerInfo(prev => ({
                  ...prev,
                  maxIntimacyCount: Number(e.target.value),
                }))
              }
            />
          </Box>
        );
      case TriggerSubDataType.ChangePrompt:
        return (
          <Box className={styles.promptContainer}>
            <Typography className={styles.label}>Prompt Description</Typography>
            <TextField
              className={styles.input}
              variant="outlined"
              value={triggerInfo.actionChangePrompt}
              onChange={e =>
                setTriggerInfo(prev => ({
                  ...prev,
                  actionChangePrompt: e.target.value,
                }))
              }
            />
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

  return (
    <>
      <Dialog
        fullScreen
        open={open}
        onClose={onClose}
        classes={{paper: styles.modal}}
        disableAutoFocus
        disableEnforceFocus
      >
        <DialogTitle className={styles['modal-header']}>
          <Button onClick={handleClose} className={styles['close-button']}>
            <ArrowBackIos />
          </Button>
          <span className={styles['modal-title']}>Change Behaviour</span>
        </DialogTitle>
        <DialogContent className={styles.dialogContent}>
          <Box className={styles.container}>
            <Box className={styles.triggerTypeSection}>
              <Typography className={styles.label}>Trigger Type</Typography>
              <div className={styles.topBox}>
                <Box className={styles.icon} />
                <Select
                  className={styles.selectBox}
                  value={triggerInfo.triggerType}
                  onChange={handleMainDataChange}
                  variant="outlined"
                >
                  <MenuItem value={TriggerMainDataType.triggerValueIntimacy}>Intimacy</MenuItem>
                  <MenuItem value={TriggerMainDataType.triggerValueKeyword}>Keyword</MenuItem>
                  <MenuItem value={TriggerMainDataType.triggerValueChatCount}>Chat Count</MenuItem>
                  <MenuItem value={TriggerMainDataType.triggerValueTimeMinute}>Time (Minutes)</MenuItem>
                </Select>
              </div>
            </Box>

            <Box className={styles.targetValueSection}>{renderTargetValueField(triggerInfo.triggerType)}</Box>
          </Box>

          <Box className={styles.subValueContainer}>
            <Box className={styles.targetValueSection}>
              <Typography className={styles.label}>Sub Data</Typography>
              <Box className={styles.episodeChangeRow}>
                <Box className={styles.icon} />
                <Select
                  className={styles.selectBox}
                  value={triggerInfo.triggerActionType}
                  onChange={handleSubDataChange}
                  variant="outlined"
                >
                  {getSubDataOptionsForMainData(triggerInfo.triggerType).map(option => (
                    <MenuItem key={option.key} value={option.key}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                <IconButton className={styles.rightButton}>
                  <ArrowBackIos />
                </IconButton>
              </Box>
              {renderSubDataFields(triggerInfo.triggerActionType)}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* ChapterBoard 컴포넌트 */}
      <ChapterBoardOnTrigger
        open={isChapterBoardOpen}
        onClose={handleCloseChapterBoard}
        initialChapters={contentInfo.find(item => item.id === curContentId)?.chapterInfoList || []}
        onSelectEpisode={handleSelectEpisode} // 선택된 에피소드에 대한 처리
        onAddChapter={() => {}}
        onDeleteChapter={() => {}}
        onAddEpisode={() => {}}
        onDeleteEpisode={() => {}}
      />

      {/* EpisodeConversationTemplate 모달 */}
      <EpisodeConversationTemplate
        open={isEpisodeConversationTemplateOpen}
        closeModal={handleCloseEpisodeConversationTemplate}
      />
    </>
  );
};

export default ChangeBehaviour;
