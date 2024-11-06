import React, {useEffect, useState} from 'react';
import {Box, TextField, IconButton, InputAdornment, Button} from '@mui/material';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import CloseIcon from '@mui/icons-material/Close';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

interface ChatBarProps {
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>; // 메시지를 업데이트할 콜백 함수
  onSend: () => void;
  toggleExpand: () => void;
  isExpanded: boolean;
  handleKeyDown: (event: React.KeyboardEvent) => void;
}

const ChatBar: React.FC<ChatBarProps> = ({message, setMessage, onSend, toggleExpand, isExpanded, handleKeyDown}) => {
  const [chatBars, setChatBars] = useState<string[]>(['main']);
  const [inputValues, setInputValues] = useState<{[key: string]: string}>({main: ''});
  const [toggledIcons, setToggledIcons] = useState<{[key: string]: boolean}>({main: false});

  // toggledIcons 또는 inputValues가 변경될 때마다 메시지 업데이트
  useEffect(() => {
    updateMessageText();
  }, [toggledIcons, inputValues]);

  const addChatBar = () => {
    const newId = `chatBar-${Date.now()}`;
    setChatBars([newId, ...chatBars]);
    setInputValues(prevValues => ({...prevValues, [newId]: ''}));
    setToggledIcons(prevIcons => ({...prevIcons, [newId]: false}));
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
    setInputValues(prevValues => {
      const updatedValues = {...prevValues, [id]: value};
      return updatedValues;
    });
  };

  const updateMessageText = () => {
    const orderedValues = chatBars
      .map(id => {
        const value = inputValues[id] || '';
        return toggledIcons[id] ? `*${value}*` : `${value}`;
      })
      .join('(,)');

    setMessage(orderedValues); // `BottomBar`의 `message` 상태를 업데이트
  };

  const toggleIcon = (id: string) => {
    setToggledIcons(prevIcons => ({...prevIcons, [id]: !prevIcons[id]}));
  };

  const handleSend = () => {
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

  return (
    <Box>
      {chatBars.map((id, index) => (
        <Box display="flex" alignItems="center" padding={1} key={id}>
          {index === chatBars.length - 1 && (
            <IconButton onClick={toggleExpand} sx={{marginLeft: 1, marginBottom: 1}}>
              {isExpanded ? <ArrowUpwardIcon /> : <ArrowUpwardIcon />}
            </IconButton>
          )}
          <TextField
            variant="outlined"
            placeholder="Type your message..."
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
                    <IconButton onClick={() => addChatBar()}>
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
      ))}
    </Box>
  );
};

export default ChatBar;
