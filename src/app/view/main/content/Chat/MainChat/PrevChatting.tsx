import {useState, useEffect} from 'react';
import {
  EnterEpisodeChattingReq,
  UrlEnterEpisodeChattingReq,
  EnterEpisodeChattingRes,
  sendChattingEnter,
  sendChattingEnterUrl,
} from '@/app/NetWork/ChatNetwork';
import {QueryParams, getWebBrowserUrl} from '@/utils/browserInfo';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {setUrlLinkUse} from '@/redux-store/slices/ChattingEnter';
import {
  ChattingState,
  setContentId,
  setContentName,
  setEpisodeId,
  setEpisodeName,
  setStateChatting,
} from '@/redux-store/slices/Chatting';

const usePrevChatting = (
  episodeId: number,
  isCheat: boolean,
  setReRender: (data: boolean) => void,
  isIdEnter: boolean = false,
) => {
  // 이전 메시지 및 에러 상태값 정의s
  const [prevMessages, setPrevMessages] = useState<EnterEpisodeChattingRes>();
  console.log('isIdEnter', isIdEnter);
  const [error, setError] = useState<string | null>(null);

  const isUsedUrlLink = useSelector((state: RootState) => state.chattingEnter.isUsedUrlLink);
  const dispatch = useDispatch();

  // 데이터를 가져오는 비동기 함수
  const fetchChattingData = async () => {
    try {
      console.log('isUsedUrlLink', isUsedUrlLink);

      if (isUsedUrlLink && !isIdEnter) {
        const QueryKey = QueryParams.ChattingInfo;
        const key = getWebBrowserUrl(QueryKey) || null;

        const ReqDataUrl: UrlEnterEpisodeChattingReq = {
          urlLinkKey: key !== null ? key : '',
        };
        // 서버로부터 이전 채팅 데이터를 가져옴
        //const response = await sendChattingEnter(ReqData);
        const response = await sendChattingEnterUrl(ReqDataUrl);
        setReRender(true);
        if (response.resultCode === 0 && response.data) {
          // 가져온 데이터를 상태에 저장
          setPrevMessages(response.data);
          dispatch(setContentName(response.data.contentName));
          dispatch(setEpisodeName(response.data.episodeName));
          dispatch(setContentId(response.data.contentId));
          dispatch(setEpisodeId(response.data.episodeId));

          console.log('response.data.contentId1', response.data.contentId);
        } else {
          setError('Failed to fetch previous messages.');
        }
      } else {
        const ReqData: EnterEpisodeChattingReq = {
          episodeId: episodeId,
        };
        // 서버로부터 이전 채팅 데이터를 가져옴
        dispatch(setUrlLinkUse(true)); // 상태 초기화
        const response = await sendChattingEnter(ReqData);
        setReRender(true);
        if (response.resultCode === 0 && response.data) {
          // 가져온 데이터를 상태에 저장
          setPrevMessages(response.data);

          dispatch(setContentName(response.data.contentName));
          dispatch(setEpisodeName(response.data.episodeName));
          dispatch(setContentId(response.data.contentId));
          //dispatch(setEpisodeId(response.data.episodeId));

          console.log('response.data.contentId2', response.data.contentId);
        } else {
          setError('Failed to fetch previous messages.');
        }
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

  // 이전 메시지와 에러를 반환
  return {prevMessages};
};
export default usePrevChatting;
