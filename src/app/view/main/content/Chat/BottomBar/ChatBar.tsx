import React, {useEffect, useState} from 'react';
import {Box, TextField} from '@mui/material';
import {RootState} from '@/redux-store/ReduxStore';
import {useSelector, useDispatch} from 'react-redux';
import {setIsRegeneratingQuestion} from '@/redux-store/slices/ModifyQuestion';
import AI_Recommend from './AI_Recommend';
import styles from './ChatBar.module.css';
import {AiText, BotMessage, BotSend, Chat, Close, Description, Plus, Recording1} from '@ui/chatting';

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
  onUpdateAiBarCount: (count: number) => void;
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
  onUpdateAiBarCount,
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

  const [aiHeight, setAiHeight] = useState<number>(0);

  const handleHeightChange = (newHeight: number) => {
    setAiHeight(newHeight);
  };

  useEffect(() => {
    onUpdateChatBarCount(chatBars.length);
  }, [chatBars]);

  useEffect(() => {
    onUpdateAiBarCount(aiHeight);
  }, [aiHeight]);

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
    if (chatBars.length >= 6) return;
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
  const addChatBarIndata = (content: string = '', toggled: boolean = true, numr: number) => {
    if (chatBars.length >= 6) return; // 최대 6개 제한
    const newId = `chatBar-${Date.now()}` + numr;

    setChatBars(prevBars => [newId, ...prevBars]); // 새 chatBar를 배열의 앞에 추가
    setInputValues(prevValues => ({
      ...prevValues,
      [newId]: content, // 전달받은 content 설정
    }));
    setToggledIcons(prevIcons => ({
      ...prevIcons,
      [newId]: toggled, // 전달받은 toggled 설정
    }));
  };

  const removeChatBar = (id: string) => {
    console.log('asd');
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
    closeAIRecommend();
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
    setAiHeight(0);
  };

  const selectMessageFromAIRecommend = (_message: string, isSend: boolean) => {
    const parts = _message.split(/\*(.*?)\*/g); // *로 감싸진 텍스트 기준으로 나누기

    let count = 0;
    parts
      .slice()
      .reverse()
      .forEach(part => {
        count++;
        const trimmedPart = part.trim();
        if (trimmedPart) {
          const isToggled = _message.includes(`*${trimmedPart}*`); // *로 감싸면 않았으면 true
          addChatBarIndata(trimmedPart, isToggled, count); // addChatBar 호출로 추가
        }
      });

    // main 초기화
    setInputValues(prevValues => ({
      ...prevValues,
      main: '', // main은 초기화
    }));

    // AI 추천 모달 닫기
    setAIRecommendOpen(false);
  };

  const renderChatBars = () =>
    chatBars.map((id, index) => (
      <div className={styles.chatBox} key={id}>
        <>
          {Object.values(inputValues).every(value => value.trim() === '') && index === chatBars.length - 1 && (
            <img src={Plus.src} className={styles.plusButton} onClick={toggleExpand} />
          )}
        </>
        <div className={styles.inputBox}>
          {toggledIcons[id] ? (
            <img src={Description.src} onClick={() => toggleIcon(id)} className={styles.inputButton} />
          ) : (
            <img src={BotMessage.src} onClick={() => toggleIcon(id)} className={styles.inputButton} />
          )}
          <TextField
            placeholder="Type your message..."
            onFocus={handleFocus}
            value={inputValues[id]}
            onChange={e => handleInputChange(id, e.target.value)}
            onKeyDown={handleKeyDownInternal}
            multiline
            maxRows={5}
            className={styles.textField}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: 'none', // 아웃라인 제거
                },
                fontSize: '14px', // 폰트 크기 설정
                paddingLeft: '0px',
                paddingRight: '0px',
                paddingTop: '5px',
                paddingBottom: '5px',
              },
              '& .MuiInputBase-input': {
                fontSize: '16px', // 내부 입력 텍스트의 폰트 크기 설정
                appearance: 'none', // iOS 기본 스타일 비활성화
                WebkitAppearance: 'none', // Safari 호환
              },
            }}
            style={{padding: '0px'}}
          />

          {id !== 'main' ? (
            <div onClick={() => removeChatBar(id)} className={styles.closeButton}>
              <img src={Close.src} />
            </div>
          ) : (
            <>
              {Object.values(inputValues).every(value => value.trim() === '') ? (
                <img src={AiText.src} alt="AI Recommend" onClick={handleAIRecommend} className={styles.inputButton} />
              ) : (
                <img src={BotSend.src} alt="AI Recommend" onClick={handleSend} className={styles.inputButton} />
              )}
            </>
          )}
        </div>
        {id === 'main' && chatBars.length < 6 && (
          <Box display="flex">
            {Object.values(inputValues).every(value => value.trim() === '') ? (
              <button
                className={styles.recordingButton}
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
    <div className={styles.container}>
      {renderChatBars()}
      {isAIRecommendOpen ? (
        <AI_Recommend
          open={isAIRecommendOpen}
          onClose={closeAIRecommend}
          onSelectMessage={selectMessageFromAIRecommend}
          onHeightChange={handleHeightChange}
        />
      ) : null}
    </div>
  );
};

export default ChatBar;
