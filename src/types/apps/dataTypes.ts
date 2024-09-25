// MainDataA 타입 정의
export interface MainDataA {
    id: 'A';
    name: string;
    // 추가 필드들
}

// MainDataB 타입 정의
export interface MainDataB {
    id: 'B';
    description: string;
    // 추가 필드들
}

// MainDataV 타입 정의
export interface MainDataV {
    id: 'V';
    value: number;
    // 추가 필드들
}

// MainDataD 타입 정의
export interface MainDataD {
    id: 'D';
    date: Date;
    // 추가 필드들
}

// SainData1 타입 정의
export interface SainData1 {
    type: 1;
    info: string;
    // 추가 필드들
}

// SainData2 타입 정의
export interface SainData2 {
    type: 2;
    details: string;
    desc:string;
    // 추가 필드들
}

// SainData3 타입 정의
export interface SainData3 {
    type: 3;
    meta: string;
    // 추가 필드들
}

// MainData와 SainData의 유니온 타입
export type MainData = MainDataA | MainDataB | MainDataV | MainDataD;
export type SainData = SainData1 | SainData2 | SainData3;

// 메인 데이터와 서브 데이터의 페어 타입 정의
export interface DataPair {
    main: MainData;
    sub: SainData;
}
