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
import {RenderTargetValueField, RenderSubDataFields} from './RenderFields';
import {handleMainDataChange, handleSubDataChange, ensureValidSubData} from './triggerHandlers';
import {getSubDataOptionsForMainData} from './triggerDataUtils';

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
    actionChangeEpisodeId: item?.actionChangeEpisodeId ?? -1,
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
        actionChangeEpisodeId: item.actionChangeEpisodeId ?? -1,
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
      if (triggerInfo.actionChangeEpisodeId === -1) {
        setSelectedChapter('None');
        setSelectedEpisode('None');
        return;
      }
      const matchingChapter = content.chapterInfoList.find(chapter =>
        chapter.episodeInfoList.some(episode => episode.id === triggerInfo.actionChangeEpisodeId),
      );

      let matchingEpisode = content.chapterInfoList
        .flatMap(chapter => chapter.episodeInfoList)
        .find(episode => episode.id === triggerInfo.actionChangeEpisodeId);

      // matchingChapter와 matchingEpisode가 undefined인 경우 인덱스를 기반으로 검사
      if (!matchingChapter || !matchingEpisode) {
        const fallbackChapter = content.chapterInfoList.find(
          chapter => chapter.episodeInfoList[triggerInfo.actionChangeEpisodeId] !== undefined,
        );

        const fallbackEpisode = fallbackChapter?.episodeInfoList[triggerInfo.actionChangeEpisodeId];

        if (fallbackChapter) {
          setSelectedChapter(fallbackChapter.name || 'None');
        } else {
          setSelectedChapter('None');
        }

        if (fallbackEpisode) {
          matchingEpisode = fallbackEpisode;
          setSelectedEpisode(fallbackEpisode.name || 'None');
        } else {
          setSelectedEpisode('None');
        }
      } else {
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
      }
    }
  }, [item, content.chapterInfoList, open]);

  const [selectedChapter, setSelectedChapter] = useState<string>('None');
  const [selectedEpisode, setSelectedEpisode] = useState<string>('None');
  const [isEpisodeConversationTemplateOpen, setEpisodeConversationTemplateOpen] = useState(false);
  const [isChapterBoardOpen, setIsChapterBoardOpen] = useState(false);
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
  const [newTriggerName, setNewTriggerName] = useState(item?.name);

  const contentInfo = useSelector((state: RootState) => state.content.curEditingContentInfo);
  const selectedContentId = useSelector((state: RootState) => state.contentselection.selectedContentId);
  const triggerInfoList = useSelector((state: RootState) => state.episode.currentEpisodeInfo.triggerInfoList || []);

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

  const handleOpenEpisodeConversationTemplate = () => {
    setEpisodeConversationTemplateOpen(true);
  };

  const handleCloseEpisodeConversationTemplate = () => {
    setEpisodeConversationTemplateOpen(false);
  };

  useEffect(() => {
    ensureValidSubData(triggerInfo, setTriggerInfo);
  }, [triggerInfo.triggerType]);

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
                  onChange={(event, child) => handleMainDataChange(event, child, triggerInfo, setTriggerInfo)}
                  variant="outlined"
                >
                  <MenuItem value={TriggerMainDataType.triggerValueIntimacy}>Intimacy</MenuItem>
                  <MenuItem value={TriggerMainDataType.triggerValueKeyword}>Keyword</MenuItem>
                  <MenuItem value={TriggerMainDataType.triggerValueChatCount}>Chat Count</MenuItem>
                  <MenuItem value={TriggerMainDataType.triggerValueTimeMinute}>Time (Minutes)</MenuItem>
                </Select>
              </div>
            </Box>

            <Box className={styles.targetValueSection}>
              <RenderTargetValueField triggerInfo={triggerInfo} setTriggerInfo={setTriggerInfo} />
            </Box>
          </Box>

          <Box className={styles.subValueContainer}>
            <Box className={styles.targetValueSection}>
              <Typography className={styles.label}>Sub Data</Typography>
              <Box className={styles.episodeChangeRow}>
                <Box className={styles.icon} />
                <Select
                  className={styles.selectBox}
                  value={triggerInfo.triggerActionType}
                  onChange={event => handleSubDataChange({target: {value: Number(event.target.value)}}, setTriggerInfo)}
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
              <RenderSubDataFields
                triggerInfo={triggerInfo}
                setTriggerInfo={setTriggerInfo}
                selectedChapter={selectedChapter}
                selectedEpisode={selectedEpisode}
                handleOpenChapterBoard={handleOpenChapterBoard}
                handleOpenEpisodeConversationTemplate={handleOpenEpisodeConversationTemplate}
              />
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
