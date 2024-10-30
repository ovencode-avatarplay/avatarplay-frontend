import React, {useState} from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Avatar from '@mui/material/Avatar';
import styles from './EmojiPicker.module.css';
import {EmoticonGroup} from '@/app/NetWork/ChatNetwork';
import {EmoticonType} from '@/types/apps/dataTypes';

interface EmojiPickerProps {
  onEmojiClick: (emoji: string) => void;
  EmoticonData?: EmoticonGroup[]; // EmoticonData 추가
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({onEmojiClick, EmoticonData}) => {
  const [activeTab, setActiveTab] = useState(0); // 기본적으로 첫 번째 그룹 선택

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };
  console.log(EmoticonData);
  return (
    <div className={styles.emojiPicker}>
      <div className={styles.tabs}>
        {EmoticonData?.map((group, index) => (
          <button
            key={index}
            className={`${styles.tabButton} ${activeTab === index ? styles.active : ''}`}
            onClick={() => handleTabChange(index)}
          >
            {/* EmoticonType enum으로 탭 이름 설정 */}
            <Avatar src={group.iconUrl} sx={{width: 24, height: 24, marginRight: 1}} />
            {EmoticonType[group.type] || 'Unknown'}
          </button>
        ))}
      </div>
      {EmoticonData && EmoticonData[activeTab]?.emoticonList ? (
        <ImageList sx={{width: '100%', height: 270, overflowY: 'auto'}} cols={4} rowHeight={100}>
          {EmoticonData[activeTab].emoticonList.map((emoji, index) => (
            <ImageListItem key={index} onClick={() => onEmojiClick(emoji.iconUrl)}>
              <img src={emoji.iconUrl} alt={`emoji-${index}`} loading="lazy" />
            </ImageListItem>
          ))}
        </ImageList>
      ) : (
        <div>No Emojis Available</div> // 데이터가 없을 경우 대체 메시지 표시
      )}
    </div>
  );
};

export default EmojiPicker;
