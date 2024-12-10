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
  createDate: Date;
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
  createDate,
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

  return (
    <>
      {text !== '' && (
        <Box
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
                  : sender === 'partner' || sender === 'partnerNarration'
                  ? styles.chatBubbleProfilePartner
                  : styles.chatBubbleJustifySystem
              }
            >
              {(sender === 'partner' || sender === 'media') && (
                <Avatar alt="Partner Avatar" src={iconUrl} className={styles.AvatarIcon} />
              )}
              <Box className={styles.chatBubbleJustifyPartner}>
                {selectedIndex === index && checkCanOpenContextTop() && <ChatMessageMenuTop id={id} />}
                {sender !== 'media' && (
                  <div
                    className={
                      sender === 'system'
                        ? styles.chatBackSystem
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
                        : styles.chatBackDefault
                    }
                    onClick={handleMenuOpen}
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
                  <Swiper
                    effect={'cards'}
                    grabCursor={false}
                    modules={[EffectCards]}
                    className={styles.mySwiper}
                    style={{
                      width: '100px', // 원하는 가로 크기
                      height: 'auto', // 원하는 세로 크기
                      marginLeft: '10%',
                    }}
                    loop={false} // 루프 비활성화 (슬라이드가 끝나면 멈춤)
                    freeMode={false} // 자유 모드 비활성화
                    allowSlideNext={false} // 슬라이드 이동 방지
                    allowSlidePrev={false} // 슬라이드 이동 방지
                    onClick={handleMediaClick}
                  >
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

                {/* 비디오 출력 */}
                {sender === 'media' && mediaData && mediaData.mediaType === TriggerMediaState.TriggerVideo && (
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: 'auto', // 원하는 높이로 설정
                    }}
                  >
                    {/* ReactPlayer */}
                    {mediaData && mediaData.mediaType === TriggerMediaState.TriggerVideo && (
                      <ReactPlayer
                        muted={true}
                        url={mediaData.mediaUrlList[0]} // 첫 번째 URL 사용
                        width="70%" // 비율 유지하며 너비 자동 조정
                        height="auto" // 비율 유지하며 높이 자동 조정
                        style={{
                          borderRadius: '8px',
                        }}
                      />
                    )}

                    {/* Play 버튼 */}
                    <IconButton
                      onClick={handleMediaClick}
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '35%', // ReactPlayer width 70%를 고려하여 중앙에 배치
                        transform: 'translate(-50%, -50%)', // 중앙 정렬
                        color: 'white', // 아이콘 색상
                        fontSize: 48, // 아이콘 크기
                        zIndex: 10, // 다른 요소 위에 표시
                      }}
                    >
                      <PlayCircleIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                )}
                {/* 오디오 출력 */}
                {sender === 'media' && mediaData && mediaData.mediaType === TriggerMediaState.TriggerAudio && (
                  <Box
                    style={{
                      width: '100%',
                    }}
                  >
                    <ReactAudioPlayer
                      src={mediaData.mediaUrlList[0]}
                      controls // 재생 컨트롤 활성화
                      style={{
                        borderRadius: '8px',
                      }}
                    />
                  </Box>
                )}
              </Box>
              <div
                className={`${styles.dateTimeBoxBase} ${
                  sender === 'user' || sender === 'userNarration'
                    ? styles.dateTimeBoxUser
                    : sender === 'partner' || sender === 'partnerNarration'
                    ? ''
                    : styles.dateTimeBoxHide
                }`}
              >
                <div className={styles.dateTimeText}>
                  {createDate.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true})}
                </div>
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
          />
        )}
    </>
  );
};

export default ChatMessageBubble;
