import React, {useState, useEffect} from 'react';
import styles from './EmojiOverlayPopup.module.css';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import {sendFavoriteEmoticon} from '@/app/NetWork/ChatNetwork';

interface EmojiOverlayPopupProps {
  isOpen: boolean;
  emojiUrl: string;
  onClose: () => void;
  isFavorite: boolean;
  emoticonId: string | null;
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

  // 별 상태 초기화 (isFavorite 값에 따라)
  useEffect(() => {
    setIsStarred(isFavorite);
  }, [isFavorite]);
  const parsedEmoticonId = parseInt(emoticonId ?? '0', 10);
  const handleStarClick = async () => {
    try {
      const updatedIsFavorite = !isStarred; // 현재 상태 반대로 설정
      setIsStarred(updatedIsFavorite);

      // API 호출하여 즐겨찾기 상태 업데이트
      await sendFavoriteEmoticon({
        isRegist: updatedIsFavorite, // 별을 켜면 true, 끄면 false
        emoticonId: parsedEmoticonId,
      });
      console.log(`Emoticon ID ${emoticonId} favorite status updated successfully.`);
    } catch (error) {
      console.error('Failed to update favorite status:', error);
      setIsStarred(!isStarred); // 오류 발생 시 상태 원상복구
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
