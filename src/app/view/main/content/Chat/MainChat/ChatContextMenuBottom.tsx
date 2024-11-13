import React, {useState} from 'react';
import {Box, Button, Snackbar, TextField} from '@mui/material';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplayIcon from '@mui/icons-material/Replay';
import styles from '../Styles/ChatMessageMenu.module.css';
import {DeleteChatReq, deleteChatting, ModifyChatReq, modifyChatting} from '@/app/NetWork/ChatNetwork';
import getLocalizedText from '@/utils/getLocalizedText';

interface ChatContextTopProps {
  text: string;
  id: number;
  onTtsClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  // onDelete: () => void;
  // onModified: (newText: string) => void;
  isUserChat: boolean;
  lastMessageId: number;
  onModifyQuestion: (newText: string) => void;
  onRegenerateAnswer: (newText: string) => void;
}

const ChatMessageMenuBottom: React.FC<ChatContextTopProps> = ({
  text,
  id,
  onTtsClick,
  // onDelete,
  // onModified,
  isUserChat,
  lastMessageId,
  onModifyQuestion,
  onRegenerateAnswer,
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  //#region 기획상 사용 안함
  const [modifyTextOpen, setModifyTextOpen] = useState(false);
  const [modifiedText, setModifiedText] = useState(text);
  const deleteSuffix = '\n\n';
  //#endregion

  const [modifyQuestionOpen, setModifyQuestionOpen] = useState(false);
  const [modifiedQuestionText, setModifiedQuestionText] = useState(text);

  const handleCopy = (text: string, event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setSnackbarMessage('Copied!');
        setSnackbarOpen(true);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  //#region 기획상 사용 안하게 바뀜
  // const handleDelete = async () => {
  //   const ReqData: DeleteChatReq = {
  //     chatId: id,
  //     deleteText: text + deleteSuffix,
  //   };
  //   const response = await deleteChatting(ReqData);
  //   if (response.resultCode === 0 && response.data) {
  //     console.log('delete success');
  //     onDelete();
  //   } else {
  //     console.log(getLocalizedText('SampleText', 'systemMessage'));
  //   }
  // };

  // const handleOpenModifyText = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   event.stopPropagation();
  //   setModifyTextOpen(!modifyTextOpen);
  // };

  // const handleCancelModifyText = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   event.stopPropagation();
  //   setModifiedText(text);
  //   setModifyTextOpen(false);
  // };

  // const handleConfirmModify = async (event: React.MouseEvent<HTMLButtonElement>) => {
  //   event.stopPropagation();
  //   const ReqData: ModifyChatReq = {
  //     chatId: id,
  //     originText: text,
  //     modifyText: modifiedText,
  //   };

  //   const response = await modifyChatting(ReqData);
  //   if (response.resultCode === 0 && response.data) {
  //     setSnackbarMessage('Text modified successfully!');
  //     setSnackbarOpen(true);
  //     onModified(modifiedText);
  //     setModifyTextOpen(false);
  //   } else {
  //     console.log(getLocalizedText('SampleText', 'systemMessage'));
  //   }
  // };
  //#endregion

  const handleOpenModifyQuestion = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setModifyQuestionOpen(!modifyQuestionOpen);
  };

  const handleCancelModifyQuestion = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setModifiedQuestionText(text);
    setModifyQuestionOpen(false);
  };

  const handleModifyQuestion = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onModifyQuestion;
  };

  const handleRegenerateAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onRegenerateAnswer;
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Snackbar 닫기
  };

  const handleTtsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onTtsClick(e);
  };

  return (
    <Box className={styles.bottomMenuContainer}>
      {!modifyTextOpen && (
        <>
          {id}
          {/* 하단의 세로 메뉴 - 보이스 재생, 복사, 삭제, 재생성 버튼 */}
          <Button onClick={handleTtsClick} className={styles.actionButton} startIcon={<PlayArrowIcon />}>
            Play Voice
          </Button>
          <Button onClick={e => handleCopy(text, e)} className={styles.actionButton} startIcon={<ContentCopyIcon />}>
            Copy
          </Button>
          {/*<Button onClick={handleDelete} className={styles.actionButton} startIcon={<DeleteIcon />}>
            Delete
          </Button>
          <Button onClick={handleOpenModifyText} className={styles.actionButton} startIcon={<ReplayIcon />}>
            Modify
          </Button>*/}
          {lastMessageId === id &&
            (isUserChat ? (
              <Button onClick={handleOpenModifyQuestion} className={styles.actionButton} startIcon={<ReplayIcon />}>
                Modify Question
              </Button>
            ) : (
              <Button onClick={handleRegenerateAnswer} className={styles.actionButton} startIcon={<ReplayIcon />}>
                Regenerate Answer
              </Button>
            ))}

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={2000} // 2초 후 자동 닫힘
            onClose={handleSnackbarClose}
            message={snackbarMessage}
            anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
            sx={{width: '20vw'}}
          />
        </>
      )}
      {modifyQuestionOpen && (
        <Box sx={{display: 'flex', width: '50vw', alignItems: 'center', alignSelf: 'end', gap: 1, mt: 1}}>
          <TextField
            variant="outlined"
            size="medium"
            placeholder="Enter new text"
            value={modifiedQuestionText}
            onChange={e => setModifiedQuestionText(e.target.value)}
            onClick={e => e.stopPropagation()} // TextField 클릭 시 이벤트 버블링 방지
            onFocus={e => e.stopPropagation()} // TextField 포커스 시 이벤트 버블링 방지
            sx={{flexGrow: 1, backgroundColor: 'white'}}
          />
          <Button onClick={e => handleModifyQuestion(e)} variant="contained" color="primary">
            Confirm
          </Button>
          <Button onClick={e => handleCancelModifyQuestion(e)} variant="contained" color="primary">
            Cancel
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ChatMessageMenuBottom;
