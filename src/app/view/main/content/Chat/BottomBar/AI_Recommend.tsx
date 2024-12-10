import React, {useEffect, useState, useRef} from 'react';
import {TextareaAutosize} from '@mui/material';
import styles from './AI_Recommend.module.css';
import {recommendQuestion, RequestAiQuestionReq} from '@/app/NetWork/ChatNetwork';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';

interface AIRecommendProps {
  open: boolean;
  onClose: () => void;
  onSelectMessage: (message: string, isSend: boolean) => void;
}

const AI_Recommend: React.FC<AIRecommendProps> = ({open, onClose, onSelectMessage}) => {
  const [messages, setMessages] = useState<string[]>(['검색중...', '검색중...', '검색중...']); // 내부 상태로 관리

  const episodeId = useSelector((state: RootState) => state.chatting.episodeId);

  useEffect(() => {
    // 모달이 열릴 때만 실행되도록 설정
    if (open) {
      handleModalOpen(); // 모달 열릴 때만 실행
    }
  }, [open]); // open 값이 변경될 때마다 실행됨

  const handleModalOpen = () => {
    console.log('Modal is opened!'); // 모달 열릴 때만 실행할 작업
    // 서버에서 추천 메시지 요청
    setMessages(['검색중...', '검색중...', '검색중...']);
    reqRecommendQuestion();
  };

  const reqRecommendQuestion = async () => {
    // 예시로 서버에서 메시지를 요청한다고 가정
    const data: RequestAiQuestionReq = {
      episodeId: episodeId, // store에서 가져온 값 세팅
    };
    const receive = await recommendQuestion(data);

    setMessages(receive.data?.questionList || []); // 서버에서 받은 데이터를 설정
  };

  const handleClickMessage = (message: string) => {
    onSelectMessage(message, true); // 편집할 메시지 선택
    onClose(); // 모달 닫기
  };

  return (
    <div className={styles.modalContainer}>
      {messages.map((message, index) => (
        <TextareaAutosize
          value={message}
          disabled
          className={styles.messageText}
          maxRows={3} // 최대 줄 수 제한
          onClick={() => handleClickMessage(message)}
        />
      ))}
    </div>
  );
};

export default AI_Recommend;
