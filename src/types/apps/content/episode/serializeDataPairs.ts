import { DataPair, TriggerMainDataType, TriggerSubDataType } from '@/types/apps/dataTypes';

// DataPair를 JSON 형식으로 변환하는 함수
const serializeDataPair = (dataPair: DataPair) => {
    return {
        id: dataPair.id,
        triggerType: dataPair.main.key,
        triggerValueIntimacy: dataPair.main.key === TriggerMainDataType.triggerValueIntimacy ? dataPair.main.value : 0,
        triggerValueChatCount: dataPair.main.key === TriggerMainDataType.triggerValueChatCount ? dataPair.main.value : 0,
        triggerValueKeyword: dataPair.main.key === TriggerMainDataType.triggerValueKeyword ? dataPair.main.value.join(', ') : '',
        triggerValueTimeMinute: dataPair.main.key === TriggerMainDataType.triggerValueTimeMinute ? dataPair.main.value : 0,
        triggerActionType: dataPair.sub.key,
        actionChangeEpisodeId: dataPair.sub.key === TriggerSubDataType.actionEpisodeChangeId ? dataPair.sub.value : 0,
        actionChangePrompt: dataPair.sub.key === TriggerSubDataType.ChangePrompt ? dataPair.sub.value : '',
        actionIntimacyPoint: dataPair.sub.key === TriggerSubDataType.actionIntimacyPoint ? dataPair.sub.value : 0,
        maxIntimacyCount: dataPair.sub.key === TriggerSubDataType.actionIntimacyPoint ? dataPair.sub.max_value : 0,
        actionCoversationList: dataPair.sub.key === TriggerSubDataType.ChangePrompt ? 
            dataPair.sub.coversationDataList.map(conversation => ({
                conversationType: 0, // 예시 값, 필요 시 조정
                user: JSON.stringify([{ Type: 0, Talk: conversation.question }]),
                character: JSON.stringify([{ Type: 1, Talk: conversation.answer }])
            })) : []
    };
};

// 여러 개의 DataPair를 변환하는 함수
const serializeDataPairs = (dataPairs: DataPair[]) => {
    return dataPairs.map(serializeDataPair);
};

export default serializeDataPairs;
