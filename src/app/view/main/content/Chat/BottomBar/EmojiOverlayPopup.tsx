import React, {useState, useEffect} from 'react';
import styles from './EmojiOverlayPopup.module.css';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import {sendFavoriteEmoticon} from '@/app/NetWork/ChatNetwork';
import {useEmojiCache} from './EmojiCacheContext';

interface EmojiOverlayPopupProps {
  isOpen: boolean;
  emojiUrl: string;
  onClose: () => void;
  isFavorite: boolean;
  emoticonId: number | null;
  onSend: () => void;
}

const EmojiOverlayPopup: React.FC<EmojiOverlayPopupProps> = ({
  isOpen,
  emojiUrl,
  onClose,
  isFavorite,
  emoticonId,
  onSend,
}) => {
  const [isStarred, setIsStarred] = useState(isFavorite);
  const {updateFavoriteStatus} = useEmojiCache();

  // 이모티콘 ID나 즐겨찾기 상태가 바뀔 때마다 isStarred를 초기화
  useEffect(() => {
    console.log(isFavorite);
    setIsStarred(isFavorite);
  }, [isFavorite, emoticonId]);

  const handleStarClick = async () => {
    try {
      const updatedIsFavorite = !isStarred;
      setIsStarred(updatedIsFavorite);

      // 서버에 요청
      const response = await sendFavoriteEmoticon({
        isRegist: updatedIsFavorite,
        emoticonId: emoticonId ?? 0,
      });

      // 서버 응답으로 상태 업데이트
      if (response && response.data.emoticonId === emoticonId) {
        updateFavoriteStatus(emoticonId, updatedIsFavorite);
      }
    } catch (error) {
      console.error('Failed to update favorite status:', error);
      setIsStarred(isFavorite); // 실패 시 초기값으로 복구
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={e => e.stopPropagation()}>
        <div className={styles.topButtons}>
          <IconButton onClick={handleStarClick} sx={{color: 'yellow'}}>
            {isStarred ? <StarIcon /> : <StarBorderIcon />}
          </IconButton>
          <IconButton onClick={onClose} sx={{color: 'white'}}>
            <CloseIcon />
          </IconButton>
        </div>
        <img src={emojiUrl} alt="Selected Emoji" className={styles.emojiImage} onClick={onSend} />
      </div>
    </div>
  );
};

export default EmojiOverlayPopup;
