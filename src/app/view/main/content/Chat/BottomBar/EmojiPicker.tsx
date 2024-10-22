// EmojiPicker.tsx
import React, {useState} from 'react';
import styles from './EmojiPicker.module.css';
import EmojiItem from './EmojiItem';

const emojiCategories: Record<string, string[]> = {
  recent: ['😀', '😂', '😍', '🥳', '😎'], // 최근 사용한 이모티콘
  basic: ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊'], // 기본 이모티콘
  purchased: ['🤩', '😇', '🤠', '🥶', '🤯', '😵‍💫', '🤓'], // 구매한 이모티콘
};

const tabs = ['최근 사용', '기본 이모티콘', '구매한 이모티콘'];

interface EmojiPickerProps {
  onEmojiClick: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({onEmojiClick}) => {
  const [activeTab, setActiveTab] = useState('recent'); // 기본값을 'recent'로 설정

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.emojiPicker}>
      <div className={styles.tabs}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`${styles.tabButton} ${activeTab === tab.toLowerCase() ? styles.active : ''}`}
            onClick={() => handleTabChange(tab.toLowerCase())}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className={styles.emojiGrid}>
        {emojiCategories[activeTab] ? ( // 유효성 검사 추가
          emojiCategories[activeTab].map((emoji, index) => (
            <EmojiItem key={index} emoji={emoji} onEmojiClick={onEmojiClick} />
          ))
        ) : (
          <p>이모티콘을 찾을 수 없습니다.</p> // 오류 방지를 위한 대체 메시지
        )}
      </div>
    </div>
  );
};

export default EmojiPicker;
