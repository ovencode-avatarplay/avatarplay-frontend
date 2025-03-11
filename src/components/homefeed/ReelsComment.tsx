import React, {useEffect, useState} from 'react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import styles from './ReelsComment.module.css';
import ReelsCommentItem, {CommentType} from './ReelsCommentItem';
import {BoldSend, LeftArrow} from '@ui/Icons';
import {InputAdornment, TextField} from '@mui/material';
import {CommentContentType, CommentInfo, sendAddComment, sendGetCommentList} from '@/app/NetWork/CommonNetwork';

interface ReelsCommentProps {
  feedId: number;
  isOpen: boolean;
  toggleDrawer: (open: boolean) => void;
  isReplies?: boolean;
  parentCommentId?: number;
  onRepliesBack?: () => void;
  onAddTotalCommentCount: () => void;
}

const ReelsComment: React.FC<ReelsCommentProps> = ({
  isOpen,
  toggleDrawer,
  feedId,
  parentCommentId = 0,
  isReplies = false,
  onRepliesBack = () => {},
  onAddTotalCommentCount,
}) => {
  const [chat, setChat] = useState<string>('');
  const handleInputChange = (value: string) => {
    setChat(value);
  };

  const [parentComment, setParentComment] = useState<CommentInfo>(); // 댓글 리스트 상태

  const [commentList, setCommentList] = useState<CommentInfo[]>([]); // 댓글 리스트 상태
  // 댓글 리스트 가져오기
  const getCommentList = async () => {
    const payload = {
      typeValueId: feedId,
      type: CommentContentType.Feed,
    };

    try {
      const response = await sendGetCommentList(payload);
      if (isReplies) {
        let allComment = response.data?.commentInfoList as CommentInfo[];

        // `proms.commentId`와 같은 commentId를 가진 댓글 찾기
        const targetCommentId = parentCommentId; // 주어진 `proms` 객체의 commentId
        const matchingComment = allComment.find(comment => comment.commentId === targetCommentId);

        if (matchingComment) {
          setParentComment(matchingComment);
        }
      } else {
        setCommentList(response.data?.commentInfoList as CommentInfo[]);
        console.log('response.data?.commentInfoList as CommentInfo[]', response.data?.commentInfoList as CommentInfo[]);
      }
    } catch (error) {
      console.error('댓글 리스트 가져오기 실패:', error);
    }
  };

  useEffect(() => {}, [parentComment, commentList]);
  useEffect(() => {
    if (isOpen) {
      getCommentList();
    }
  }, [isOpen]);
  const handleSendAddComment = async (feedId: number, parentCommentId: number, content: string) => {
    const payload = {
      typeValueId: feedId,
      type: CommentContentType.Feed,
      comment: content, // 댓글 내용
      parentCommentId: parentCommentId,
    };

    try {
      const response = await sendAddComment(payload);
      onAddTotalCommentCount();
      setChat('');
      getCommentList();
      onRepliesBack();
    } catch (error) {
      console.error('댓글 추가 실패:', error);
    }
  };
  const handleKeyDownInternal = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // 기본 동작 방지 (텍스트 줄바꿈)
      handleSendAddComment(feedId, parentCommentId, chat);
    }
  };
  return (
    <Drawer
      anchor="bottom"
      open={isOpen}
      onClose={() => {
        toggleDrawer(false);
        onRepliesBack();
      }}
      classes={{paper: styles.drawer}}
    >
      {/* Header */}
      {!isReplies && (
        <div className={styles.header}>
          <div className={styles.tab}></div>

          <div className={styles.title}>댓글</div>
        </div>
      )}
      {isReplies && (
        <div className={styles.header}>
          <div className={styles.tab}></div>
          <div className={styles.headerGroup}>
            <div className={styles.closeButton}>
              <img src={LeftArrow.src} onClick={() => toggleDrawer(false)} />
            </div>
            <div className={styles.title}>답글</div>
            <span style={{width: '21px'}}></span>
          </div>
        </div>
      )}

      <div className={styles.commentsSection}>
        {/* Comments Section */}
        {!isReplies &&
          commentList.map((comment, index) => (
            <ReelsCommentItem
              onComplete={() => getCommentList()}
              key={index}
              feedId={feedId}
              comment={comment}
              onRepliesBack={() => getCommentList()}
              onAddTotalCommentCount={() => onAddTotalCommentCount()}
            />
          ))}

        {isReplies && parentComment && (
          <ReelsCommentItem
            feedId={feedId}
            comment={parentComment}
            type={CommentType.parent}
            onComplete={() => getCommentList()}
            onAddTotalCommentCount={() => onAddTotalCommentCount()}
          />
        )}
        {isReplies &&
          parentComment?.replies.map((comment, index) => (
            <ReelsCommentItem
              feedId={feedId}
              comment={comment}
              type={CommentType.replies}
              onComplete={() => getCommentList()}
              onAddTotalCommentCount={() => onAddTotalCommentCount()}
            />
          ))}
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
                fontSize: '16px', // 내부 입력 텍스트의 폰트 크기 설정
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
                    <div
                      className={styles.circleBlack}
                      onClick={() => handleSendAddComment(feedId, parentCommentId, chat)}
                    >
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
