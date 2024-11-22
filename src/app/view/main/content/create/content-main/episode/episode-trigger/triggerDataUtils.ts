import {TriggerMainDataType, TriggerSubDataType} from '@/types/apps/DataTypes';

// SubData 옵션 반환 유틸리티 함수
export const getSubDataOptionsForMainData = (mainDataKey: TriggerMainDataType) => {
  switch (mainDataKey) {
    case TriggerMainDataType.triggerValueIntimacy:
      return [
        {key: TriggerSubDataType.actionEpisodeChangeId, label: 'Episode Change'},
        {key: TriggerSubDataType.ChangePrompt, label: 'Change Prompt'},
      ];
    case TriggerMainDataType.triggerValueChatCount:
    case TriggerMainDataType.triggerValueKeyword:
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
