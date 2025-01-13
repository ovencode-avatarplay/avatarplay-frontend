import React, {useState} from 'react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import styles from './ReelsComment.module.css';
import ReelsCommentItem from './ReelsCommentItem';
import {BoldSend, LeftArrow} from '@ui/Icons';
import {InputAdornment, TextField} from '@mui/material';
import {AddCommentRequest, sendAddComment} from '@/app/NetWork/ShortsNetwork';

interface ReelsCommentProps {
  feedId: number;
  isOpen: boolean;
  toggleDrawer: (open: boolean) => void;
}

const ReelsComment: React.FC<ReelsCommentProps> = ({isOpen, toggleDrawer, feedId}) => {
  const [chat, setChat] = useState<string>('');
  const handleInputChange = (value: string) => {
    setChat(value);
  };
  const handleSendAddComment = async (feedId: number, parentCommentId: number, content: string) => {
    try {
      // AddCommentRequest 객체 생성
      const request: AddCommentRequest = {
        feedId,
        parentCommentId,
        content,
      };

      // API 호출
      const response = await sendAddComment(feedId, parentCommentId, content);

      // API 호출 결과 처리
      if (response.resultCode === 0) {
        console.log('Comment added successfully:', response.data);
        setChat('');
        // 추가 성공 시 필요한 로직 작성
      } else {
        console.error('Failed to add comment:', response.resultMessage);
        // 실패 시 필요한 로직 작성
      }
    } catch (error) {
      console.error('An error occurred while adding a comment:', error);
      // 에러 발생 시 처리 로직 작성
    }
  };
  const handleKeyDownInternal = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      handleSendAddComment(feedId, 0, chat);
    }
  };
  return (
    <Drawer anchor="bottom" open={isOpen} onClose={() => toggleDrawer(false)} classes={{paper: styles.drawer}}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.tab}></div>

        <div className={styles.title}>댓글</div>
      </div>

      <div className={styles.commentsSection}>
        {/* Comments Section */}
        <ReelsCommentItem
          username="pppdfk99"
          time="지금"
          comment="너무 재밌어요"
          likes="2.3만"
          dislikes="2"
          replies="2"
        />
        <ReelsCommentItem
          username="jhshdhddhd183"
          time="3시간"
          comment="이 커플이 진짜 제일 좋아요"
          likes="1.2만"
          dislikes="1"
          replies="5"
        />
        <ReelsCommentItem
          username="jhshdhddhd183"
          time="3시간"
          comment="이 커플이 진짜 제일 좋아요"
          likes="1.2만"
          dislikes="1"
          replies="5"
        />{' '}
        <ReelsCommentItem
          username="jhshdhddhd183"
          time="3시간"
          comment="이 커플이 진짜 제일 좋아요"
          likes="1.2만"
          dislikes="1"
          replies="5"
        />{' '}
        <ReelsCommentItem
          username="jhshdhddhd183"
          time="3시간"
          comment="이 커플이 진짜 제일 좋아요"
          likes="1.2만"
          dislikes="1"
          replies="5"
        />{' '}
        <ReelsCommentItem
          username="jhshdhddhd183"
          time="3시간"
          comment="이 커플이 진짜 제일 좋아요"
          likes="1.2만"
          dislikes="1"
          replies="5"
        />{' '}
        <ReelsCommentItem
          username="jhshdhddhd183"
          time="3시간"
          comment="이 커플이 진짜 제일 좋아요"
          likes="1.2만"
          dislikes="1"
          replies="5"
        />{' '}
        <ReelsCommentItem
          username="jhshdhddhd183"
          time="3시간"
          comment="이 커플이 진짜 제일 좋아요"
          likes="1.2만"
          dislikes="1"
          replies="5"
        />
      </div>
      {/* Input Section */}
      <div className={styles.inputSection}>
        <div className={styles.inputWrapper}>
          <TextField
            placeholder="Type your message..."
            onFocus={() => {}}
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
                  {chat.length > 0 && (
                    <div className={styles.circleBlack} onClick={() => handleSendAddComment(feedId, 0, chat)}>
                      <img src={BoldSend.src}></img>
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

export default ReelsComment;
