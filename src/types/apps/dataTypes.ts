

export enum TriggerMainDataType{
			
    triggerValueIntimacy,		
    triggerValueKeyword,
    triggerValueChatCount,
    triggerValueTimeMinute,
    actionEpisodeChangeId,
}    

export enum TriggerSubDataType{
			
    actionEpisodeChangeId,
    ChangePrompt,
    actionIntimacyPoint,
}    

export interface CoversationData
{
    question: string;
    answer: string;
}


// export interface ConversationTalkInfoList 
// {
//     id: number;
//     conversationTpye: ConversationPriortyType;
//     user: ConversationTalkInfo[];
//     character: ConversationTalkInfo[];
// }

// export interface ConversationTalkInfo {
	       
// 		/// <summary>
// 		// 행동, 말 Type
// 		/// </summary>
// 		type: ConversationTalkType;
// 		/// <summary>
// 		// 대화 행동
// 		/// </summary>
// 		talk:string;
// }
	
export enum ConversationTalkType{
			
		Action,		
		Speech,
}    

export enum ConversationPriortyType{
			
    Mandatory,		
    DependsOn,
}    

