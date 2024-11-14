import React, {useEffect, useState} from 'react';
import {Box, TextField, IconButton, InputAdornment, Button, Typography} from '@mui/material';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import CloseIcon from '@mui/icons-material/Close';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import {RootState} from '@/redux-store/ReduxStore';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {setIsModifying} from '@/redux-store/slices/ModifyQuestion';

interface ChatBarProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  onSend: () => void;
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

  const dispatch = useDispatch();
  const isModifyQuestionOpen = useSelector((state: RootState) => state.modifyQuestion.isModifying);
  const modifyingText = useSelector((state: RootState) => state.modifyQuestion.modifyingText);

  useEffect(() => {
    onUpdateChatBarCount(chatBars.length);
  }, [chatBars]);

  useEffect(() => {
    updateMessageText();
  }, [toggledIcons, inputValues]);
  const addChatBar = () => {
    if (chatBars.length >= 5) return; // 최대 채팅 바 개수 제한
    const newId = `chatBar-${Date.now()}`;
    const newContent = inputValues.main; // main의 내용을 새 채팅바에 할당

    // 기존 main의 아이콘 상태를 반대로 설정
    const newMainIconState = !toggledIcons.main; // main의 아이콘 상태 반전

    // 새로운 채팅바를 main 바로 앞에 추가
    setChatBars(prevBars => {
      const mainIndex = prevBars.length - 1; // main의 인덱스
      return [...prevBars.slice(0, mainIndex), newId, ...prevBars.slice(mainIndex)];
    });

    setInputValues(prevValues => ({...prevValues, [newId]: newContent, main: ''})); // 새 채팅바의 내용을 설정하고 main을 초기화
    setToggledIcons(prevIcons => ({
      ...prevIcons,
      main: newMainIconState, // main 아이콘 상태를 반전시킨 상태로 업데이트
      [newId]: toggledIcons.main, // 새 채팅바의 아이콘 상태는 기존 main 상태 그대로 유지
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
    setInputValues(prevValues => ({
      ...prevValues,
      [id]: value,
    }));
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

  const handleSend = () => {
    onLoading(true);
    onSend(); // 메시지 전송

    // 컴포넌트를 초기 상태로 되돌림
    setChatBars(['main']); // main 이외의 모든 채팅바 제거
    setInputValues({main: ''}); // 모든 입력값을 빈 문자열로 초기화
    setToggledIcons({main: false}); // 모든 토글 상태를 기본값으로 초기화
    setMessage(''); // message 상태 초기화
  };

  const handleKeyDownInternal = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
    handleKeyDown(event);
  };

  const handleFocus = () => {
    if (isHideChat) {
      onToggleBackground();
    }
  };

  const handleCancelModifyText = () => {
    dispatch(setIsModifying(false));
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
          placeholder={isModifyQuestionOpen ? modifyingText : 'Type your message...'}
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
    ));

  return (
    <Box>
      {isModifyQuestionOpen ? (
        <Box>
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
                backgroundColor: '#f5f5f5', // 배경색 설정 (옵션)
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
    </Box>
  );
};

export default ChatBar;
