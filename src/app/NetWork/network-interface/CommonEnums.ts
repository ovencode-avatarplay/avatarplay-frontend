export enum LanguageType {
  Korean = 0,
  English = 1,
  Japanese = 2,
  French = 3,
  Spanish = 4,
  ChineseSimplified = 5,
  ChineseTraditional = 6,
  Portuguese = 7,
  German = 8,
}

export enum FlagNation {
  'KR' = 0,
  'US' = 1,
  'JP' = 2,
  'FR' = 3,
  'ES' = 4,
  'CN' = 5,
  'TW' = 6,
  'PT' = 7,
  'DE' = 8,
}

// 국가타입을 받아서 해당 국가코드를 리턴해준다.
export const getFlagCode = (value: LanguageType): string | undefined => {
  return FlagNation[value] as string | undefined;
};

export enum LLMModel {
  GPT_4o = 0,
  GPT_4 = 1,
  GPT_3_5 = 2,
  Claude_V2 = 3,
  Claude_3_Opus = 4,
  Claude_3_Sonnet = 5,
  Claude_3_5_Sonnet = 6,
  Claude_3_5_Sonnet_V2 = 7,
  Claude_3_Haiku = 8,
}

export enum VisibilityType {
  Private = 0,
  Unlisted = 1,
  Public = 2,
  Create = 3,
}

export enum Subscription {
  IP,
  Contents,
}

export enum PaymentType {
  USA,
  Korea,
}

export interface MembershipSetting {
  subscription: Subscription;
  paymentType: PaymentType;
  paymentAmount: number;
  benefits: string;
}
