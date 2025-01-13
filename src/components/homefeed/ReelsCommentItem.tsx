import React from 'react';
import styles from './ReelsCommentItem.module.css';
import {BoldComment, BoldDislike, BoldLike, LineComment, LineDisLike, LineFolderPlus, LineLike} from '@ui/Icons';

interface ReelsCommentItemProps {
  username: string;
  time: string;
  comment: string;
  likes: string; // e.g., "2.3만"
  dislikes: string; // e.g., "2"
  replies: string; // e.g., "2"
}

const ReelsCommentItem: React.FC<ReelsCommentItemProps> = ({username, time, comment, likes, dislikes, replies}) => {
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
            <img src={LineLike.src}></img>
            <div className={styles.actionText}>{likes}</div>
          </div>
          <div className={styles.actionItem}>
            <img src={LineDisLike.src}></img>
            <div className={styles.actionText}>{dislikes}</div>
          </div>
          <div className={styles.actionItem}>
            <img src={LineComment.src}></img>
            <div className={styles.actionText}>{replies}</div>
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
