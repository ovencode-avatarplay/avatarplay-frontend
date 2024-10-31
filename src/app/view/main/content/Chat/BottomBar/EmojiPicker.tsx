import React, {useEffect, useState} from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import SwitchLeftIcon from '@mui/icons-material/SwitchLeft';
import SwitchRightIcon from '@mui/icons-material/SwitchRight';
import styles from './EmojiPicker.module.css';
import {EmoticonGroup} from '@/app/NetWork/ChatNetwork';
import {useEmojiCache} from './EmojiCacheContext';

interface EmojiPickerProps {
  onEmojiClick: (emojiUrl: string, emojiId: number, isFavorite: boolean) => void;
  EmoticonData?: EmoticonGroup[];
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({onEmojiClick, EmoticonData}) => {
  const {cachedImages, setCachedImages} = useEmojiCache();
  const [activeTab, setActiveTab] = useState<number | null>(0); // 탭을 선택할 때 토글 비활성화
  const [isToggleFavorite, setIsToggleFavorite] = useState(false); // 토글 상태 관리

  const downloadImagesForTab = async (tabIndex: number) => {
    if (cachedImages[tabIndex] || !EmoticonData) return;

    const selectedGroup = EmoticonData[tabIndex];
    const downloadedImages = await Promise.all(
      selectedGroup.emoticonList.map(async emoji => {
        const response = await fetch(emoji.emoticonUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        return {id: emoji.id, url, isfavorite: emoji.isFavorite};
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
    setIsToggleFavorite(false); // 탭을 선택하면 토글을 해제
    downloadImagesForTab(index);
  };

  const toggleFavoriteView = () => {
    setIsToggleFavorite(prev => !prev); // 즐겨찾기 보기 상태 토글
    setActiveTab(null); // 토글 버튼을 누르면 탭 선택 해제
  };

  const favoriteEmojis = EmoticonData?.flatMap(group => group.emoticonList.filter(emoji => emoji.isFavorite)).map(
    emoji => ({id: emoji.id, url: emoji.emoticonUrl, favorite: emoji.isFavorite}),
  );

  return (
    <div className={styles.emojiPicker}>
      {/* 탭 및 토글 버튼 영역 */}
      <div className={styles.tabs}>
        <IconButton onClick={toggleFavoriteView} className={styles.toggleButton}>
          {isToggleFavorite ? <SwitchLeftIcon /> : <SwitchRightIcon />}
        </IconButton>

        {/* 탭 버튼들은 항상 표시 */}
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

      {/* 이모티콘 리스트 */}
      {isToggleFavorite ? (
        // 즐겨찾기 이모티콘 리스트
        <ImageList sx={{width: '100%', height: 270, overflowY: 'auto'}} cols={4} rowHeight={80} gap={10}>
          {favoriteEmojis && favoriteEmojis.length > 0 ? (
            favoriteEmojis.map(emoji => (
              <ImageListItem key={emoji.id} onClick={() => onEmojiClick(emoji.url, emoji.id, emoji.favorite)}>
                <img src={emoji.url} alt={`emoji-${emoji.id}`} loading="lazy" />
              </ImageListItem>
            ))
          ) : (
            <div>No favorite emojis available</div>
          )}
        </ImageList>
      ) : activeTab !== null ? (
        // 일반 이모티콘 리스트 (탭이 선택된 경우)
        cachedImages[activeTab] && cachedImages[activeTab].length > 0 ? (
          <ImageList sx={{width: '100%', height: 270, overflowY: 'auto'}} cols={4} rowHeight={80} gap={10}>
            {cachedImages[activeTab].map(emoji => (
              <ImageListItem key={emoji.id} onClick={() => onEmojiClick(emoji.url, emoji.id, emoji.isfavorite)}>
                <img src={emoji.url} alt={`emoji-${emoji.id}`} loading="lazy" />
              </ImageListItem>
            ))}
          </ImageList>
        ) : (
          <div>No recent emojis available</div>
        )
      ) : (
        <div>No recent emojis available</div>
      )}
    </div>
  );
};

export default EmojiPicker;
