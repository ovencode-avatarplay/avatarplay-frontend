import React, {useEffect, useState} from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Avatar from '@mui/material/Avatar';
import styles from './EmojiPicker.module.css';
import {EmoticonGroup} from '@/app/NetWork/ChatNetwork';
import {EmoticonType} from '@/types/apps/dataTypes';
import {useEmojiCache} from './EmojiCacheContext';

interface EmojiPickerProps {
  onEmojiClick: (emoji: string) => void;
  EmoticonData?: EmoticonGroup[];
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({onEmojiClick, EmoticonData}) => {
  const {cachedImages, setCachedImages} = useEmojiCache();
  const [activeTab, setActiveTab] = useState(0);

  const downloadImagesForTab = async (tabIndex: number) => {
    // 캐시에 해당 탭의 이미지가 이미 있는 경우, 다운로드를 생략
    if (cachedImages[tabIndex] || !EmoticonData) {
      return;
    }

    const selectedGroup = EmoticonData[tabIndex];
    const downloadedImages = await Promise.all(
      selectedGroup.emoticonList.map(async emoji => {
        const response = await fetch(emoji.iconUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        return {id: emoji.id, url};
      }),
    );

    setCachedImages(prev => ({
      ...prev,
      [tabIndex]: downloadedImages,
    }));
  };

  useEffect(() => {
    downloadImagesForTab(0); // 초기 Basic 탭 다운로드
  }, [EmoticonData]);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    downloadImagesForTab(index); // 선택된 탭의 이미지 다운로드
  };

  return (
    <div className={styles.emojiPicker}>
      <div className={styles.tabs}>
        {EmoticonData?.map((group, index) => (
          <button
            key={index}
            className={`${styles.tabButton} ${activeTab === index ? styles.active : ''}`}
            onClick={() => handleTabChange(index)}
          >
            <Avatar src={group.iconUrl} sx={{width: 24, height: 24, marginRight: 1}} />
            {EmoticonType[group.type] || 'Unknown'}
          </button>
        ))}
      </div>

      {cachedImages[activeTab] ? (
        <ImageList sx={{width: '100%', height: 270, overflowY: 'auto'}} cols={4} rowHeight={100}>
          {cachedImages[activeTab].map(emoji => (
            <ImageListItem key={emoji.id} onClick={() => onEmojiClick(emoji.url)}>
              <img src={emoji.url} alt={`emoji-${emoji.id}`} loading="lazy" />
            </ImageListItem>
          ))}
        </ImageList>
      ) : (
        <div>No Emojis Available</div>
      )}
    </div>
  );
};

export default EmojiPicker;
