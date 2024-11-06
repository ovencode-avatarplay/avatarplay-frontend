import {stableDiffusionData} from './StableDiffusionData';

export interface ImageData {
  imageType: number;
  imageUrl: string;
  stableDiffusionData: stableDiffusionData;
}
