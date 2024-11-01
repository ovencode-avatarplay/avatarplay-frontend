import {useState, useEffect} from 'react';
import {
  EnterEpisodeChattingReq,
  EnterEpisodeChattingRes,
  MessageInfo,
  sendChattingEnter,
} from '@/app/NetWork/ChatNetwork';
const usePrevChatting = (userId: number, episodeId: number) => {
  // 이전 메시지 및 에러 상태값 정의
  const [prevMessages, setPrevMessages] = useState<EnterEpisodeChattingRes>();

  const [error, setError] = useState<string | null>(null);

  // API 요청 데이터 정의
  const ReqData: EnterEpisodeChattingReq = {
    userId: userId,
    episodeId: episodeId,
  };

  // 데이터를 가져오는 비동기 함수
  const fetchChattingData = async () => {
    try {
      // 서버로부터 이전 채팅 데이터를 가져옴
      const response = await sendChattingEnter(ReqData);
      if (response.resultCode === 0 && response.data) {
        // 가져온 데이터를 상태에 저장
        setPrevMessages(response.data);
      } else {
        setError('Failed to fetch previous messages.');
      }
    } catch (err) {
      console.error('Error fetching Chatting Enter:', err);
      setError('Error occurred while fetching data.');
    }
  };

  // 컴포넌트가 마운트될 때와 userId 또는 episodeId가 변경될 때마다 API 호출
  useEffect(() => {
    fetchChattingData();
  }, [userId, episodeId]);

  // 이전 메시지와 에러를 반환
  return {prevMessages, error};
};

export default usePrevChatting;
