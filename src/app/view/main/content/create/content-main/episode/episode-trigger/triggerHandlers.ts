import {TriggerInfo} from '@/types/apps/content/episode/TriggerInfo';
import {getSubDataOptionsForMainData} from './triggerDataUtils';
import {TriggerMainDataType, TriggerSubDataType} from '@/types/apps/DataTypes';
import {SelectChangeEvent} from '@mui/material';

export const handleMainDataChange = (
  event: SelectChangeEvent<number>,
  child: React.ReactNode,
  triggerInfo: TriggerInfo,
  setTriggerInfo: React.Dispatch<React.SetStateAction<TriggerInfo>>,
) => {
  const selectedTriggerType = event.target.value as number;

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
        characterName: '',
        characterDescription: '',
        scenarioDescription: '',
        introDescription: '',
        secret: '',
      },
      actionIntimacyPoint: 0,
      actionConversationList: [],
    }));
  }
};

export const handleSubDataChange = (
  event: {target: {value: number}},
  setTriggerInfo: React.Dispatch<React.SetStateAction<TriggerInfo>>,
) => {
  const selectedSubType = event.target.value as TriggerSubDataType;

  setTriggerInfo(prev => ({
    ...prev,
    triggerActionType: selectedSubType,
  }));
};

export const ensureValidSubData = (
  triggerInfo: TriggerInfo,
  setTriggerInfo: React.Dispatch<React.SetStateAction<TriggerInfo>>,
) => {
  const subDataOptions = getSubDataOptionsForMainData(triggerInfo.triggerType);

  if (subDataOptions.length > 0 && !subDataOptions.some(option => option.key === triggerInfo.triggerActionType)) {
    setTriggerInfo(prev => ({
      ...prev,
      triggerActionType: subDataOptions[0].key,
    }));
  }
};
