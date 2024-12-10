import {TriggerMainDataType, TriggerSubDataType} from '@/types/apps/DataTypes';

// SubData 옵션 반환 유틸리티 함수
export const getSubDataOptionsForMainData = (mainDataKey: TriggerMainDataType) => {
  switch (mainDataKey) {
    case TriggerMainDataType.triggerValueIntimacy:
      return [
        {key: TriggerSubDataType.EpisodeChange, label: 'Episode Change'},
        {key: TriggerSubDataType.ChangePrompt, label: 'Change Prompt'},
        {key: TriggerSubDataType.ChangeCharacter, label: 'Change Character'},
        {key: TriggerSubDataType.PlayMedia, label: 'Play Media'},
      ];
    case TriggerMainDataType.triggerValueChatCount:
    case TriggerMainDataType.triggerValueKeyword:
    case TriggerMainDataType.triggerValueTimeMinute:
      return [
        {key: TriggerSubDataType.EpisodeChange, label: 'Episode Change'},
        {key: TriggerSubDataType.ChangePrompt, label: 'Change Prompt'},
        {key: TriggerSubDataType.GetIntimacyPoint, label: 'Get Intimacy Point'},
        {key: TriggerSubDataType.ChangeCharacter, label: 'Change Character'},
        {key: TriggerSubDataType.PlayMedia, label: 'Play Media'},
      ];
    default:
      return [
        {key: TriggerSubDataType.ChangePrompt, label: 'Change Prompt'},
        {key: TriggerSubDataType.ChangeCharacter, label: 'Change Character'},
        {key: TriggerSubDataType.PlayMedia, label: 'Play Media'},
      ];
  }
};
