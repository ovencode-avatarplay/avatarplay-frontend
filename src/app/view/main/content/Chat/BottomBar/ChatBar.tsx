import React, {useEffect, useState, useRef} from 'react';
import {Box, TextField, IconButton, InputAdornment, Button, Typography} from '@mui/material';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import CloseIcon from '@mui/icons-material/Close';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import {RootState} from '@/redux-store/ReduxStore';
import {useSelector, useDispatch} from 'react-redux';
import {setIsModifyingQuestion, setIsRegenerateAnswer} from '@/redux-store/slices/ModifyQuestion';
import AIRecommendImg from '@ui/chatting/btn_ai_recommend.png';
import AI_Recommend from './AI_Recommend';

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
}

const ChatBar: React.FC<ChatBarProps> = ({
  message,
  setMessage,
  onSend,
  toggleExpand,
  isExpanded,
  handleKeyDown,
  isHideChat,
  onToggleBackground,
  onLoading,
  onUpdateChatBarCount,
}) => {
  const [chatBars, setChatBars] = useState<string[]>(['main']);
  const [inputValues, setInputValues] = useState<{[key: string]: string}>({main: ''});
  const [toggledIcons, setToggledIcons] = useState<{[key: string]: boolean}>({main: false});
  const [isAIRecommendOpen, setAIRecommendOpen] = useState(false);

  const dispatch = useDispatch();
  const isModifyingQuestion = useSelector((state: RootState) => state.modifyQuestion.isModifyingQuestion);
  const modifyingText = useSelector((state: RootState) => state.modifyQuestion.modifyingQuestion);

  useEffect(() => {
    onUpdateChatBarCount(chatBars.length);
  }, [chatBars]);

  useEffect(() => {
    updateMessageText();
  }, [toggledIcons, inputValues]);

  useEffect(() => {
    if (isModifyingQuestion) {
      setInputValues({main: modifyingText});
    } else {
      setInputValues({main: ''});
    }
  }, [isModifyingQuestion]);

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
    if (!isModifyingQuestion) {
      onLoading(true);
      onSend(messages);

      // 컴포넌트를 초기 상태로 되돌림
      setChatBars(['main']); // main 이외의 모든 채팅바 제거
      setInputValues({main: ''}); // 모든 입력값을 빈 문자열로 초기화
      setToggledIcons({main: false}); // 모든 토글 상태를 기본값으로 초기화
      setMessage(''); // message 상태 초기화
    } else {
      dispatch(setIsModifyingQuestion(false));
    }
  };

  const handleKeyDownInternal = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage(message);
    }
    handleKeyDown(event);
  };

  //#region 재전송
  const regenerateAnswerCalled = useSelector((state: RootState) => state.modifyQuestion.isRegenerateAnswer);
  const regenerateQuestion = useSelector((state: RootState) => state.modifyQuestion.lastMessageQuestion);
  const regenerateId = useSelector((state: RootState) => state.modifyQuestion.lastMessageId);
  useEffect(() => {
    if (regenerateAnswerCalled === true) {
      setMessage(regenerateQuestion);

      console.log('재생성 요청' + regenerateId + '/' + regenerateQuestion);

      // TODO : 적절한 API 호출 또는 기존 루트 진입
      dispatch(setIsRegenerateAnswer(false));
    }
  }, [regenerateAnswerCalled]);

  //#endregion

  const handleFocus = () => {
    if (isHideChat) {
      onToggleBackground();
    }
  };

  const handleCancelModifyText = () => {
    dispatch(setIsModifyingQuestion(false));
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
      <Box display="flex" alignItems="center" padding={1} key={id}>
        {index === chatBars.length - 1 && (
          <IconButton onClick={toggleExpand} sx={{marginLeft: 1, marginBottom: 1}}>
            <ArrowUpwardIcon />
          </IconButton>
        )}
        <TextField
          variant="outlined"
          placeholder={isModifyingQuestion ? modifyingText : 'Type your message...'}
          onFocus={handleFocus}
          value={inputValues[id]}
          onChange={e => handleInputChange(id, e.target.value)}
          onKeyDown={handleKeyDownInternal}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={() => toggleIcon(id)}>
                  {toggledIcons[id] ? <DirectionsRunIcon /> : <MapsUgcIcon />}
                </IconButton>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                {id !== 'main' ? (
                  <IconButton onClick={() => removeChatBar(id)}>
                    <CloseIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={addChatBar}>
                    <DirectionsRunIcon />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
          sx={{
            flex: 1,
            marginRight: 1,
            overflow: 'auto',
            borderRadius: '4px',
            minHeight: '40px',
          }}
        />
        {id === 'main' && (
          <Box display="flex" gap={1}>
            {inputValues.main.trim() === '' ? (
              <Button
                onClick={handleAIRecommend}
                sx={{
                  marginRight: 1,
                  marginBottom: 1,
                  width: '40px',
                  height: '40px',
                  minWidth: '50px',
                  padding: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                <img src={AIRecommendImg.src} alt="AI Recommend" style={{width: '100%', height: '100%'}} />
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                sx={{
                  marginRight: 1,
                  marginBottom: 1,
                  width: '40px',
                  height: '40px',
                  minWidth: '50px',
                  whiteSpace: 'nowrap',
                }}
                onClick={handleSend}
              >
                보내기
              </Button>
            )}
          </Box>
        )}
      </Box>
    ));

  return (
    <Box>
      {isModifyingQuestion ? (
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
              }}
            >
              {modifyingText}
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