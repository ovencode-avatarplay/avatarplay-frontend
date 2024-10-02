import { string } from 'valibot';

export enum TriggerMainDataType{
			
    triggerValueIntimacy,		
    triggerValueKeyword,
    triggerValueChatCount,
    triggerValueTimeMinute,
    actionEpisodeChangeId,
}    

export interface MainDataA {
    key: TriggerMainDataType.triggerValueIntimacy;
    value: number;
}
export interface MainDataB {
    key: TriggerMainDataType.triggerValueKeyword;
    value: string[];
}

export interface MainDataC {
    key: TriggerMainDataType.triggerValueChatCount;
    value: number;
}

export interface MainDataD {
    key: TriggerMainDataType.triggerValueTimeMinute;
    value: number;
}

export enum TriggerSubDataType{
			
    actionEpisodeChangeId,
    ChangePrompt,
    actionIntimacyPoint,
}    

export interface SubDataA {
    key: TriggerSubDataType.actionEpisodeChangeId;
    value: number;
}


export interface SubDataB {
    key: TriggerSubDataType.ChangePrompt;
    value: string;
    coversationDataList:CoversationData[];
}

export interface CoversationData
{
    question: string;
    answer: string;
}

export interface SubDataC {
    key: TriggerSubDataType.actionIntimacyPoint;
    value: number;
    max_value: number;
}




export type MainData = MainDataA | MainDataB | MainDataC | MainDataD;
export type SubData = SubDataA | SubDataB | SubDataC;

export interface DataPair {
    id: number;
    name:string
    main: MainData;
    sub: SubData;
}



export interface ConversationTalkInfo {
	
		/// <summary>
		// 행동, 말 Type
		/// </summary>
		type: ConversationTalkType;
		/// <summary>
		// 대화 행동
		/// </summary>
		talk:string;
}
	
export enum ConversationTalkType{
			
		Action,		
		Speech,
}    

