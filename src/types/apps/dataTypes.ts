export interface MainDataA {
    key: 'triggerValueIntimacy';
    value: number;
}
export interface MainDataB {
    key: 'triggerValueKeyword';
    value: string[];
}

export interface MainDataC {
    key: 'triggerValueChatCount';
    value: number;
}

export interface MainDataD {
    key: 'triggerValueTimeMinute';
    value: number;
}

export interface SubDataA {
    key: 'actionEpisodeChangeId';
    value: number;
}


export interface SubDataB {
    key: 'ChangePrompt';
    value: string;
    coversationDataList:CoversationData[];
}

export interface CoversationData
{
    question: string;
    answer: string;
}

export interface SubDataC {
    key: 'actionIntimacyPoint';
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
