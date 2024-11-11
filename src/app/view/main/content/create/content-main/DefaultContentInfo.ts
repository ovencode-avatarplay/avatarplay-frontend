export const defaultContentInfo = {
  id: 0,
  userId: 0,
  urlLinkKey: '',
  chapterInfoList: [],
  publishInfo: {
    languageType: 0,
    contentName: '',
    thumbnail: '',
    contentDescription: '',
    authorName: '',
    authorComment: '',
    tagList: [],
    selectTagList: [],
    visibilityType: 0,
    monetization: false,
    nsfw: 0,
  },
};

export const defaultChapterInfo = {
  id: 0,
  name: '',
  episodeInfoList: [],
};

export const defaultEpisodeInfo = {
  id: 0,
  name: '',
  thumbnail: '',
  episodeDescription: {
    characterName: '',
    characterDescription: '',
    scenarioDescription: '',
    introDescription: '',
    secret: '',
  },
  triggerInfoList: [],
  conversationTemplateList: [],
  llmSetupInfo: {
    llmModel: 0,
    customApi: '',
  },
};

export const defaultTriggerInfo = {
  id: 0,
  name: '',
  triggerType: 0,
  triggerValueIntimacy: 0,
  triggerValueChatCount: 0,
  triggerValueKeyword: '',
  triggerValueTimeMinute: 0,
  triggerActionType: 0,
  actionChangeEpisodeId: 0,
  actionChangePrompt: '',
  actionIntimacyPoint: 0,
  actionChangeBackground: '',
  maxIntimacyCount: 0,
  actionConversationList: [],
};

export const defaultConversation = {
  id: 0,
  conversationType: 0,
  user: '',
  character: '',
};

export const defaultLLMSetupInfo = {
  llmModel: 0,
  customApi: '',
};
