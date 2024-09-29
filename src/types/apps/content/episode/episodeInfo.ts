import { ImageData } from "./imageData";
import { episodeDescription } from "./episodeDescription";
import { conversationTemplate } from "./conversationTemplate";
import { llmSetupInfo } from "./llmSetupInfo";

export interface episodeInfo
{
    id : number;
    name : string;
    imageData : ImageData;
    episodeDescription : episodeDescription;
    // triggerInfo : triggerInfo;
    conversationTemplate : conversationTemplate;
    llmSetupInfo : llmSetupInfo;
}