import React, {useEffect, useState} from 'react';
import styles from './ReelsCommentItem.module.css';
import {BoldComment, BoldDislike, BoldLike, LineComment, LineDisLike, LineFolderPlus, LineLike} from '@ui/Icons';
import ReelsComment from './ReelsComment';

export enum CommentType {
  default = 0,
  parent = 1,
  replies = 2,
}

interface ReelsCommentItemProps {
  feedId: number;
  commentId: number;
  username: string;
  time: string;
  comment: string;
  likesCount: number; // e.g., "2.3만"
  isLike: boolean; // e.g., "2"
  type?: CommentType;
}

const ReelsCommentItem: React.FC<ReelsCommentItemProps> = ({
  feedId,
  commentId,
  username,
  time,
  comment,
  likesCount,
  isLike,
  type = CommentType.default,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [formattedTime, setFormattedTime] = useState('');
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
    setFormattedTime(formatTimeAgo(time));
  }, [time]);

  const [isCommentOpen, setCommentIsOpen] = useState(false);
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
        <div className={styles.userInfo}>
          <span className={styles.username}>{username}</span>
          <span className={styles.time}>{formattedTime}</span>
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
            comment
          ) : comment.length > 100 ? (
            <>
              {comment.slice(0, 92)}
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
            comment
          )}
        </p>

        {/* Actions */}
        <div className={styles.actions}>
          <div className={styles.actionItem}>
            <img
              src={LineLike.src}
              className={styles.button}
              style={{
                filter: isLike
                  ? 'brightness(0) saturate(100%) invert(47%) sepia(57%) saturate(1806%) hue-rotate(287deg) brightness(102%) contrast(98%)'
                  : 'none', // 기본 상태는 필터 없음
              }}
            />
            <div className={styles.actionText}>{likesCount.toString()}</div>
          </div>
          <div className={styles.actionItem} onClick={() => setCommentIsOpen(true)}>
            <img src={LineComment.src}></img>
          </div>
        </div>
      </div>

      {/* Menu Icon */}
      <div className={styles.menuIcon}>
        <div className={styles.menuDots}></div>
      </div>
      <ReelsComment
        feedId={feedId}
        isOpen={isCommentOpen}
        toggleDrawer={v => setCommentIsOpen(v)}
        isReplies={true}
        parentCommentId={commentId}
      />
    </div>
  );
};

export default ReelsCommentItem;
