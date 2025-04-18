import {MediaData, Message, MessageGroup, SenderType} from './ChatTypes';
import {timeParser} from './MessageParser';

/**
 * 두 개의 Date 객체를 비교하여 조건에 따라 문자열을 반환하는 함수
 * @param date1 - 첫 번째 날짜 (Date 객체)
 * @param date2 - 두 번째 날짜 (Date 객체)
 * @returns 조건에 맞는 문자열. 날이 같으면 빈 문자열.
 */

export enum NewDateType {
  DAY = 0,
  MONTH,
  YEAR,
}

export function compareDates(beforeDate: Date | null, currentDate: Date): string {
  const d1: Date | null = beforeDate ? new Date(beforeDate) : null;
  const d2 = new Date(currentDate);

  // 기준 날짜(d2) 연도, 월, 날짜 추출
  const [year1, month1] = [d1?.getFullYear(), d1?.getMonth()];
  const [year2, month2, day2] = [d2.getFullYear(), d2.getMonth(), d2.getDate()];

  // 시간 제거 (날짜 단위 비교를 위해)
  if (d1) d1.setHours(0, 0, 0, 0);
  if (d2) d2.setHours(0, 0, 0, 0);

  if (d1 === undefined || d1 === null) {
    return `${year2} ${d2.toLocaleString('en-US', {month: 'short'})} ${day2}`;
  }

  // 날짜 차이 계산
  const timeDifference = Math.abs(d1.getTime() - d2.getTime());
  const dayDifference = timeDifference / (1000 * 60 * 60 * 24);

  // 동일한 날인 경우
  if (dayDifference === 0) {
    return '';
  }

  // 조건에 따라 기준 날짜(d2) 기반으로 결과 반환
  if (year1 !== year2) {
    // 연도가 다른 경우: "YYYY Mon DD" (기준 날짜 사용)
    return `${year2} ${d2.toLocaleString('en-US', {month: 'short'})} ${day2}`;
  } else if (month1 !== month2) {
    // 월이 다른 경우: "Mon DD" (기준 날짜 사용)
    return `${d2.toLocaleString('en-US', {month: 'short'})} ${day2}`;
  }

  // 하루 이상 차이지만 같은 월인 경우: "Mon DD" (기준 날짜 사용)
  return `${d2.toLocaleString('en-US', {month: 'short'})} ${day2}`;
}

/**
 * 날짜 배열의 모든 날짜를 하루, 한달, 일년씩 과거시간으로 바꿔주는 함수 ( 치트키로 사용 )
 * @param dates - Date 객체 배열
 * @returns 하루 이전으로 변경된 Date 객체 배열
 */
export function shiftDates(newDateType: NewDateType, messageGroup: MessageGroup): MessageGroup {
  let shiftedMessageGroup: MessageGroup = {
    ...messageGroup, // 기존 속성을 복사
    Messages: [], // Messages만 초기화
  };

  for (let i = 0; i < messageGroup.Messages.length; i++) {
    const currentMessage = messageGroup.Messages[i];

    // createDate를 문자열로 변환한 뒤 'Z'가 있는지 확인
    const createDateString = currentMessage.createDateLocale?.toString();

    let createDate: Date | null = null;
    if (createDateString !== undefined) {
      if (currentMessage.createDateLocale) createDate = new Date(currentMessage.createDateLocale);

      if (createDate !== null) {
        switch (newDateType) {
          case NewDateType.DAY: // 하루 빼기
            createDate.setDate(createDate.getDate() - 1);
            break;
          case NewDateType.MONTH: // 한달 빼기
            createDate.setMonth(createDate.getMonth() - 1);
            break;
          case NewDateType.YEAR: // 일년 빼기
            createDate.setFullYear(createDate.getFullYear() - 1);
            break;
        }
      }

      shiftedMessageGroup.Messages.push({
        ...currentMessage,
        createDateLocale: createDate ? new Date(createDate) : null, // 수정된 날짜를 새로운 Date 객체로 설정
      });
    } else {
      shiftedMessageGroup.Messages.push({
        ...currentMessage,
      });
    }
  }

  return shiftedMessageGroup;
}

export function refreshNewDateAll(messageGroup: MessageGroup): MessageGroup {
  let shiftedMessageGroup: MessageGroup = {
    ...messageGroup, // 기존 속성을 복사
  };

  for (let i = 0; i < shiftedMessageGroup.Messages.length; i++) {
    if (shiftedMessageGroup.Messages[i].sender === SenderType.NewDate) {
      const newDate = shiftedMessageGroup.Messages[i].createDateLocale;
      if (newDate !== null) {
        const dateBefore = shiftedMessageGroup.Messages[i - 1]?.createDateLocale;
        const dateCurrent = shiftedMessageGroup.Messages[i]?.createDateLocale;
        if (dateBefore !== null && dateCurrent !== null) {
          const strNewDate = compareDates(dateBefore, dateCurrent);
          shiftedMessageGroup.Messages[i].text = strNewDate;
        }
      }
    }
  }
  return shiftedMessageGroup;
}

// 날짜 정보를 넣어주는 함수
export function addNewDateMessage(
  allMessages: Message[],
  allEmoticon: string[],
  allMedia: MediaData[],
  strNewDate: string,
  dateCurrent: Date,
  mediaDataValue: MediaData,
): void {
  const newDateMessage: Message = {
    chatId: 0,
    text: strNewDate,
    sender: SenderType.NewDate,
    createDateString: '',
    createDateLocale: dateCurrent,
    isLike: false, // 말풍선 like
    bubbleIndex: 0,
  };
  allMessages.push(newDateMessage);
  allEmoticon.push('');
  allMedia.push(mediaDataValue);
}
