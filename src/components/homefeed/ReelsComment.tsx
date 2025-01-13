import React, {useState} from 'react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import styles from './ReelsComment.module.css';
import ReelsCommentItem from './ReelsCommentItem';
import {BoldSend, LeftArrow} from '@ui/Icons';
import {InputAdornment, TextField} from '@mui/material';

interface ReelsCommentProps {
  isOpen: boolean;
  toggleDrawer: (open: boolean) => void;
}

const ReelsComment: React.FC<ReelsCommentProps> = ({isOpen, toggleDrawer}) => {
  const [chat, setChat] = useState<string>('Input text');
  const handleInputChange = (value: string) => {
    setChat(value);
  };

  return (
    <Drawer anchor="bottom" open={isOpen} onClose={() => toggleDrawer(false)} classes={{paper: styles.drawer}}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.tab}></div>
        <div className={styles.headerGroup}>
          <div className={styles.closeButton}>
            <img src={LeftArrow.src} onClick={() => toggleDrawer(false)} />
          </div>
          <div className={styles.title}>댓글</div>
          <span style={{width: '21px'}}></span>
        </div>
      </div>

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

      {/* Input Section */}
      <div className={styles.inputSection}>
        <div className={styles.inputWrapper}>
          <TextField
            placeholder="Type your message..."
            onFocus={() => {}}
            value={chat}
            onChange={e => handleInputChange(e.target.value)}
            onKeyDown={() => {}}
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
                paddingTop: '5px',
                paddingBottom: '5px',
                color: '#c6cdd1', // 텍스트 색상 설정
              },
              '& .MuiInputBase-input': {
                fontSize: '14px', // 내부 입력 텍스트의 폰트 크기 설정
                color: '#c6cdd1', // 텍스트 색상 설정
              },
            }}
            style={{padding: '0px'}}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <img src={BoldSend.src}></img>
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
