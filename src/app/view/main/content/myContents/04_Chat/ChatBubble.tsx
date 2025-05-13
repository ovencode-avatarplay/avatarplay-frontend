import React, {useEffect, useState} from 'react';
import styles from './ChatBubble.module.css';
import Avatar from '@mui/material/Avatar';
import {useAtom} from 'jotai';
import {isBlurModeAtom, selectedBubbleIdAtom} from './ChatAtom';
import zIndex from '@mui/material/styles/zIndex';
import CustomContextDropDown, {DropdownItem} from '@/components/layout/shared/CustomContextDropDown';
import {BoldTranslator, LineArrowSwap, LineCopy, LineDelete, LineEdit, LinePreview} from '@ui/Icons';
import {MediaState} from '@/app/NetWork/ChatMessageNetwork';
import {pushLocalizedRoute} from '@/utils/UrlMove';
import {useRouter} from 'next/navigation';
import {useSignalR} from '@/hooks/useSignalR';
import {ChatState} from '@/app/NetWork/ChatNetwork';
import {ToastMessageAtom, ToastType} from '@/app/Root';

interface ChatBubbleProps {
  sender: 'me' | 'other';
  content: string;
  timestamp: string;
  isItalic?: boolean;
  profileImage?: string;
  id: number;
  mediaType?: MediaState;
  mediaUrl?: string;
  profileUrlLinkKey: string;
  isDeleted?: boolean;
  chatState: ChatState;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  sender,
  content,
  timestamp,
  isItalic = false,
  profileImage = '/images/profile_sample/img_sample_feed1.png',
  id,
  mediaType,
  mediaUrl,
  profileUrlLinkKey,
  isDeleted = false,
  chatState,
}) => {
  const isMe = sender === 'me';
  const [isBlurMode, setBlurMode] = useAtom(isBlurModeAtom);
  const [selectedBubbleId, setSelectedBubbleId] = useAtom(selectedBubbleIdAtom);
  const [localIsDeleted, setLocalIsDeleted] = useState(isDeleted);
  const [localChatState, setLocalChatState] = useState(chatState);

  const jwt = localStorage.getItem('jwt');
  const {deleteMessage} = useSignalR(jwt || '');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [dataToast, setDataToast] = useAtom(ToastMessageAtom);
  const handleDelete = async () => {
    if (localChatState === ChatState.Delete) {
      dataToast.open('이미 삭제된 메시지입니다.', ToastType.Error);
      console.log('이미 삭제된 메시지입니다.');
      return;
    }

    try {
      await deleteMessage(id);
      setLocalIsDeleted(true);
      setLocalChatState(ChatState.Delete);
      setIsMenuOpen(false);
      setBlurMode(false);
      setSelectedBubbleId(null);
    } catch (error) {
      console.error('메시지 삭제 실패:', error);
    }
  };

  const items: DropdownItem[] = [
    {
      label: 'Copy',
      onClick: () => {}, // TODO
      icon: LineCopy.src,
    },
    {
      label: 'Delete',
      onClick: handleDelete,
      icon: LineDelete.src,
      iconStyle: {
        filter:
          'brightness(0) saturate(100%) invert(53%) sepia(93%) saturate(1308%) hue-rotate(321deg) brightness(92%) contrast(110%)',
      },
      labelStyle: {color: '#F75555'},
    },
  ];

  const handleClick = () => {
    if (isMe && localChatState === ChatState.Create) {
      setBlurMode(!isBlurMode);
      setSelectedBubbleId(id);
    }
  };

  useEffect(() => {
    if (selectedBubbleId === id) {
      setIsMenuOpen(isBlurMode && isMe);
    } else {
      setIsMenuOpen(false);
    }
  }, [isBlurMode, selectedBubbleId, id, isMe]);

  const renderMedia = () => {
    if (!mediaUrl) return null;
    if (mediaType === MediaState.Image) {
      return <img src={mediaUrl} alt="uploaded" className={styles.chatMediaImage} />;
    }

    if (mediaType === MediaState.Video) {
      return (
        <video controls className={styles.chatMediaVideo}>
          <source src={mediaUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (mediaType === MediaState.Audio) {
      return (
        <audio controls className={styles.chatMediaAudio}>
          <source src={mediaUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      );
    }

    return null;
  };

  const router = useRouter();

  return (
    <div className={`${styles.messageWrapper} ${isMe ? styles.right : styles.left}`}>
      {!isMe && (
        <Avatar
          src={profileImage}
          sx={{width: 32, height: 32}}
          onClick={() => {
            pushLocalizedRoute('/profile/' + profileUrlLinkKey + '?indexTab=1', router);
          }}
        />
      )}
      <div className={styles.bubbleBlock}>
        {isMe && timestamp && <span className={styles.timestamp}>{timestamp}</span>}
        {mediaUrl && !localIsDeleted ? (
          renderMedia()
        ) : (
          <div
            className={`${styles.bubble} ${isMe ? styles.myBubble : styles.otherBubble}`}
            style={{
              zIndex: isBlurMode && selectedBubbleId === id ? 1 : 0,
              position: 'relative',
            }}
            onClick={handleClick}
          >
            <p className={isItalic ? styles.italic : ''}>{localIsDeleted ? '메시지가 삭제되었습니다' : content}</p>
          </div>
        )}
        {!isMe && timestamp && <span className={styles.timestamp}>{timestamp}</span>}
      </div>
      {!localIsDeleted && (
        <CustomContextDropDown
          open={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          items={items}
          style={{
            position: 'absolute',
            top: '100%',
            marginTop: '15px',
            zIndex: 1000,
            maxWidth: '160px',
            ...(!isMe && {left: '40px'}),
          }}
        />
      )}
    </div>
  );
};

export default ChatBubble;
