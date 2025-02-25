import {useState, useEffect} from 'react';
import {UrlEnterEpisodeChattingReq, EnterEpisodeChattingRes, sendChattingEnterUrl} from '@/app/NetWork/ChatNetwork';
import {QueryParams, getWebBrowserUrl} from '@/utils/browserInfo';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {setStoryId, setStoryName, setEpisodeId, setEpisodeName, setStreamKey} from '@/redux-store/slices/Chatting';
import {setRegeneratingQuestion} from '@/redux-store/slices/ModifyQuestion';
import {setUrlLinkUse} from '@/redux-store/slices/ChattingEnter';
import {getCurrentLanguage} from '@/utils/UrlMove';

const usePrevChatting = (
  episodeId: number,
  isCheat: boolean,
  setReRender: (data: boolean) => void,
  isIdEnter: boolean = false,
) => {
  // 이전 메시지 및 에러 상태값 정의s
  const [prevMessages, setPrevMessages] = useState<EnterEpisodeChattingRes>();
  useEffect(() => {
    console.log('isIdEnter', isIdEnter);
  }, [prevMessages]);

  const [error, setError] = useState<string | null>(null);

  const isUsedUrlLink = useSelector((state: RootState) => state.chattingEnter.isUsedUrlLink);
  const dispatch = useDispatch();

  // 데이터를 가져오는 비동기 함수
  const fetchChattingData = async () => {
    try {
      console.log('isUsedUrlLink', isUsedUrlLink);
      const key = getWebBrowserUrl(QueryParams.ChattingInfo) || null;

      const ReqDataUrl: UrlEnterEpisodeChattingReq = {
        urlLinkKey: key !== null ? key : '',
        episodeId: episodeId,
        language: getCurrentLanguage(),
        isUrlEnter: isUsedUrlLink,
      };
      // 서버로부터 이전 채팅 데이터를 가져옴
      //const response = await sendChattingEnter(ReqData);
      const response = await sendChattingEnterUrl(ReqDataUrl);
      setReRender(true);
      if (response.resultCode === 0 && response.data) {
        // 가져온 데이터를 상태에 저장
        setPrevMessages(response.data);
        dispatch(setStoryName(response.data.storyName));
        dispatch(setEpisodeName(response.data.episodeName));
        dispatch(setStoryId(response.data.storyId));
        dispatch(setEpisodeId(response.data.episodeId));
        dispatch(setStreamKey(response.data.streamKey));
      } else {
        setError('Failed to fetch previous messages.');
      }
      dispatch(setUrlLinkUse(true)); // 초기화가 true다!!
      const tmp = response.data?.prevMessageInfoList[response.data?.prevMessageInfoList.length - 1];

      if (tmp !== undefined && tmp.message) {
        // JSON 문자열을 객체로 파싱
        const jsonMessage = JSON.parse(tmp.message);

        // Question 필드를 추출하여 디스패치
        dispatch(
          setRegeneratingQuestion({
            lastMessageId: tmp.id ?? -333,
            lastMessageQuestion: jsonMessage.Question ?? '',
          }),
        );
      }
    } catch (err) {
      console.error('Error fetching Chatting Enter:', err);
      setError('Error occurred while fetching data.');
    }
  };

  if (isCheat === true) fetchChattingData(); //setCheatEnter(!isCheatEnter); // useEffect에서 Enter를 요청하도록 해준다.

  // 컴포넌트가 마운트될 때와 userId 또는 episodeId가 변경될 때마다 API 호출
  useEffect(() => {
    fetchChattingData();
  }, [episodeId]);

  console.log(prevMessages);
  // 이전 메시지와 에러를 반환
  return {prevMessages};
};
export default usePrevChatting;
