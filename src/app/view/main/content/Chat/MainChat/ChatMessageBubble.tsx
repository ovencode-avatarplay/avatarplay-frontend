import {Avatar, Box} from '@mui/material';
import ChatMessageMenuTop from './ChatContextMenuTop';
import ChatMessageMenuBottom from './ChatContextMenuBottom';
import React, {useEffect, useState} from 'react';
import styles from '../Styles/ChatMessageMenu.module.css';
// import ChatRegenerateGroupNav from './ChatRegenerateGroupNav';
import {MediaData, Message, MessageGroup, TriggerMediaState} from './ChatTypes';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';
import {EffectCards} from 'swiper/modules';
import ReactPlayer from 'react-player';
import ReactAudioPlayer from 'react-audio-player';

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
  const [questionTextMessage, setQuestionTextMessage] = useState(text);
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
          sx={{
            zIndex: selectedIndex === null ? 'auto' : index === selectedIndex ? 10 : 'auto',
            filter: selectedIndex === null ? 'none' : index === selectedIndex ? 'none' : 'blur(2px)', // 선택된 버블은 blur가 없음
            // pointerEvents: isSelected ? 'auto' : 'none', // 선택된 버블만 클릭 가능
          }}
        >
          <div className={styles.chatBubble}>
            {selectedIndex === index && checkCanOpenContextTop() && <ChatMessageMenuTop id={id} />}
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
                <Avatar
                  alt="Partner Avatar"
                  src={iconUrl}
                  sx={{
                    width: 32,
                    height: 32,
                    marginRight: 1,
                    border: '1px solid',
                    borderColor: 'black',
                  }}
                />
              )}

              {sender !== 'media' && (
                <Box
                  sx={{
                    display: 'inline-block',
                    padding: sender === 'system' ? '8px 55px' : '8px',
                    borderRadius: '8px',
                    maxWidth: sender === 'introPrompt' ? '100%' : sender === 'system' ? '100%' : '70%',
                    backgroundColor:
                      sender === 'introPrompt'
                        ? '#FFFFFF'
                        : sender === 'user' || sender === 'userNarration'
                        ? 'rgba(80, 80, 80, 0.8)'
                        : sender === 'partner' || sender === 'partnerNarration'
                        ? 'rgba(0, 0, 0, 0.8)'
                        : 'rgba(214, 214, 214, 0.2)',
                    border: sender === 'introPrompt' || sender === 'system' ? '1px solid #C0C0C0' : 'none',
                    backdropFilter: sender === 'system' ? 'blur(20px)' : 'none',
                    textAlign: sender === 'partnerNarration' || sender === 'userNarration' ? 'left' : 'inherit',
                    color:
                      sender === 'introPrompt'
                        ? '#000000'
                        : sender === 'system'
                        ? '#FFFFFF'
                        : sender === 'partnerNarration' || sender === 'userNarration'
                        ? '#B0B0B0'
                        : '#FFFFFF',
                    fontSize: sender === 'partnerNarration' || sender === 'system' ? '0.7em' : '0.8em',
                    fontWeight: sender === 'system' ? 'bold' : 'normal',
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                    textShadow:
                      sender === 'system'
                        ? '1px 1px 0 rgba(116, 116, 116, 1.0), -1px -1px 0 rgba(116, 116, 116, 1.0), 1px -1px 0 rgba(116, 116, 116, 1.0), -1px 1px 0 rgba(116, 116, 116, 1.0)'
                        : 'none',
                    marginLeft: sender === 'partnerNarration' ? '40px' : '0px',
                  }}
                  onClick={handleMenuOpen}
                >
                  {sender === 'user' && emoticonUrl !== '' && emoticonUrl !== undefined ? (
                    <img src={emoticonUrl} alt="Emoticon" style={{width: '24px', height: '24px', marginTop: '4px'}} />
                  ) : (
                    <div dangerouslySetInnerHTML={{__html: answerTextMessage}} />
                  )}
                </Box>
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
                  grabCursor={true}
                  modules={[EffectCards]}
                  className={styles.mySwiper}
                  style={{
                    width: '200px', // 원하는 가로 크기
                    height: 'auto', // 원하는 세로 크기
                    marginLeft: '10%',
                  }}
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
                  style={{
                    width: '100%',
                  }}
                >
                  <ReactPlayer
                    muted={true}
                    url={mediaData.mediaUrlList[0]} // 첫 번째 URL 사용
                    playing={true}
                    controls={true}
                    width="70%" // 비율 유지하며 높이 자동 조정
                    height="auto" // 비율 유지하며 높이 자동 조정
                    style={{
                      borderRadius: '8px',
                    }}
                  />
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
          </div>
        </Box>
      )}
      {/* {id === lastMessage.chatId && (sender === 'user' || sender === 'userNarration') && <ChatRegenerateGroupNav />} */}
    </>
  );
};

export default ChatMessageBubble;
