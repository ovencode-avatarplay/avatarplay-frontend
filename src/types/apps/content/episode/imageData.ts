import { stableDiffusionData } from "./stableDiffusionData";

export interface ImageData
{
    imageType : number;
    imageUrl : string;
    stableDiffusionData : stableDiffusionData;
}