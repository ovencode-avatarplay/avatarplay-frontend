import React, {useEffect, useState} from 'react';
import styles from './CommentItem.module.css';
import {BoldComment, BoldDislike, BoldLike, LineComment, LineDisLike, LineFolderPlus, LineLike} from '@ui/Icons';
import Comment from './Comment';
import {Avatar, Menu, MenuItem} from '@mui/material';
import CommentEdit from './CommentEdit';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {ClassNames} from '@emotion/react';
import {
  CommentContentType,
  CommentInfo,
  ReplieInfo,
  sendCommentDislike,
  sendCommentLike,
  sendDeleteComment,
} from '@/app/NetWork/CommonNetwork';

export enum CommentType {
  default = 0,
  parent = 1,
  replies = 2,
}

interface CommentItemProps {
  feedId: number;
  comment: CommentInfo | ReplieInfo;
  type?: CommentType;
  onComplete: () => void;
  onRepliesBack?: () => void;
  onAddTotalCommentCount: () => void;
  onCloseComment: () => void;
  onSubTotalCommentCount: () => void;
  commentType: CommentContentType;
}

const CommentItem: React.FC<CommentItemProps> = ({
  onComplete,
  feedId,
  comment,
  type = CommentType.default,
  onRepliesBack = () => {},
  onAddTotalCommentCount,
  onSubTotalCommentCount,
  onCloseComment,
  commentType,
}) => {
  const [isLike, setIsLike] = useState(comment.isLike);
  const [likeCount, setLikeCount] = useState(comment.likeCount);
  const [isDisLike, setIsDisLike] = useState(comment.isDisLike);

  const [isExpanded, setIsExpanded] = useState(false);
  const [formattedTime, setFormattedTime] = useState('');
  const [repleCount, setRepleCount] = useState(() => {
    // 초기값 설정 시 'replies' 존재 여부 확인
    if ('replies' in comment) {
      return comment.replies.length;
    }
    return 0;
  });
  const userId = useSelector((state: RootState) => state.user.userId);
  useEffect(() => {}, [comment]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [isEditOpen, setIsEditOpen] = useState(false);
  const handleLikeComment = async (commentId: number, isLike: boolean) => {
    try {
      if (isDisLike == true) {
        await handleDisLikeComment(commentId, !isDisLike);
      }
      const response = await sendCommentLike({commentId, isLike});

      if (response.resultCode === 0) {
        console.log(`Feed ${commentId} has been ${isLike ? 'liked' : 'unliked'} successfully!`);
        if (response.data) setLikeCount(response.data?.likeCount);
        setIsLike(isLike);
      } else {
        console.error(`Failed to like/unlike feed: ${response.resultMessage}`);
      }
    } catch (error) {
      console.error('An error occurred while liking/unliking the feed:', error);
    }
  };

  const handleDisLikeComment = async (commentId: number, isDisLike: boolean) => {
    try {
      if (isDisLike == true) {
        await handleLikeComment(commentId, !isDisLike);
      }
      const response = await sendCommentDislike({commentId, isDisLike: isDisLike});

      if (response.resultCode === 0) {
        console.log(`Feed ${commentId} has been ${isDisLike ? 'liked' : 'unliked'} successfully!`);
        setIsDisLike(isDisLike);
      } else {
        console.error(`Failed to like/unlike feed: ${response.resultMessage}`);
      }
    } catch (error) {
      console.error('An error occurred while liking/unliking the feed:', error);
    }
  };

  const decodeJwt = (token: string): {id?: string; email?: string; [key: string]: any} | null => {
    try {
      const base64Payload = token.split('.')[1]; // payload 부분 추출
      const decodedPayload = atob(base64Payload); // Base64 디코드
      return JSON.parse(decodedPayload); // JSON 파싱하여 반환
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
    }
  };

  const getEmailFromJwt = (): string | null => {
    const jwt = localStorage.getItem('jwt'); // localStorage에서 JWT 가져오기
    if (jwt) {
      const payload = decodeJwt(jwt); // 디코드
      return payload?.email || null; // email 반환
    }
    return null; // JWT가 없을 경우 null 반환
  };

  const formatTimeAgo = (time: string): string => {
    const now = new Date();
    const commentTime = new Date(time);
    const diffInSeconds = Math.floor((now.getTime() - commentTime.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}초 전`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}주 전`;
    const diffInMonths = Math.floor(diffInWeeks / 4);
    if (diffInMonths < 12) return `${diffInMonths}달 전`;
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears}년 전`;
  };
  useEffect(() => {
    if ('replies' in comment) {
      setRepleCount(comment.replies.length);
    }
  }, [comment]);
  useEffect(() => {
    setFormattedTime(formatTimeAgo(comment.updatedAt));
  }, [comment.updatedAt]);

  const [isCommentOpen, setCommentIsOpen] = useState(false);

  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await sendDeleteComment({commentId});
      onSubTotalCommentCount();
      onComplete();

      console.log(type);
      if (type == CommentType.parent) {
        onCloseComment();
      }
    } catch (error) {
      console.error('🚨 댓글 삭제 API 호출 오류:', error);
    }
  };

  return (
    <div
      className={styles.container}
      style={{
        paddingLeft: type == CommentType.replies ? '25px' : '14px',
        backgroundColor: type == CommentType.parent ? '#f8f9fa' : '#ffffff',
      }}
    >
      <div className={styles.content}>
        {/* User Info */}

        <div style={{display: 'flex'}}>
          <Avatar src={comment.userImage} style={{width: '22px', height: '22px', marginRight: '12px'}} />
          <div>
            <div className={styles.userInfo}>
              <span className={styles.username}>{comment.userName}</span>
              <span className={styles.time}>
                {formattedTime} {comment.isModify && <>(수정됨)</>}
              </span>
            </div>
            {/* Comment */}
            <p
              className={styles.commentText}
              style={{
                maxHeight: isExpanded ? 'none' : '200px',
                overflowY: isExpanded ? 'auto' : 'hidden',
                width: '100%',
              }}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                comment?.content
              ) : (comment?.content?.length ?? 0) > 100 ? (
                <>
                  {comment?.content?.slice(0, 92)}
                  <span
                    style={{
                      color: '#99A3AD', // 원하는 색상 코드
                      cursor: 'pointer', // 클릭 가능한 상태로 표시
                    }}
                  >
                    ...자세히보기
                  </span>
                </>
              ) : (
                comment?.content
              )}
            </p>
            {/* Actions */}
            <div className={styles.actions} style={{marginTop: '10px'}}>
              <div className={styles.actionItem}>
                {!isLike && (
                  <img
                    src={LineLike.src}
                    className={styles.button}
                    onClick={() => handleLikeComment(comment.commentId, !isLike)}
                  />
                )}
                {isLike && (
                  <img
                    src={BoldLike.src}
                    className={styles.like}
                    onClick={() => handleLikeComment(comment.commentId, !isLike)}
                  />
                )}
                <div className={styles.actionText}>{likeCount}</div>
              </div>
              <div className={styles.actionItem}>
                {!isDisLike && (
                  <img
                    src={LineDisLike.src}
                    className={styles.button}
                    onClick={() => handleDisLikeComment(comment.commentId, !isDisLike)}
                  />
                )}
                {isDisLike && (
                  <img
                    src={BoldDislike.src}
                    className={styles.disLike}
                    onClick={() => handleDisLikeComment(comment.commentId, !isDisLike)}
                  />
                )}
              </div>
              {type == CommentType.default && (
                <div className={styles.actionItem} onClick={() => setCommentIsOpen(true)}>
                  <img src={LineComment.src} className={styles.button}></img>
                </div>
              )}
            </div>
            {'replies' in comment && type == CommentType.default && (
              <div
                style={{marginTop: '14px'}}
                className={styles.commentCount}
                onClick={() => {
                  setCommentIsOpen(true);
                }}
              >
                답글 {repleCount}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Menu Icon */}
      <div className={styles.menuIcon} onClick={event => handleClick(event)}>
        <div className={styles.menuDots}></div>
      </div>
      <Comment
        contentId={feedId}
        isOpen={isCommentOpen}
        toggleDrawer={v => setCommentIsOpen(v)}
        isReplies={true}
        parentCommentId={comment.commentId}
        onRepliesBack={() => onRepliesBack()}
        onAddTotalCommentCount={() => onAddTotalCommentCount()}
        onSubTotalCommentCount={() => onSubTotalCommentCount()}
        commentType={commentType}
      />
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {'email' in comment && getEmailFromJwt() && getEmailFromJwt() == comment.email && (
          <MenuItem
            onClick={() => {
              handleClose();
              setIsEditOpen(true);
            }}
          >
            Edit
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            handleDeleteComment(comment.commentId);
            handleClose();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
      <CommentEdit
        commentId={comment.commentId}
        isOpen={isEditOpen}
        prevChat={comment.content}
        toggleDrawer={setIsEditOpen}
        onComplete={() => onComplete()}
      ></CommentEdit>
    </div>
  );
};

export default CommentItem;
