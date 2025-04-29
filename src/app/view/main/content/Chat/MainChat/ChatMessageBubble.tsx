import {backdropClasses, Box} from '@mui/material';
import ChatMessageMenuTop from './ChatContextMenuTop';
import ChatMessageMenuBottom from './ChatContextMenuBottom';
import React, {useEffect, useState} from 'react';
import styles from './ChatMessageBubble.module.css';
// import ChatRegenerateGroupNav from './ChatRegenerateGroupNav';
import {MediaData, Message, SenderType, TriggerMediaState} from './ChatTypes';
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/navigation';
import ReactPlayer from 'react-player';
import ReactAudioPlayer from 'react-audio-player';
import ChatMediaDialog from './ChatMediaDialog';
import Visualizer from './Visualizer';
import {checkChatSystemError} from '@/app/NetWork/ESystemError';
import ImageGrid from './ImageGrid';
import {BoldPlay} from '@ui/Icons';
import chatRewardItem from '@/data/dictionary/chatRewardItem.json';
import {RewardItem} from '../hooks/useChat';

interface ChatMessageBubbleProps {
  text: string;
  sender: 'user' | 'partner' | 'partnerNarration' | 'system' | 'introPrompt' | 'userNarration' | 'media' | 'newDate';
  id: number;
  iconUrl: string;
  index: number;
  bubbleIndex: number;
  isLike: boolean;
  emoticonUrl: string;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onClickLike: (id: number, index: number, like: boolean) => void;
  onTtsClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  setSelectedNull: () => void;
  selectedIndex: number | null;
  lastMessage: Message;
  mediaData: MediaData | null;
  createDate: string;
  prevSenderType: SenderType;
  level: number | null;
}

const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  text,
  sender,
  id,
  iconUrl,
  index,
  bubbleIndex,
  isLike,
  emoticonUrl,
  onClick,
  onClickLike,
  onTtsClick,
  setSelectedNull,
  selectedIndex,
  lastMessage,
  mediaData,
  createDate,
  prevSenderType,
  level,
}) => {
  const [answerTextMessage, setAnswerTextMessage] = useState(text);
  const handleMenuOpen = (e: React.MouseEvent<HTMLDivElement>) => {
    if (sender === 'system' || sender === 'introPrompt' || sender === 'newDate') {
      // System, IntroPrompt는 클릭되지 않게
    } else {
      onClick(e);
    }
  };
  const handleTtsClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onTtsClick(e);
  };

  const [isModalOpen, setModalOpen] = useState(false);
  const [videoDuration, setVideoDuration] = useState<string | null>(null);

  // 초를 분:초 형식으로 변환
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  const [selectImage, setSelectImage] = useState<number>(0);
  const handleMediaClick = (index: number = 0) => {
    if (
      mediaData &&
      (mediaData.mediaType === TriggerMediaState.TriggerVideo || mediaData.mediaType === TriggerMediaState.TriggerImage)
    ) {
      setSelectImage(index);
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

  const rewardItems = chatRewardItem as RewardItem[];

  return (
    <>
      {text !== '' && (
        <Box
          data-bubble
          className={
            selectedIndex === null ? styles.blurNone : index === selectedIndex ? styles.blurSelected : styles.blurBox
          }
        >
          <div className={styles.chatBubble}>
            <Box
              key={index}
              className={
                sender === 'user' || sender === 'userNarration'
                  ? styles.chatBubbleJustifyUser
                  : sender === 'partner' || sender === 'partnerNarration' || sender === 'media'
                  ? styles.chatBubbleProfilePartner
                  : sender === 'system' || sender === 'newDate'
                  ? styles.chatBubbleJustifySystem
                  : 'sender null error'
              }
            >
              {(sender === 'partner' || sender === 'media') && (
                <div
                  className={styles.rewardBorderWrapper}
                  style={{
                    background:
                      level !== null
                        ? level >= 60
                          ? rewardItems[3].border
                          : level >= 40
                          ? rewardItems[2].border
                          : level >= 20
                          ? rewardItems[1].border
                          : rewardItems[0].border
                        : 'transparent',
                    padding: '4px',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    boxSizing: 'content-box',
                    alignContent: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img alt="Partner Avatar" src={iconUrl} className={styles.AvatarIcon} />
                </div>
              )}
              <Box className={styles.chatBubbleJustifyPartner}>
                {selectedIndex === index && index !== 1 && checkCanOpenContextTop() && (
                  <ChatMessageMenuTop
                    id={id}
                    index={bubbleIndex}
                    isLike={isLike}
                    onClickLike={onClickLike}
                    closeAction={() => setSelectedNull()}
                  />
                )}
                {sender !== 'media' && (
                  <div
                    className={`${
                      sender === 'system'
                        ? checkChatSystemError(text)
                          ? styles.chatBackSystemError
                          : styles.chatBackSystem
                        : sender === 'introPrompt'
                        ? styles.chatBackIntro
                        : sender === 'user'
                        ? styles.chatBackUser
                        : sender === 'userNarration'
                        ? styles.chatBackUserNarration
                        : sender === 'partner'
                        ? styles.chatBackPartner
                        : sender === 'partnerNarration'
                        ? styles.chatBackPartnerNarration
                        : sender === 'newDate'
                        ? styles.chatBackNewDate
                        : styles.chatBackDefault
                    }
                      ${
                        sender === 'system' ? (prevSenderType === 'system' ? styles.systemGap1 : styles.systemGap2) : ''
                      }
                      `}
                    onClick={handleMenuOpen}
                    style={{
                      backgroundColor:
                        sender === 'partner' && level !== null
                          ? level >= 65
                            ? rewardItems[3].color
                            : level >= 35
                            ? rewardItems[2].color
                            : level >= 15
                            ? rewardItems[1].color
                            : rewardItems[0].color
                          : undefined,
                    }}
                  >
                    {sender === 'user' && emoticonUrl !== '' && emoticonUrl !== undefined ? (
                      <img src={emoticonUrl} alt="Emoticon" style={{width: '24px', height: '24px', marginTop: '4px'}} />
                    ) : (
                      <div dangerouslySetInnerHTML={{__html: answerTextMessage}} />
                    )}
                  </div>
                )}
                {selectedIndex === index && checkCanOpenContextBottom() && (
                  <ChatMessageMenuBottom
                    text={text}
                    id={id}
                    onTtsClick={e => {
                      handleTtsClick(e);
                    }}
                    // onDelete={handleDeleteAnswer}
                    // onModified={handleAnswerModify}
                    isUserChat={sender === 'user' || sender === 'userNarration'}
                    lastMessageId={lastMessage.chatId}
                  />
                )}
                {sender === 'media' && mediaData && mediaData.mediaType === TriggerMediaState.TriggerImage && (
                  <ImageGrid urls={mediaData.mediaUrlList} onClick={handleMediaClick}></ImageGrid>
                )}

                {/* 비디오 출력 */}
                {sender === 'media' && mediaData && mediaData.mediaType === TriggerMediaState.TriggerVideo && (
                  <div className={styles.mediaVideo}>
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%', // 원하는 높이로 설정
                        position: 'relative',
                      }}
                    >
                      {/* ReactPlayer */}
                      {mediaData && mediaData.mediaType === TriggerMediaState.TriggerVideo && (
                        <ReactPlayer
                          muted={true}
                          url={mediaData.mediaUrlList[0]} // 첫 번째 URL 사용
                          width="100%" // 비율 유지하며 너비 자동 조정
                          height="100%" // 비율 유지하며 높이 자동 조정
                          style={{
                            borderRadius: '8px',
                          }}
                          onDuration={(duration: number) => setVideoDuration(formatDuration(duration))} // 영상 길이 설정
                        ></ReactPlayer>
                      )}

                      {/* Play 버튼 */}

                      <div className={styles.playButtonWrapper} onClick={() => handleMediaClick()}>
                        <div className={styles.playButton}>
                          <img src={BoldPlay.src} style={{width: '17px', height: '17px'}} />
                        </div>
                        <p className={styles.videoDuration}>
                          {videoDuration || '0:00'} {/* 영상 길이가 없으면 기본값 0:00 */}
                        </p>
                      </div>
                    </Box>
                  </div>
                )}
                {/* 오디오 출력 */}
                {sender === 'media' && mediaData && mediaData.mediaType === TriggerMediaState.TriggerAudio && (
                  <Box
                    style={{
                      width: '100%',
                    }}
                  >
                    <Visualizer url={mediaData.mediaUrlList[0]}></Visualizer>
                  </Box>
                )}
              </Box>
              <div
                className={`${styles.dateTimeBoxBase} ${
                  sender === 'user' || sender === 'userNarration'
                    ? styles.dateTimeBoxUser
                    : sender === 'partner' || sender === 'partnerNarration' || sender === 'media'
                    ? ''
                    : styles.dateTimeBoxHide
                }`}
              >
                <div className={styles.dateTimeText}>{createDate}</div>
              </div>
            </Box>
          </div>
        </Box>
      )}
      {/* {id === lastMessage.chatId && (sender === 'user' || sender === 'userNarration') && <ChatRegenerateGroupNav />} */}

      {sender === 'media' &&
        mediaData &&
        (mediaData.mediaType === TriggerMediaState.TriggerVideo ||
          mediaData.mediaType === TriggerMediaState.TriggerImage) && (
          <ChatMediaDialog
            mediaData={mediaData}
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            type={mediaData?.mediaType}
            initNum={selectImage}
          />
        )}
    </>
  );
};
export default React.memo(ChatMessageBubble, (prev, next) => {
  return (
    prev.text === next.text &&
    prev.sender === next.sender &&
    prev.id === next.id &&
    prev.selectedIndex === next.selectedIndex &&
    prev.lastMessage?.chatId === next.lastMessage?.chatId
  );
});
