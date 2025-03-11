import React, {useEffect, useRef, useState} from 'react';
import Drawer from '@mui/material/Drawer';
import styles from './ReelsCommentEdit.module.css';
import {BoldSend} from '@ui/Icons';
import {InputAdornment, TextField} from '@mui/material';
import {sendUpdateComment} from '@/app/NetWork/CommonNetwork';

interface Props {
  commentId: number;
  isOpen: boolean;
  prevChat: string;
  toggleDrawer: (open: boolean) => void;
  onComplete: () => void;
}

const ReelsCommentEdit: React.FC<Props> = ({onComplete, prevChat, isOpen, toggleDrawer, commentId}) => {
  const [chat, setChat] = useState<string>(prevChat);
  const inputRef = useRef<HTMLInputElement>(null); // TextField의 input 참조 생성

  const handleInputChange = (value: string) => {
    setChat(value);
  };

  const handleSendUpdateComment = async () => {
    const payload = {
      commentId: commentId,
      content: chat,
    };

    try {
      const response = await sendUpdateComment(payload);
      console.log('댓글 추가 성공:', response.data);
      onComplete();
      toggleDrawer(false);
    } catch (error) {
      console.error('댓글 추가 실패:', error);
    }
  };

  const handleKeyDownInternal = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // 기본 동작 방지 (텍스트 줄바꿈)
      handleSendUpdateComment();
    }
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // iOS 등 모바일 환경에서 키보드가 확실히 나타나도록 보장
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300); // 약간의 지연으로 키보드 활성화
    }
  }, [isOpen]);

  return (
    <Drawer anchor="bottom" open={isOpen} onClose={() => toggleDrawer(false)} classes={{paper: styles.drawer}}>
      {/* Input Section */}
      <div className={styles.inputSection}>
        <div className={styles.inputWrapper}>
          <TextField
            placeholder="Type your message..."
            inputRef={inputRef} // TextField의 input 참조 연결
            value={chat}
            onChange={e => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDownInternal}
            multiline
            maxRows={5}
            className={styles.input}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: 'none', // 아웃라인 제거
                },
                fontSize: '14px', // 폰트 크기 설정
                paddingLeft: '0px',
                paddingRight: '0px',
                paddingTop: '1px',
                paddingBottom: '1px',
                color: 'black', // 텍스트 색상 설정
                minHeight: '28px',
                alignContent: 'center',
              },
              '& .MuiInputBase-input': {
                fontSize: '14px', // 내부 입력 텍스트의 폰트 크기 설정
                color: 'black', // 텍스트 색상 설정
                minHeight: '28px',
                alignContent: 'center',
              },
            }}
            style={{padding: '0px'}}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {chat?.length > 0 && (
                    <div
                      className={styles.circleBlack}
                      style={{
                        backgroundColor: chat !== prevChat ? '#040415' : '#5f6368', // 조건부 배경색
                        cursor: chat !== prevChat ? 'pointer' : 'default', // 클릭 가능 여부 표현
                      }}
                      onClick={() => {
                        if (chat !== prevChat) {
                          handleSendUpdateComment();
                        }
                      }}
                    >
                      <img src={BoldSend.src} alt="Send" />
                    </div>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default ReelsCommentEdit;
