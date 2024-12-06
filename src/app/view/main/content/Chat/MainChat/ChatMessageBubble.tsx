import {Avatar, Box, IconButton} from '@mui/material';
import ChatMessageMenuTop from './ChatContextMenuTop';
import ChatMessageMenuBottom from './ChatContextMenuBottom';
import React, {useEffect, useState} from 'react';
import styles from './ChatMessageBubble.module.css';
// import ChatRegenerateGroupNav from './ChatRegenerateGroupNav';
import {MediaData, Message, TriggerMediaState} from './ChatTypes';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/navigation';
import {EffectCards} from 'swiper/modules';
import ReactPlayer from 'react-player';
import ReactAudioPlayer from 'react-audio-player';
import ChatMediaDialog from './ChatMediaDialog';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
interface ChatMessageBubbleProps {
  text: string;
  sender: 'user' | 'partner' | 'partnerNarration' | 'system' | 'introPrompt' | 'userNarration' | 'media';
  id: number;
  iconUrl: string;
  index: number;
  emoticonUrl: string;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onTtsClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  selectedIndex: number | null;
  lastMessage: Message;
  mediaData: MediaData | null;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  text,
  sender,
  id,
  iconUrl,
  index,
  emoticonUrl,
  onClick,
  onTtsClick,
  selectedIndex,
  lastMessage,
  mediaData,
}) => {
  const [answerTextMessage, setAnswerTextMessage] = useState(text);
  const handleMenuOpen = (e: React.MouseEvent<HTMLDivElement>) => {
    if (sender === 'system' || sender === 'introPrompt') {
      // System, IntroPrompt는 클릭되지 않게
    } else {
      onClick(e);
    }
  };
  const handleTtsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onTtsClick(e);
  };

  const [isModalOpen, setModalOpen] = useState(false);

  const handleMediaClick = () => {
    if (
      mediaData &&
      (mediaData.mediaType === TriggerMediaState.TriggerVideo || mediaData.mediaType === TriggerMediaState.TriggerImage)
    ) {
      setModalOpen(true);
    }
  };

  const closeModal = () => setModalOpen(false);

  //#region  사용 안하기로 기획 변경
  // const handleDeleteAnswer = () => {
  //   setAnswerTextMessage('');
  // };
  // const handleAnswerModify = (newText: string) => {
  //   setAnswerTextMessage(newText);
  // };
  //#endregion

  const checkCanOpenContextTop = (): boolean => {
    if (sender === 'user' || sender === 'userNarration' || sender === 'introPrompt' || sender === 'system')
      return false;
    return true;
  };
  const checkCanOpenContextBottom = (): boolean => {
    if (sender === 'system' || sender === 'introPrompt') return false;
    return true;
  };

  useEffect(() => {
    setAnswerTextMessage(text);
  }, [text]);

  const getChatBoxStyle = () => {
    switch (sender) {
      case 'user':
      case 'userNarration':
        return styles.userChat;
      case 'partner':
      case 'partnerNarration':
        return styles.partnerChat;
      case 'system':
        return styles.systemChat;
      case 'introPrompt':
        return styles.introPromptChat;
      default:
        return '';
    }
  };

  return (
    <>
      {text && (
        <Box
          sx={{
            zIndex: selectedIndex === null ? 'auto' : index === selectedIndex ? 10 : 'auto',
            filter: selectedIndex === null ? 'none' : index === selectedIndex ? 'none' : 'blur(2px)',
          }}
        >
          <div className={styles.chatBubble}>
            {selectedIndex === index && sender !== 'system' && <ChatMessageMenuTop id={id} />}
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent:
                  sender === 'user' || sender === 'userNarration'
                    ? 'flex-end'
                    : sender === 'partner' || sender === 'partnerNarration'
                    ? 'flex-start'
                    : 'center',
                marginBottom: 2,
              }}
            >
              {(sender === 'partner' || sender === 'media') && (
                <Avatar alt="Partner Avatar" src={iconUrl} className={styles.partnerAvatar} />
              )}

              {sender !== 'media' && (
                <Box className={`${styles.chatBox} ${getChatBoxStyle()}`} onClick={handleMenuOpen}>
                  {sender === 'user' && emoticonUrl ? (
                    <img src={emoticonUrl} alt="Emoticon" style={{width: '24px', height: '24px', marginTop: '4px'}} />
                  ) : (
                    <div dangerouslySetInnerHTML={{__html: answerTextMessage}} />
                  )}
                </Box>
              )}

              {selectedIndex === index && sender !== 'system' && (
                <ChatMessageMenuBottom
                  text={text}
                  id={id}
                  onTtsClick={handleTtsClick}
                  isUserChat={sender === 'user' || sender === 'userNarration'}
                  lastMessageId={lastMessage.chatId}
                />
              )}

              {sender === 'media' && mediaData && mediaData.mediaType === TriggerMediaState.TriggerImage && (
                <Swiper effect={'cards'} grabCursor={false} modules={[EffectCards]} className={styles.mediaSwiper}>
                  {mediaData.mediaUrlList.map((url, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={url}
                        alt={`Media ${idx}`}
                        style={{width: '100%', height: 'auto', borderRadius: '8px'}}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}

              {sender === 'media' && mediaData && mediaData.mediaType === TriggerMediaState.TriggerVideo && (
                <Box className={styles.reactPlayerContainer}>
                  <ReactPlayer
                    muted
                    url={mediaData.mediaUrlList[0]}
                    width="100%"
                    height="auto"
                    style={{borderRadius: '8px'}}
                  />
                  <IconButton className={styles.playButton} onClick={handleMediaClick}>
                    <PlayCircleIcon fontSize="inherit" />
                  </IconButton>
                </Box>
              )}

              {sender === 'media' && mediaData && mediaData.mediaType === TriggerMediaState.TriggerAudio && (
                <ReactAudioPlayer src={mediaData.mediaUrlList[0]} controls className={styles.audioPlayer} />
              )}
            </Box>
          </div>
        </Box>
      )}
      {sender === 'media' &&
        mediaData &&
        (mediaData.mediaType === TriggerMediaState.TriggerVideo ||
          mediaData.mediaType === TriggerMediaState.TriggerImage) && (
          <ChatMediaDialog
            mediaData={mediaData}
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            type={mediaData.mediaType}
          />
        )}
    </>
  );
};

export default ChatMessageBubble;
