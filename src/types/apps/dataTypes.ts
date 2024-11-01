export enum TriggerMainDataType {
  triggerValueIntimacy = 0,
  triggerValueKeyword = 1,
  triggerValueChatCount = 2,
  triggerValueTimeMinute = 3,
}

export enum TriggerTypeNames {
  Intimacy,
  Keyword,
  ChatCount,
  TimeMinute,
}

export enum TriggerSubDataType {
  actionEpisodeChangeId,
  ChangePrompt,
  actionIntimacyPoint,
}

export interface CoversationData {
  question: string;
  answer: string;
}

export interface ConversationTalkInfoList {
  id: number;
  conversationTpye: ConversationPriortyType;
  user: ConversationTalkInfo[];
  character: ConversationTalkInfo[];
}

export interface ConversationTalkInfo {
  /// <summary>
  // 행동, 말 Type
  /// </summary>
  type: ConversationTalkType;
  /// <summary>
  // 대화 행동
  /// </summary>
  talk: string;
}

export enum ConversationTalkType {
  Action,
  Speech,
}

export enum ConversationPriortyType {
  Mandatory,
  DependsOn,
}

export enum AiModelType {
  GPT4o,
  GPT4,
  GPT35,
  claude2,
  claude3opus,
  claude3sonnet,
  customApi,
}
export enum EmoticonType {
  Basic = 0,
  Recent = 1,
  Purchased = 2,
}
