import React, {useEffect, useState} from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Avatar from '@mui/material/Avatar';
import styles from './EmojiPicker.module.css';
import {EmoticonGroup} from '@/app/NetWork/ChatNetwork';
import {useEmojiCache} from './EmojiCacheContext';

interface EmojiPickerProps {
  onEmojiClick: (emojiUrl: string, emojiId: number) => void;
  EmoticonData?: EmoticonGroup[];
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({onEmojiClick, EmoticonData}) => {
  const {cachedImages, setCachedImages} = useEmojiCache();
  const [activeTab, setActiveTab] = useState(0);

  const downloadImagesForTab = async (tabIndex: number) => {
    if (cachedImages[tabIndex] || !EmoticonData) return;

    const selectedGroup = EmoticonData[tabIndex];
    const downloadedImages = await Promise.all(
      selectedGroup.emoticonList.map(async emoji => {
        const response = await fetch(emoji.emoticonUrl);
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
    downloadImagesForTab(0); // 초기 Basic 탭 이미지 다운로드
  }, [EmoticonData]);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    downloadImagesForTab(index);
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
            <Avatar
              src={activeTab === index ? group.iconOnUrl : group.iconOffUrl}
              sx={{width: 24, height: 24, marginRight: 1}}
            />
          </button>
        ))}
      </div>

      {cachedImages[activeTab] ? (
        <ImageList
          sx={{
            width: '100%',
            height: 270,
            overflowY: 'auto',
          }}
          cols={4}
          rowHeight={80}
          gap={10}
        >
          {cachedImages[activeTab].map(emoji => (
            <ImageListItem key={emoji.id} onClick={() => onEmojiClick(emoji.url, emoji.id)}>
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
