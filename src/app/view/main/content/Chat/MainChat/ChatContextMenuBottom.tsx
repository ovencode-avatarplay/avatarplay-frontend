import React, {useEffect, useRef, useState} from 'react';
import {Snackbar} from '@mui/material';

import {useDispatch} from 'react-redux';

import {PlayTts, Copy, Delete, Regenerate} from '@ui/chatting';
import styles from '../Styles/ChatMessageMenu.module.css';
import {setIsRegeneratingQuestion} from '@/redux-store/slices/ModifyQuestion';

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

  const [modifyQuestionOpen, setModifyQuestionOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuClass, setMenuClass] = useState<string>('');

  const MinByte = 30;

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

  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;

      if (rect.left < 10) {
        setMenuClass('leftEdge');
      } else if (rect.right > windowWidth - 10) {
        setMenuClass('rightEdge');
      } else {
        setMenuClass('');
      }
    }
  }, [text]);

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
    dispatch(setIsRegeneratingQuestion(true));
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false); // Snackbar 닫기
  };

  const handleTtsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onTtsClick(e);
  };

  // Byte 길이를 계산하는 함수
  const getTextByteLength = (text: string): number => {
    // TextEncoder를 사용해 byte 길이 계산
    const encoder = new TextEncoder();
    return encoder.encode(text).length;
  };

  return (
    <div
      ref={menuRef}
      className={
        isUserChat
          ? getTextByteLength(text) > MinByte
            ? styles.bottomMenuContainerUser
            : styles.bottomMenuContainerUserShort
          : `${styles.bottomMenuContainerAI} ${styles[menuClass]}`
      }
    >
      {/* {id} */}
      <button onClick={handleTtsClick} className={styles.actionButton}>
        Voice
        <img className={styles.icon} src={PlayTts.src} />
      </button>
      {/*<Button onClick={handleDelete} className={styles.actionButton} startIcon={<DeleteIcon />}>
            Delete
          </Button>
          <Button onClick={handleOpenModifyText} className={styles.actionButton} startIcon={<ReplayIcon />}>
            Modify
          </Button>*/}
      {/* <button onClick={handleOpenModifyText } className={styles.actionButtonDelete}>
        Delete
        <img className={styles.icon} src={Delete.src} />
      </button> */}
      {lastMessageId === id && isUserChat ? (
        <>
          <button onClick={e => handleCopy(text, e)} className={styles.actionButton}>
            Copy
            <img className={styles.icon} src={Copy.src} />
          </button>
          <button onClick={handleStartModifyQuestion} className={styles.actionButtonLast}>
            Regenerate
            <img className={styles.icon} src={Regenerate.src} />
          </button>
        </>
      ) : (
        <button onClick={e => handleCopy(text, e)} className={styles.actionButtonLast}>
          Copy
          <img className={styles.icon} src={Copy.src} />
        </button>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000} // 2초 후 자동 닫힘
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
        sx={{width: '20vw'}}
      />
    </div>
  );
};

export default ChatMessageMenuBottom;
