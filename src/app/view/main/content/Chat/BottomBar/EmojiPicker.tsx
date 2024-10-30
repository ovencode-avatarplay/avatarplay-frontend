import React, {useState} from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import styles from './EmojiPicker.module.css';

// 이미지 파일 경로를 /Images로 설정
const emojiCategories: Record<string, string[]> = {
  recent: ['/Images/emoji1.webp', '/Images/emoji2.webp', '/Images/emoji3.webp'],
  basic: [
    '/Images/emoji1.webp',
    '/Images/emoji2.webp',
    '/Images/emoji3.webp',
    '/Images/emoji4.webp',
    '/Images/emoji5.webp',
    '/Images/emoji5.webp',
    '/Images/emoji5.webp',
    '/Images/emoji5.webp',
    '/Images/emoji5.webp',
    '/Images/emoji5.webp',
    '/Images/emoji5.webp',
    '/Images/emoji5.webp',
    '/Images/emoji5.webp',
    '/Images/emoji5.webp',
    '/Images/emoji5.webp',
  ],
  purchased: ['/Images/emoji6.webp', '/Images/emoji7.webp', '/Images/emoji8.webp'],
};

const tabs = ['recent', 'basic', 'purchased'];

interface EmojiPickerProps {
  onEmojiClick: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({onEmojiClick}) => {
  const [activeTab, setActiveTab] = useState('recent');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.emojiPicker}>
      <div className={styles.tabs}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <ImageList sx={{width: '100%', height: 270, overflowY: 'auto'}} cols={4} rowHeight={100}>
        {emojiCategories[activeTab]?.map((emoji, index) => (
          <ImageListItem key={index} onClick={() => onEmojiClick(emoji)}>
            <img src={emoji} alt={`emoji-${index}`} loading="lazy" />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
};

export default EmojiPicker;
