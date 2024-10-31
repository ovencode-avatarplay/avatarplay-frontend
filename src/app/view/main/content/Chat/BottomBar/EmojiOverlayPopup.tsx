import React, {useState} from 'react';
import styles from './EmojiOverlayPopup.module.css';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

interface EmojiOverlayPopupProps {
  isOpen: boolean;
  emojiUrl: string;
  onClose: () => void;
  onStar: () => void;
  onSend: () => void;
}

const EmojiOverlayPopup: React.FC<EmojiOverlayPopupProps> = ({isOpen, emojiUrl, onClose, onStar, onSend}) => {
  const [isStarred, setIsStarred] = useState(false);

  if (!isOpen) return null;

  const handleStarClick = () => {
    setIsStarred(!isStarred);
    onStar(); // 스타 상태 변경 시 onStar 함수 호출
  };

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
        <img
          src={emojiUrl}
          alt="Selected Emoji"
          className={styles.emojiImage}
          onClick={onSend} // 이모티콘 클릭 시 전송
        />
      </div>
    </div>
  );
};

export default EmojiOverlayPopup;
