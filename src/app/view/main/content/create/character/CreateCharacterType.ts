export interface CreateCharacter {
  basePortraitUrl: string;
  characterName: string;
  characterIntroduction: string;
  visibilityType: number;
  MonetizationType: boolean;
}

export interface CreateCharacterOption {
  label: string;
  image: string;
  value: number;
}

export interface GeneratedOptionsState {
  url: string;
}
