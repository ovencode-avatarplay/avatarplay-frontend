import React from 'react';
import styles from './ReelsCommentItem.module.css';
import {BoldComment, BoldDislike, BoldLike, LineComment, LineDisLike, LineFolderPlus, LineLike} from '@ui/Icons';

interface ReelsCommentItemProps {
  username: string;
  time: string;
  comment: string;
  likesCount: number; // e.g., "2.3만"
  isLike: boolean; // e.g., "2"
}

const ReelsCommentItem: React.FC<ReelsCommentItemProps> = ({username, time, comment, likesCount, isLike}) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* User Info */}
        <div className={styles.userInfo}>
          <span className={styles.username}>{username}</span>
          <span className={styles.time}>{time}</span>
        </div>

        {/* Comment */}
        <p className={styles.commentText}>{comment}</p>

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
          <div className={styles.actionItem}>
            <img src={LineComment.src}></img>
          </div>
        </div>
      </div>

      {/* Menu Icon */}
      <div className={styles.menuIcon}>
        <div className={styles.menuDots}></div>
      </div>
    </div>
  );
};

export default ReelsCommentItem;
