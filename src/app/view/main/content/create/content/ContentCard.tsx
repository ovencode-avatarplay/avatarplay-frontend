import React from 'react';
import styles from './ContentCard.module.css';
import {BoldChatRoundDots, BoldFollowers, LineDelete, LineEdit} from '@ui/Icons';

export const mockContentInfo: ContentInfo[] = [
  {
    imageUrl: 'https://example.com/webtoon1.jpg',
    title: '어둠의 왕',
    description: '어둠 속에서 태어난 왕의 이야기..asdadsasdadads.',
    genre: 'Fantasy / Action',
    status: 'Publishing',
    views: 12500,
    comments: 320,
  },
  {
    imageUrl: 'https://example.com/webtoon2.jpg',
    title: '미래에서 온 소년',
    description: '시간을 초월한 소년이 펼치는 모험!',
    genre: 'Sci-Fi / Adventure',
    status: 'Publishing',
    views: 8450,
    comments: 780,
  },
  {
    imageUrl: 'https://example.com/webtoon3.jpg',
    title: '그림자 속 그녀',
    description: '그림자 속에서 살아가는 그녀의 비밀...',
    genre: 'Thriller / Mystery',
    status: 'Saving',
    views: 5900,
    comments: 230,
  },
  {
    imageUrl: 'https://example.com/webtoon3.jpg',
    title: '그림자 속 그녀',
    description: '그림자 속에서 살아가는 그녀의 비밀...',
    genre: 'Thriller / Mystery',
    status: 'Saving',
    views: 5900,
    comments: 230,
  },
  {
    imageUrl: 'https://example.com/webtoon3.jpg',
    title: '그림자 속 그녀',
    description: '그림자 속에서 살아가는 그녀의 비밀...',
    genre: 'Thriller / Mystery',
    status: 'Saving',
    views: 5900,
    comments: 230,
  },
  {
    imageUrl: 'https://example.com/webtoon3.jpg',
    title: '그림자 속 그녀',
    description: '그림자 속에서 살아가는 그녀의 비밀...',
    genre: 'Thriller / Mystery',
    status: 'Saving',
    views: 5900,
    comments: 230,
  },
  {
    imageUrl: 'https://example.com/webtoon3.jpg',
    title: '그림자 속 그녀',
    description: '그림자 속에서 살아가는 그녀의 비밀...',
    genre: 'Thriller / Mystery',
    status: 'Saving',
    views: 5900,
    comments: 230,
  },
];

export interface ContentInfo {
  imageUrl: string;
  title: string;
  description: string;
  genre: string;
  status: string;
  views: number;
  comments: number;
}

interface ContentCardProps {
  content: ContentInfo;
  onEdit: () => void;
  onDelete: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({content, onEdit, onDelete}) => {
  return (
    <div className={styles.card}>
      <div className={styles.thumbnail}>
        <img src={'/lora/anylora.png'} alt="Webtoon Thumbnail" />
        <span className={styles.status}>{content.status}</span>
      </div>
      <div className={styles.content}>
        <div className={styles.contentArea}>
          <p className={styles.genre}>{content.genre}</p>
          <h3 className={styles.title}>{content.title}</h3>
          <p className={styles.description}>{content.description}</p>
        </div>
        <div className={styles.footer}>
          <div className={styles.actions}>
            <button className={styles.iconButton} onClick={onDelete}>
              <img src={LineDelete.src} className={styles.black}></img>
            </button>
            <button className={styles.iconButton} onClick={onEdit}>
              <img src={LineEdit.src} className={styles.black}></img>
            </button>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <img src={BoldFollowers.src} className={styles.gray}></img> {content.views.toLocaleString()}
            </div>
            <div className={styles.stat}>
              <img src={BoldChatRoundDots.src} className={styles.gray}></img> {content.comments.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
