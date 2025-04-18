import React, {useEffect, useState} from 'react';
import styles from './ChatBubble.module.css';
import Avatar from '@mui/material/Avatar';
import {useAtom} from 'jotai';
import {isBlurModeAtom, selectedBubbleIdAtom} from './ChatBlurAtom';
import zIndex from '@mui/material/styles/zIndex';
import CustomContextDropDown, {DropdownItem} from '@/components/layout/shared/CustomContextDropDown';
import {LineArrowSwap, LineEdit, LinePreview} from '@ui/Icons';

const items: DropdownItem[] = [
  {
    label: 'Rename',
    onClick: () => {}, // TODO
    icon: LineEdit.src,
  },
  {
    label: 'Change Order',
    onClick: () => {}, // TODO
    icon: LineArrowSwap.src,
    iconStyle: {transform: 'rotate(90deg)'},
  },
  {
    label: 'Preview this Episode',
    onClick: () => {}, // TODO
    icon: LinePreview.src,
  },
];

interface ChatBubbleProps {
  sender: 'me' | 'other';
  content: string;
  timestamp: string;
  isItalic?: boolean;
  profileImage?: string;
  id: number;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  sender,
  content,
  timestamp,
  isItalic = false,
  profileImage = '/images/profile_sample/img_sample_feed1.png',
  id,
}) => {
  const isMe = sender === 'me';
  const [isBlurMode, setBlurMode] = useAtom(isBlurModeAtom);
  const [selectedBubbleId, setSelectedBubbleId] = useAtom(selectedBubbleIdAtom);
  const handleClick = () => {
    setBlurMode(!isBlurMode);
    setSelectedBubbleId(id);
  };

  useEffect(() => {
    if (selectedBubbleId === id) {
      setIsMenuOpen(isBlurMode);
    } else {
      setIsMenuOpen(false);
    }
    console.log('asdad');
  }, [isBlurMode]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className={`${styles.messageWrapper} ${isMe ? styles.right : styles.left}`} onClick={() => handleClick()}>
      {!isMe && <Avatar src={profileImage} sx={{width: 32, height: 32}} />}
      <div className={styles.bubbleBlock}>
        {/* 나면 타임스탬프 왼쪽, 아니면 오른쪽 */}
        {isMe && timestamp && <span className={styles.timestamp}>{timestamp}</span>}
        <div
          className={`${styles.bubble} ${isMe ? styles.myBubble : styles.otherBubble}`}
          style={{
            zIndex: isBlurMode && selectedBubbleId == id ? 1 : 0,
            position: 'relative',
          }}
        >
          <p className={isItalic ? styles.italic : ''}>{content}</p>
        </div>
        {!isMe && timestamp && <span className={styles.timestamp}>{timestamp}</span>}
      </div>
      <CustomContextDropDown
        open={isMenuOpen}
        onClose={close}
        items={items}
        style={{
          position: 'absolute',
          top: '100%',
          marginTop: '15px',
          zIndex: 1000,
        }}
      />
    </div>
  );
};

export default ChatBubble;
