const CheatMessageType: string[] = [
  '⦿USER_STAT⦿',
  '⦿TRIGGER_STAT⦿',
  '⦿EPISODE_INIT⦿',
  '⦿YEAR⦿',
  '⦿MONTH⦿',
  '⦿DAY⦿',
  '⦿REFRESH_NEW_DAY⦿',
];

export interface CheatResult {
  text: string; // 메시지 내용
  reqEnter: boolean; // 채팅창 Enter 요청을 다시할지 여부
}

export default CheatMessageType;
