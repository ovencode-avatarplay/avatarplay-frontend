import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Box,
  DialogActions,
  Button,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import {TriggerMainDataType, TriggerSubDataType} from '@/types/apps/DataTypes'; // 타입들 임포트
import {addTriggerInfo} from '@/redux-store/slices/EpisodeInfo';
import {TriggerInfo, TriggerMediaState} from '@/types/apps/content/episode/TriggerInfo';
import ChangeBehaviour from './ChangeBehaviour';

interface SelectTriggerTypeProps {
  open: boolean;
  onClose: () => void;
  triggerName: string; // 전달된 name을 받을 prop
}

const triggerTypes = [
  {label: 'Intimacy', value: TriggerMainDataType.triggerValueIntimacy},
  {label: 'Keyword', value: TriggerMainDataType.triggerValueKeyword},
  {label: 'Chat Count', value: TriggerMainDataType.triggerValueChatCount},
  {label: 'Idle Elapsed Time', value: TriggerMainDataType.triggerValueTimeMinute},
];

const SelectTriggerType: React.FC<SelectTriggerTypeProps> = ({open, onClose, triggerName}) => {
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerMainDataType>(TriggerMainDataType.triggerValueIntimacy); // 초기 선택값
  const [openChangeBehaviour, setOpenChangeBehaviour] = useState(false); // ChangeBehaviour 모달 상태
  const [onAddTrigger, setOnAddTrigger] = useState(false); // ChangeBehaviour 모달 상태
  console.log('네임', triggerName);
  const dispatch = useDispatch(); // Redux dispatch 사용

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as unknown as TriggerMainDataType;
    setSelectedTrigger(value); // 선택된 트리거 유형 업데이트
  };

  const createMainData = (): Partial<TriggerInfo> => {
    switch (selectedTrigger) {
      case TriggerMainDataType.triggerValueIntimacy:
        return {triggerValueIntimacy: 0};
      case TriggerMainDataType.triggerValueKeyword:
        return {triggerValueKeyword: ''};
      case TriggerMainDataType.triggerValueChatCount:
        return {triggerValueChatCount: 0};
      case TriggerMainDataType.triggerValueTimeMinute:
        return {triggerValueTimeMinute: 0};
      default:
        return {triggerValueIntimacy: 0};
    }
  };

  const createDefaultSubData = (): Partial<TriggerInfo> => {
    const defaultConversationData = [
      {
        id: 0,
        conversationType: 2,
        user: 'User2',
        character: 'Character2',
      },
      {
        id: 1,
        conversationType: 2,
        user: 'User2',
        character: 'Character2',
      },
    ];

    return {
      triggerActionType: TriggerSubDataType.ChangePrompt,
      actionPromptScenarioDescription: '',
      actionConversationList: defaultConversationData,
    };
  };

  const triggerInfoList = useSelector((state: RootState) => state.episode.currentEpisodeInfo.triggerInfoList || []);
  useEffect(() => {
    if (onAddTrigger) {
      setOpenChangeBehaviour(true); // ChangeBehaviour 모달 열기
      setOnAddTrigger(false);
    }
  }, [triggerInfoList]);

  const handleSave = () => {
    const mainData = createMainData();
    const subData = createDefaultSubData();
    const isKeywordTypeExists = triggerInfoList.some(info => Number(info.triggerType) === 1);

    if (isKeywordTypeExists && Number(selectedTrigger) === 1) {
      alert('Keyword 타입은 1개를 넘을 수 없습니다.');
      return; // handleClose를 취소함
    }
    console.log('전', triggerInfoList.length);
    // Redux에 데이터 저장
    const action = dispatch(
      addTriggerInfo({
        episodeId: 0, // 기본값 추가
        triggerType: Number(selectedTrigger), // 트리거 유형
        name: triggerName, // 트리거 이름
        triggerValueIntimacy: 0, // 기본값 설정
        triggerValueChatCount: 0, // 기본값 설정
        triggerValueKeyword: '', // 기본값 설정
        triggerValueTimeMinute: 0, // 기본값 설정
        triggerActionType: TriggerSubDataType.ChangePrompt, // 기본 액션 타입
        actionChangeEpisodeId: 0, // 기본값 설정
        actionPromptScenarioDescription: '', // 기본값 설정
        actionIntimacyPoint: 0, // 기본값 설정
        actionCharacterInfo: {
          // CharacterInfo의 기본값 설정
          id: 0, // 기본값 설정
          name: '', // 기본값 설정
          introduction: '', // 기본값 설정
          genderType: 0, // 기본값 설정 (숫자형 타입, 예: 0 - 남성, 1 - 여성)
          mainImageUrl: '', // 기본값 설정
          portraitGalleryImageUrl: [], // 기본값 설정 (빈 배열)
          poseGalleryImageUrl: [], // 기본값 설정 (빈 배열)
          expressionGalleryImageUrl: [], // 기본값 설정 (빈 배열)
          visibilityType: 0, // 기본값 설정
          isMonetization: false, // 기본값 설정 (불린값)
          state: 0, // 기본값 설정
        }, // CharacterInfo의 기본값 설정
        actionMediaState: TriggerMediaState.None, // 기본값 설정 (TriggerMediaState의 기본값)
        actionMediaUrl: '', // 기본값 설정
        actionConversationList: [], // 기본값 설정 (빈 대화 리스트)
        maxIntimacyCount: 0, // 기본값 설정
      }),
    );
    setOnAddTrigger(true);
    onClose(); // 모달 닫기
  };

  return (
    <>
      <Dialog closeAfterTransition={false} open={open} onClose={onClose} disableAutoFocus disableEnforceFocus>
        <DialogTitle>Select Trigger Type</DialogTitle>
        <DialogContent>
          <Box sx={{mb: 2}}>
            <p>Trigger Name: {triggerName}</p>
          </Box>
          <RadioGroup value={selectedTrigger} onChange={handleChange}>
            {triggerTypes.map(trigger => (
              <Box key={trigger.value} display="flex" alignItems="center" justifyContent="space-between" sx={{mb: 2}}>
                <FormControlLabel value={trigger.value} control={<Radio />} label={trigger.label} />
                <IconButton edge="end" aria-label="info">
                  <InfoIcon />
                </IconButton>
              </Box>
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ChangeBehaviour 모달 추가 */}
      <ChangeBehaviour
        open={openChangeBehaviour}
        onClose={() => setOpenChangeBehaviour(false)}
        index={triggerInfoList.length - 1} // 필요한 index 값 전달
      />
    </>
  );
};

export default SelectTriggerType;
