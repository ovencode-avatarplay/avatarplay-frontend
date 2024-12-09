import React, {useEffect, useState} from 'react';
import {Box, TextField, IconButton, InputAdornment, Button, Typography, Grow} from '@mui/material';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import CloseIcon from '@mui/icons-material/Close';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import {RootState} from '@/redux-store/ReduxStore';
import {useSelector, useDispatch} from 'react-redux';
import {setIsRegeneratingQuestion} from '@/redux-store/slices/ModifyQuestion';
import AIRecommendImg from '@ui/chatting/btn_ai_recommend.png';
import AI_Recommend from './AI_Recommend';
import styles from './ChatBar.module.css';
import {AI, AiText, BotMessage, BotSend, Chat, Description, Plus, Recording1, Send} from '@ui/chatting';

interface ChatBarProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  onSend: (messages: string) => void;
  toggleExpand: () => void;
  isExpanded: boolean;
  handleKeyDown: (event: React.KeyboardEvent) => void;
  isHideChat: boolean;
  onToggleBackground: () => void;
  onLoading: (isLoading: boolean) => void;
  onUpdateChatBarCount: (count: number) => void;
  onRemoveChat: (removeId: number) => void;
}

const ChatBar: React.FC<ChatBarProps> = ({
  message,
  setMessage,
  onSend,
  toggleExpand,
  handleKeyDown,
  isHideChat,
  onToggleBackground,
  onLoading,
  onUpdateChatBarCount,
  onRemoveChat,
}) => {
  const [chatBars, setChatBars] = useState<string[]>(['main']);
  const [inputValues, setInputValues] = useState<{[key: string]: string}>({main: ''});
  const [toggledIcons, setToggledIcons] = useState<{[key: string]: boolean}>({main: false});
  const [isAIRecommendOpen, setAIRecommendOpen] = useState(false);

  const dispatch = useDispatch();
  const isRegeneratingQuestion = useSelector((state: RootState) => state.modifyQuestion.isRegeneratingQuestion);
  const regenerateQuestion = useSelector((state: RootState) => state.modifyQuestion.regeneratingQuestion);
  const [parsedModifyText, setParsedModifyText] = useState<string>('');

  useEffect(() => {
    onUpdateChatBarCount(chatBars.length);
  }, [chatBars]);

  useEffect(() => {
    updateMessageText();
  }, [toggledIcons, inputValues]);

  useEffect(() => {
    if (isRegeneratingQuestion) {
      const parts = regenerateQuestion.text.split('⦿SYSTEM_CHAT⦿');
      const mainPart = parts[parts.length - 1];
      const partsExcludingMain = parts.slice(0, parts.length - 1);
      const additionalParts = partsExcludingMain.slice(0);

      setChatBars([...additionalParts.map((_, index) => `chatBar-${Date.now() + index}`), 'main']);

      const newInputValues: {[key: string]: string} = {main: mainPart.replace(/\*/g, '')};
      additionalParts.forEach((part, index) => {
        newInputValues[`chatBar-${Date.now() + index}`] = part.replace(/\*/g, ''); // Remove asterisks
      });
      setInputValues(newInputValues);
      setToggledIcons({
        main: mainPart.includes('*'),
        ...additionalParts.reduce((acc, part, index) => {
          acc[`chatBar-${Date.now() + index}`] = part.includes('*');
          return acc;
        }, {} as {[key: string]: boolean}),
      });

      // 최종 텍스트
      const parsedText = parts.map(part => part.replace(/\*/g, '')).join(' ');

      setParsedModifyText(parsedText);
    } else {
      setInputValues({main: ''});
    }
  }, [isRegeneratingQuestion]);

  const addChatBar = () => {
    if (chatBars.length >= 5) return;
    const newId = `chatBar-${Date.now()}`;
    const newContent = inputValues.main;

    const newMainIconState = !toggledIcons.main;
    setChatBars(prevBars => {
      const mainIndex = prevBars.length - 1;
      return [...prevBars.slice(0, mainIndex), newId, ...prevBars.slice(mainIndex)];
    });

    setInputValues(prevValues => ({...prevValues, [newId]: newContent, main: ''}));
    setToggledIcons(prevIcons => ({
      ...prevIcons,
      main: newMainIconState,
      [newId]: toggledIcons.main,
    }));
  };

  const removeChatBar = (id: string) => {
    setChatBars(chatBars.filter(barId => barId !== id));
    setInputValues(prevValues => {
      const updatedValues = {...prevValues};
      delete updatedValues[id];
      return updatedValues;
    });
    setToggledIcons(prevIcons => {
      const updatedIcons = {...prevIcons};
      delete updatedIcons[id];
      return updatedIcons;
    });
  };

  const handleInputChange = (id: string, value: string) => {
    setInputValues(prevValues => ({...prevValues, [id]: value}));
  };

  const updateMessageText = () => {
    const orderedValues = chatBars
      .map(id => {
        const value = inputValues[id] || '';
        return toggledIcons[id] ? `*${value}*` : `${value}`;
      })
      .join('⦿SYSTEM_CHAT⦿');

    setMessage(orderedValues);
  };

  const toggleIcon = (id: string) => {
    setToggledIcons(prevIcons => ({...prevIcons, [id]: !prevIcons[id]}));
  };

  const handleSend = async () => {
    handleSendMessage(message);
  };

  const handleSendMessage = (messages: string) => {
    if (message == '' || message == null) return;
    onLoading(true);
    if (!isRegeneratingQuestion) {
      onSend(messages);
    } else {
      console.log('질문 편집 요청' + regenerateQuestion.id + ' : ' + regenerateQuestion.text + '  to => ' + message);

      // ChatArea에 올라와있는 ChatBubble에서 id로 찾아서 지우기.
      onRemoveChat(regenerateQuestion.id);

      onSend(messages);

      dispatch(setIsRegeneratingQuestion(false));
    }
    // 컴포넌트를 초기 상태로 되돌림
    setChatBars(['main']); // main 이외의 모든 채팅바 제거
    setInputValues({main: ''}); // 모든 입력값을 빈 문자열로 초기화
    setToggledIcons({main: false}); // 모든 토글 상태를 기본값으로 초기화
    setMessage(''); // message 상태 초기화
  };

  const handleKeyDownInternal = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      if (message == '' || message == null) return;
      const cleanedMessages = message
        .replace(/⦿SYSTEM_CHAT⦿/g, '')
        .replace(/\*/g, '')
        .trim();
      if (cleanedMessages == '' || cleanedMessages == null) return;

      event.preventDefault();
      handleSendMessage(message);
    }
    handleKeyDown(event);
  };

  const handleFocus = () => {
    if (isHideChat) {
      onToggleBackground();
    }
  };

  const handleCancelModifyText = () => {
    dispatch(setIsRegeneratingQuestion(false));

    setChatBars(['main']);
    setInputValues({main: ''});
    setToggledIcons({main: false});
  };

  const handleAIRecommend = () => {
    setAIRecommendOpen(true);
  };

  const closeAIRecommend = () => {
    setAIRecommendOpen(false);
  };

  const selectMessageFromAIRecommend = (_message: string, isSend: boolean) => {
    setInputValues(prevValues => ({...prevValues, main: _message}));
    //handleSend(); // Automatically send the selected AI message
    //console.log('_message', _message);
    setAIRecommendOpen(false); // Close the AI recommendation modal
    if (isSend === true) {
      handleSendMessage(_message);
    }
  };

  const renderChatBars = () =>
    chatBars.map((id, index) => (
      <div className={styles.chatBox} key={id}>
        {index === chatBars.length - 1 && (
          <button className={styles.commonButton} onClick={toggleExpand}>
            <img src={Plus.src} />
          </button>
        )}
        <div className={styles.inputBox}>
          {toggledIcons[id] ? (
            <img src={BotMessage.src} onClick={() => toggleIcon(id)} />
          ) : (
            <img src={Description.src} onClick={() => toggleIcon(id)} />
          )}
          <input
            placeholder={'Type your message...'}
            onFocus={handleFocus}
            value={inputValues[id]}
            onChange={e => handleInputChange(id, e.target.value)}
            onKeyDown={handleKeyDownInternal}
            className={styles.textField}
          />
          {id !== 'main' ? (
            <IconButton onClick={() => removeChatBar(id)}>
              <CloseIcon />
            </IconButton>
          ) : (
            <Box display="flex">
              {Object.values(inputValues).every(value => value.trim() === '') ? (
                <button className={styles.commonButton} onClick={handleAIRecommend}>
                  <img src={AiText.src} alt="AI Recommend" />
                </button>
              ) : (
                <button className={styles.commonButton} onClick={handleSend}>
                  <img src={BotSend.src} alt="AI Recommend" />
                </button>
              )}
            </Box>
          )}
        </div>
        {id === 'main' && (
          <Box display="flex">
            {Object.values(inputValues).every(value => value.trim() === '') ? (
              <button
                className={styles.commonButton}
                onClick={() => {
                  /*아직 미구현*/
                }}
              >
                <img src={Recording1.src} alt="AI Recommend" />
              </button>
            ) : (
              <button className={styles.commonButton} onClick={addChatBar}>
                <img src={Chat.src} alt="AI Recommend" />
              </button>
            )}
          </Box>
        )}
      </div>
    ));

  return (
    <Box>
      {isRegeneratingQuestion ? (
        <Box>
          <Typography>Modify Question</Typography>
          <Box display="flex" alignItems="center">
            <Typography
              variant="body1"
              sx={{
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#f5f5f5',
                width: '100%',
              }}
            >
              {parsedModifyText}
            </Typography>
            <Button onClick={handleCancelModifyText}>Cancel</Button>
          </Box>
          {renderChatBars()}
        </Box>
      ) : (
        <Box>{renderChatBars()}</Box>
      )}
      {/* AI 추천 모달 */}
      <AI_Recommend
        open={isAIRecommendOpen}
        onClose={closeAIRecommend}
        onSelectMessage={selectMessageFromAIRecommend}
      />
    </Box>
  );
};

export default ChatBar;
