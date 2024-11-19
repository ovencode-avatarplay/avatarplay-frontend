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
import {ArrowBackIos, DeleteForever, DriveFileRenameOutline} from '@mui/icons-material';
import styles from './ChangeBehaviour.module.css';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {removeTriggerInfo, updateTriggerInfo, updateTriggerInfoName} from '@/redux-store/slices/EpisodeInfo';
import {TriggerMainDataType, TriggerSubDataType} from '@/types/apps/DataTypes';
import {TriggerInfo} from '@/types/apps/content/episode/TriggerInfo';
import EpisodeConversationTemplate from '../episode-conversationtemplate/EpisodeConversationTemplate';
import ChapterBoardOnTrigger from '@/app/view/main/content/create/content-main/chapter/OnTrigger/ChapterBoardOnTrigger';

interface ChangeBehaviourProps {
  open: boolean;
  onClose: () => void;
  index: number;
}

const ChangeBehaviour: React.FC<ChangeBehaviourProps> = ({open, onClose, index}) => {
  const item = useSelector((state: RootState) => state.episode.currentEpisodeInfo.triggerInfoList[index]);
  const content = useSelector((state: RootState) => state.content.curEditingContentInfo);

  const dispatch = useDispatch();

  const [triggerInfo, setTriggerInfo] = useState<TriggerInfo>({
    id: item?.id || 0,
    name: item?.name || '',
    triggerType: item?.triggerType || 0,
    triggerValueIntimacy: item?.triggerValueIntimacy || 0,
    triggerValueChatCount: item?.triggerValueChatCount || 0,
    triggerValueKeyword: item?.triggerValueKeyword || '',
    triggerValueTimeMinute: item?.triggerValueTimeMinute || 0,
    triggerActionType: item?.triggerActionType || 0,
    actionChangeEpisodeId: item?.actionChangeEpisodeId || 0,
    actionChangePrompt: {
      characterName: item?.actionChangePrompt?.characterName || '',
      characterDescription: item?.actionChangePrompt?.characterDescription || '',
      scenarioDescription: item?.actionChangePrompt?.scenarioDescription || '',
      introDescription: item?.actionChangePrompt?.introDescription || '',
      secret: item?.actionChangePrompt?.secret || '',
    },
    actionIntimacyPoint: item?.actionIntimacyPoint || 0,
    actionChangeBackground: item?.actionChangeBackground || '',
    maxIntimacyCount: item?.maxIntimacyCount || 0,
    actionConversationList: item?.actionConversationList || [],
  });

  useEffect(() => {
    if (item) {
      // triggerInfo 초기화
      setTriggerInfo({
        id: item.id || 0,
        name: item.name || '',
        triggerType: item.triggerType || 0,
        triggerValueIntimacy: item.triggerValueIntimacy || 0,
        triggerValueChatCount: item.triggerValueChatCount || 0,
        triggerValueKeyword: item.triggerValueKeyword || '',
        triggerValueTimeMinute: item.triggerValueTimeMinute || 0,
        triggerActionType: item.triggerActionType || 0,
        actionChangeEpisodeId: item.actionChangeEpisodeId || 0,
        actionChangePrompt: {
          characterName: item.actionChangePrompt?.characterName || '',
          characterDescription: item.actionChangePrompt?.characterDescription || '',
          scenarioDescription: item.actionChangePrompt?.scenarioDescription || '',
          introDescription: item.actionChangePrompt?.introDescription || '',
          secret: item.actionChangePrompt?.secret || '',
        },
        actionIntimacyPoint: item.actionIntimacyPoint || 0,
        actionChangeBackground: item.actionChangeBackground || '',
        maxIntimacyCount: item.maxIntimacyCount || 0,
        actionConversationList: item.actionConversationList || [],
      });

      const triggerId = triggerInfo.id; // 현재 triggerId를 가져옴

      if (triggerId) {
        // triggerId를 기준으로 matchingChapter 찾기
        const matchingChapter = content.chapterInfoList.find(chapter =>
          chapter.episodeInfoList.some(
            episode => episode.triggerInfoList.some(trigger => trigger.id === triggerId), // triggerId와 일치하는 트리거 찾기
          ),
        );

        // triggerId를 기준으로 matchingEpisode 찾기
        const matchingEpisode = content.chapterInfoList
          .flatMap(chapter => chapter.episodeInfoList)
          .find(
            episode => episode.triggerInfoList.some(trigger => trigger.id === triggerInfo.actionChangeEpisodeId), // triggerId와 일치하는 트리거 찾기
          );

        // selectedChapter 및 selectedEpisode 업데이트
        if (matchingChapter) {
          setSelectedChapter(matchingChapter.name || 'None');
        } else {
          setSelectedChapter('None');
        }

        if (matchingEpisode) {
          setSelectedEpisode(matchingEpisode.name || 'None');
        } else {
          setSelectedEpisode('None');
        }
      } else {
        setSelectedChapter('None');
        setSelectedEpisode('None');
      }
    }
  }, [item, content.chapterInfoList]);

  const [selectedChapter, setSelectedChapter] = useState<string>('None');
  const [selectedEpisode, setSelectedEpisode] = useState<string>('None');
  const [isEpisodeConversationTemplateOpen, setEpisodeConversationTemplateOpen] = useState(false);
  const [isChapterBoardOpen, setIsChapterBoardOpen] = useState(false);
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
  const [newTriggerName, setNewTriggerName] = useState(item?.name);
  const contentInfo = useSelector((state: RootState) => state.content.curEditingContentInfo);
  const selectedContentId = useSelector((state: RootState) => state.contentselection.selectedContentId);
  const triggerInfoList = useSelector((state: RootState) => state.episode.currentEpisodeInfo.triggerInfoList || []);

  const handleOpenEpisodeConversationTemplate = () => {
    setEpisodeConversationTemplateOpen(true);
  };

  const handleCloseEpisodeConversationTemplate = () => {
    setEpisodeConversationTemplateOpen(false);
  };

  const handleOpenChapterBoard = () => {
    setIsChapterBoardOpen(true);
  };

  const handleCloseChapterBoard = () => {
    setIsChapterBoardOpen(false);
  };
  const handleSelectEpisode = (chapterId: number, episodeId: number) => {
    const selectedChapterInfo = content.chapterInfoList.find(chapter => chapter.id === chapterId);

    if (!selectedChapterInfo) {
      console.error('Selected chapter not found');
      return; // selectedChapterInfo가 없으면 함수를 종료
    }

    // 선택한 에피소드의 인덱스를 찾음
    const selectedEpisodeIndex = selectedChapterInfo.episodeInfoList.findIndex(episode => episode.id === episodeId);

    if (selectedEpisodeIndex !== -1) {
      const selectedEpisode = selectedChapterInfo.episodeInfoList[selectedEpisodeIndex];
      setSelectedChapter(selectedChapterInfo.name || 'None');
      setSelectedEpisode(selectedEpisode.name || 'None select Episode');

      // 전체 에피소드 인덱스를 계산
      const totalEpisodeIndex =
        content.chapterInfoList
          .slice(
            0,
            content.chapterInfoList.findIndex(chapter => chapter.id === chapterId),
          )
          .reduce((acc, chapter) => {
            return acc + chapter.episodeInfoList.length; // 이전 장의 모든 에피소드 수
          }, 0) + selectedEpisodeIndex; // 현재 장에서 선택된 에피소드의 인덱스 추가

      // Update triggerInfo with the total index instead of episodeId
      setTriggerInfo(prev => ({
        ...prev,
        actionChangeEpisodeId: totalEpisodeIndex, // Here we use the total index
      }));
    } else {
      console.error('Selected episode not found');
    }

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
        actionChangePrompt: {
          characterName: '', // 기본 캐릭터 이름
          characterDescription: '', // 기본 캐릭터 설명
          scenarioDescription: '', // 기본 시나리오 설명
          introDescription: '', // 기본 소개 설명
          secret: '', // 기본 비밀 정보
        },
        actionIntimacyPoint: 0,
        actionConversationList: [],
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
        return [
          {key: TriggerSubDataType.actionEpisodeChangeId, label: 'Episode Change'},
          {key: TriggerSubDataType.ChangePrompt, label: 'Change Prompt'},
          {key: TriggerSubDataType.actionIntimacyPoint, label: 'Get Intimacy Point'},
        ];
      case TriggerMainDataType.triggerValueKeyword:
        return [
          {key: TriggerSubDataType.actionEpisodeChangeId, label: 'Episode Change'},
          {key: TriggerSubDataType.ChangePrompt, label: 'Change Prompt'},
          {key: TriggerSubDataType.actionIntimacyPoint, label: 'Get Intimacy Point'},
        ];
      case TriggerMainDataType.triggerValueTimeMinute:
        return [
          {key: TriggerSubDataType.actionEpisodeChangeId, label: 'Episode Change'},
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
    // Keyword 타입이 이미 존재하는지 확인 (TriggerMainDataType.triggerValueKeyword = 1 이라고 가정)
    const isKeywordTypeExists = triggerInfoList.some(
      (info, idx) => info.triggerType === TriggerMainDataType.triggerValueKeyword && idx !== index, // idx를 사용하여 현재 인덱스와 비교
    );

    if (isKeywordTypeExists && triggerInfo.triggerType === TriggerMainDataType.triggerValueKeyword) {
      alert('Keyword타입은 1개를 넘을 수 없습니다.');
      return; // handleClose를 취소함
    }

    // 조건을 만족하지 않으면 트리거 정보 업데이트
    dispatch(updateTriggerInfo({index: index, info: {...triggerInfo}}));
    onClose();
  };

  const handleRemove = () => {
    dispatch(removeTriggerInfo(index));
    onClose();
  };

  // 이름 변경 처리 함수
  const handleOpenEditNameModal = () => {
    setIsEditNameModalOpen(true);
  };

  const handleCloseEditNameModal = () => {
    setIsEditNameModalOpen(false);
  };

  const handleSaveNewName = () => {
    if (newTriggerName.trim()) {
      dispatch(updateTriggerInfoName({index: index, name: newTriggerName}));
      triggerInfo.name = newTriggerName;
      handleCloseEditNameModal();
    }
  };

  const renderTargetValueField = (triggerType: TriggerMainDataType) => {
    console.log('Current triggerType:', triggerInfo.triggerType);
    switch (triggerType) {
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

              // 빈 값이 아니라면 숫자로 변환하여 100 초과 여부를 확인
              if (value && Number(value) > 100) {
                value = '100'; // 100을 초과할 경우 강제로 '100'으로 설정
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
              onChange={e => {
                const value = Math.min(Number(e.target.value), 100); // 최대값 100 설정
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
                const value = Math.min(Number(e.target.value), 100); // 최대값 10 설정
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

  return (
    <>
      <Dialog fullScreen open={open} onClose={onClose} className={styles.modal} disableAutoFocus disableEnforceFocus>
        <DialogTitle className={styles['modal-header']}>
          <Button onClick={handleClose} className={styles['close-button']}>
            <ArrowBackIos />
          </Button>
          <span className={styles['modal-title']}>{item ? item.name : '기본 이름 또는 로딩 중...'}</span>

          <IconButton onClick={handleOpenEditNameModal}>
            <DriveFileRenameOutline />
          </IconButton>

          <IconButton onClick={handleRemove}>
            <DeleteForever />
          </IconButton>
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
        initialChapters={contentInfo?.chapterInfoList || []}
        onSelectEpisode={handleSelectEpisode}
        onAddChapter={() => {}}
        onDeleteChapter={() => {}}
        onAddEpisode={() => {}}
        onDeleteEpisode={() => {}}
      />

      {/* EpisodeConversationTemplate 모달 */}
      <EpisodeConversationTemplate
        open={isEpisodeConversationTemplateOpen}
        closeModal={handleCloseEpisodeConversationTemplate}
        triggerIndex={index}
      />

      {/* 이름 변경 모달 */}
      <Dialog open={isEditNameModalOpen} onClose={handleCloseEditNameModal}>
        <DialogTitle>Edit Trigger Name</DialogTitle>
        <DialogContent>
          <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
            <TextField
              label="New Trigger Name"
              value={newTriggerName}
              onChange={e => {
                console.log('onChange : ', e.target.value);
                setNewTriggerName(e.target.value);
              }}
              fullWidth
            />
            <Button onClick={handleSaveNewName} variant="contained" color="primary">
              Save
            </Button>
            <Button onClick={handleCloseEditNameModal} variant="outlined">
              Cancel
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChangeBehaviour;
