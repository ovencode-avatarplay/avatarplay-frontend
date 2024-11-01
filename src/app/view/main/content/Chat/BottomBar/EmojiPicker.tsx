import React, {useEffect, useState} from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import SwitchLeftIcon from '@mui/icons-material/SwitchLeft';
import SwitchRightIcon from '@mui/icons-material/SwitchRight';
import styles from './EmojiPicker.module.css';
import {EmoticonGroupInfo} from '@/app/NetWork/ChatNetwork';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from '@/redux-store/ReduxStore';
import {fetchAndUpdateEmoticonGroups} from '@/redux-store/slices/EmoticonSlice';

interface EmojiPickerProps {
  onEmojiClick: (emojiUrl: string, emojiId: number, isFavorite: boolean) => void;
  EmoticonData?: EmoticonGroupInfo[];
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({onEmojiClick, EmoticonData}) => {
  const dispatch: AppDispatch = useDispatch();
  const emoticonGroups = useSelector((state: RootState) => state.emoticon.emoticonGroups);
  const [activeTab, setActiveTab] = useState<number | null>(null); // null로 초기화하여 토글 버튼에서 시작
  const [isToggleFavorite, setIsToggleFavorite] = useState(true); // true일 때 EmoticonData[0], false일 때 EmoticonData[1] 표시

  useEffect(() => {
    if (EmoticonData && EmoticonData.length > 1) {
      dispatch(fetchAndUpdateEmoticonGroups(EmoticonData));
    }
  }, []);

  useEffect(() => {}, [emoticonGroups]);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  const toggleFavoriteView = () => {
    setIsToggleFavorite(prev => !prev);
    setActiveTab(null); // 탭 상태 초기화
  };

  return (
    <div className={styles.emojiPicker}>
      {/* 토글 버튼 */}
      <div className={styles.tabs}>
        <IconButton onClick={toggleFavoriteView} className={styles.toggleButton}>
          {isToggleFavorite ? <SwitchLeftIcon /> : <SwitchRightIcon />}
        </IconButton>

        {/* EmoticonData의 2번부터, 이모티콘이 있는 그룹만 탭 생성 */}
        {EmoticonData?.slice(2)
          .filter(group => group.emoticonList.length > 0)
          .map(group => (
            <button
              key={group.id} // 그룹의 고유 ID를 키로 사용
              className={`${styles.tabButton} ${activeTab === group.id ? styles.active : ''}`}
              onClick={() => handleTabChange(group.id)}
            >
              <Avatar
                src={activeTab === group.id ? group.iconOnUrl : group.iconOffUrl}
                sx={{width: 24, height: 24, marginRight: 1}}
              />
            </button>
          ))}
      </div>

      {/* 즐겨찾기 이모티콘 표시 */}
      {activeTab === null && isToggleFavorite && (
        <ImageList sx={{width: '100%', height: 270, overflowY: 'auto'}} cols={4} rowHeight={80} gap={10}>
          {emoticonGroups[0]?.emoticonList.length > 0 ? (
            emoticonGroups[0].emoticonList.map(emoji => (
              <ImageListItem key={emoji.id} onClick={() => onEmojiClick(emoji.emoticonUrl, emoji.id, emoji.isFavorite)}>
                <img src={emoji.emoticonUrl} alt={`emoji-${emoji.id}`} loading="lazy" />
              </ImageListItem>
            ))
          ) : (
            <div>No favorite emojis available</div>
          )}
        </ImageList>
      )}

      {/* 최근 사용 이모티콘 표시 */}
      {activeTab === null && !isToggleFavorite && (
        <ImageList sx={{width: '100%', height: 270, overflowY: 'auto'}} cols={4} rowHeight={80} gap={10}>
          {emoticonGroups[1]?.emoticonList.length > 0 ? (
            emoticonGroups[1].emoticonList.map(emoji => (
              <ImageListItem key={emoji.id} onClick={() => onEmojiClick(emoji.emoticonUrl, emoji.id, emoji.isFavorite)}>
                <img src={emoji.emoticonUrl} alt={`emoji-${emoji.id}`} loading="lazy" />
              </ImageListItem>
            ))
          ) : (
            <div>No recent emojis available</div>
          )}
        </ImageList>
      )}

      {/* 특정 탭의 이모티콘 그룹 표시 */}
      {activeTab !== null && emoticonGroups[activeTab + 1]?.emoticonList && (
        <ImageList sx={{width: '100%', height: 270, overflowY: 'auto'}} cols={4} rowHeight={80} gap={10}>
          {emoticonGroups[activeTab + 1].emoticonList.map(emoji => (
            <ImageListItem key={emoji.id} onClick={() => onEmojiClick(emoji.emoticonUrl, emoji.id, emoji.isFavorite)}>
              <img src={emoji.emoticonUrl} alt={`emoji-${emoji.id}`} loading="lazy" />
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </div>
  );
};

export default EmojiPicker;
