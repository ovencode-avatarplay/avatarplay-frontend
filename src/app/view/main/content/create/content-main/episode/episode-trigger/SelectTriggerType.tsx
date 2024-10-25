// 파일 경로: components/SelectTriggerType.tsx

import React, {useState} from 'react';
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
import {TriggerMainDataType, TriggerSubDataType} from '@/types/apps/dataTypes'; // 타입들 임포트
import {addTriggerInfo} from '@/redux-store/slices/EpisodeInfo';
import {TriggerInfo} from '@/types/apps/content/episode/triggerInfo';
//import select from '@/@core/theme/overrides/select';

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
  const dispatch = useDispatch(); // Redux dispatch 사용

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as unknown as TriggerMainDataType;
    setSelectedTrigger(value); // 선택된 트리거 유형 업데이트
  };

  // 선택된 trigger에 따라 MainData를 생성하는 함수
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

  // SubDataB 기본값 생성 시 Conversation 타입에 맞춰서 수정
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
      actionChangePrompt: 'Default Prompt',
      actionConversationList: defaultConversationData, // Conversation 타입에 맞게 수정
    };
  };

  const triggerInfoList = useSelector((state: RootState) => state.episode.currentEpisodeInfo.triggerInfoList || []);
  // Save 버튼 클릭 시 처리 로직
  const handleSave = () => {
    const mainData = createMainData();
    const subData = createDefaultSubData();
    const isKeywordTypeExists = triggerInfoList.some(info => Number(info.triggerType) === 1);

    console.log('isKeywordTypeExists:', isKeywordTypeExists);

    console.log('isKeywordTypeExists:', isKeywordTypeExists);
    console.log('selectedTrigger:', selectedTrigger);
    console.log('Expected Trigger Value:', TriggerMainDataType.triggerValueKeyword);

    if (isKeywordTypeExists && Number(selectedTrigger) === 1) {
      alert('Keyword타입은 1개를 넘을 수 없습니다.');
      return; // handleClose를 취소함
    }
    // Redux에 데이터 저장
    dispatch(
      addTriggerInfo({
        triggerType: Number(selectedTrigger), // 트리거 유형
        name: triggerName, // 트리거 이름
        triggerValueIntimacy: 0, // 기본값 설정
        triggerValueChatCount: 0, // 기본값 설정
        triggerValueKeyword: '', // 기본값 설정
        triggerValueTimeMinute: 0, // 기본값 설정
        triggerActionType: TriggerSubDataType.ChangePrompt, // 기본 액션 타입
        actionChangeEpisodeId: 0, // 기본값 설정
        actionChangePrompt: 'Default Prompt', // 기본 프롬프트
        actionIntimacyPoint: 0, // 기본값 설정
        maxIntimacyCount: 0, // 기본값 설정
        actionConversationList: [
          {
            id: 0,
            conversationType: 1, // 필요한 기본값 설정
            user: 'User1', // 기본 사용자 설정
            character: 'Character1', // 기본 캐릭터 설정
          },
          {
            id: 0,
            conversationType: 2,
            user: 'User2',
            character: 'Character2',
          },
        ], // 기본 대화 리스트
      }),
    );

    onClose(); // 모달 닫기
  };

  return (
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
  );
};

export default SelectTriggerType;
