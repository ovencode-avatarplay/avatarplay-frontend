export interface stableDiffusionData
{
    generateType : number;
    loRAIndex : number;
    prompt : string;
    negativePrompt : string;
    seed : number;
    batchCount : number;
    generatedImage : string;
}