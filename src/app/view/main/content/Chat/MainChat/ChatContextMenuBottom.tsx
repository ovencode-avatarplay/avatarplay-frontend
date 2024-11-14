import React, {useState} from 'react';
import {Box, Button, Snackbar, TextField} from '@mui/material';

import {RootState} from '@/redux-store/ReduxStore';
import {useDispatch} from 'react-redux';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplayIcon from '@mui/icons-material/Replay';
import styles from '../Styles/ChatMessageMenu.module.css';
import {DeleteChatReq, deleteChatting, ModifyChatReq, modifyChatting} from '@/app/NetWork/ChatNetwork';
import getLocalizedText from '@/utils/getLocalizedText';
import {setIsModifying, setModifyingText} from '@/redux-store/slices/ModifyQuestion';

interface ChatContextTopProps {
  text: string;
  id: number;
  onTtsClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  // onDelete: () => void;
  // onModified: (newText: string) => void;
  isUserChat: boolean;
  lastMessageId: number;
}

const ChatMessageMenuBottom: React.FC<ChatContextTopProps> = ({
  text,
  id,
  onTtsClick,
  // onDelete,
  // onModified,
  isUserChat,
  lastMessageId,
}) => {
  const dispatch = useDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  //#region 기획상 사용 안함
  const [modifyTextOpen, setModifyTextOpen] = useState(false);
  const [modifiedText, setModifiedText] = useState(text);
  const deleteSuffix = '\n\n';
  //#endregion

  const [modifyQuestionOpen, setModifyQuestionOpen] = useState(false);

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

  const handleStartModifyQuestion = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setModifyQuestionOpen(!modifyQuestionOpen);
    dispatch(setIsModifying(true));
    dispatch(setModifyingText(text));
  };

  const handleRegenerateAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    // dispatch
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
              <Button onClick={handleStartModifyQuestion} className={styles.actionButton} startIcon={<ReplayIcon />}>
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
    </Box>
  );
};

export default ChatMessageMenuBottom;
