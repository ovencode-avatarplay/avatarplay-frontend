import React, {useEffect, useRef, useState} from 'react';
import {TextareaAutosize} from '@mui/material';
import styles from './AI_Recommend.module.css';
import {recommendQuestion, RequestAiQuestionReq} from '@/app/NetWork/ChatNetwork';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {Variant1, Variant2, Variant3, Variant4, Variant5, Variant6} from '@ui/chatting';
import { setStreamKey } from '@/redux-store/slices/Chatting';

const LOADING_MESSAGE = '검색중...'; // 로딩 상태를 나타내는 상수

const loadingImages = [Variant1.src, Variant2.src, Variant3.src, Variant4.src, Variant5.src, Variant6.src];

interface AIRecommendProps {
  open: boolean;
  onClose: () => void;
  onSelectMessage: (message: string, isSend: boolean) => void;
  onHeightChange?: (height: number) => void; // height 변화를 감지하는 콜백
}

const AI_Recommend: React.FC<AIRecommendProps> = ({open, onClose, onSelectMessage, onHeightChange}) => {
  const [messages, setMessages] = useState<string[]>([LOADING_MESSAGE, LOADING_MESSAGE, LOADING_MESSAGE]);
  const [loadingIndex, setLoadingIndex] = useState(0);

  const episodeId = useSelector((state: RootState) => state.chatting.episodeId);
  const streamKey = useSelector((state: RootState) => state.chatting.streamKey);
  const containerRef = useRef<HTMLDivElement | null>(null); // 모달 컨테이너 Ref
  useEffect(() => {
    if (containerRef.current) {
      const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
          if (entry.contentRect) {
            onHeightChange?.(entry.contentRect.height);
          }
        }
      });

      observer.observe(containerRef.current);

      return () => observer.disconnect();
    }
  }, [onHeightChange]);

  useEffect(() => {
    if (open) {
      handleModalOpen();
    }
  }, [open]);

  useEffect(() => {
    // 로딩 이미지 애니메이션
    if (messages.includes(LOADING_MESSAGE)) {
      const interval = setInterval(() => {
        setLoadingIndex(prevIndex => (prevIndex + 1) % loadingImages.length);
      }, 200); // 500ms 간격으로 이미지 변경
      return () => clearInterval(interval); // 컴포넌트 unmount 시 정리
    }
  }, [messages]);

  const handleModalOpen = () => {
    setMessages([LOADING_MESSAGE, LOADING_MESSAGE, LOADING_MESSAGE]);
    reqRecommendQuestion();
  };

  const reqRecommendQuestion = async () => {
    const data: RequestAiQuestionReq = {
      episodeId: episodeId,
      streamKey: streamKey
    };

    try {
      const receive = await recommendQuestion(data);

      if (receive.resultCode === 0) {
        setMessages(receive.data?.questionList || []); // 서버에서 받은 데이터로 업데이트
      } else {
        alert('Error');
        onClose();
      }
    } catch (error) {
      alert('Error');
      onClose();
    }
  };

  const handleClickMessage = (message: string) => {
    onSelectMessage(message, true);
    onClose();
  };
  return (
    <div className={styles.modalContainer} ref={containerRef}>
      {messages.map((message, index) => (
        <div key={index} className={styles.messageContainer} onClick={() => handleClickMessage(message)}>
          {message === LOADING_MESSAGE ? (
            <div className={styles.loadingWrapper}>
              <img
                src={loadingImages[(loadingIndex + index * 2) % loadingImages.length]} // index * 3에서 시작
                alt="Loading"
                className={styles.loadingImage}
              />
            </div>
          ) : (
            <TextareaAutosize value={message} className={styles.messageText} maxRows={3} />
          )}
        </div>
      ))}
    </div>
  );
};

export default AI_Recommend;
