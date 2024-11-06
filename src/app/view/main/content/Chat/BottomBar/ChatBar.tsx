import React, {useState} from 'react';
import {Box, TextField, IconButton, InputAdornment, Button} from '@mui/material';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import CloseIcon from '@mui/icons-material/Close';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface ChatBarProps {
  onSend: (message: string) => void; // 개별 메시지를 전달
  toggleExpand: () => void;
  isExpanded: boolean;
  handleKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const ChatBar: React.FC<ChatBarProps> = ({onSend, toggleExpand, isExpanded, handleKeyDown, inputRef}) => {
  const [chatBars, setChatBars] = useState<string[]>(['main']); // 'main'은 기본 채팅바
  const [inputValues, setInputValues] = useState<{[key: string]: string}>({main: ''}); // 각 채팅바 입력값 저장
  const [toggledIcons, setToggledIcons] = useState<{[key: string]: boolean}>({main: false}); // 각 채팅바 아이콘 토글 상태

  // 새 채팅바2 추가
  const addChatBar = () => {
    const newId = `chatBar-${Date.now()}`;
    setChatBars([newId, ...chatBars]);
    setInputValues(prevValues => ({...prevValues, [newId]: ''}));
    setToggledIcons(prevIcons => ({...prevIcons, [newId]: false}));
  };

  // 채팅바 제거
  const removeChatBar = (id: string) => {
    setChatBars(chatBars.filter(barId => barId !== id));
    setInputValues(prevValues => {
      const updatedValues = {...prevValues};
      delete updatedValues[id];
      updateInputRef(updatedValues); // inputRef 업데이트
      return updatedValues;
    });
    setToggledIcons(prevIcons => {
      const updatedIcons = {...prevIcons};
      delete updatedIcons[id];
      return updatedIcons;
    });
  };

  // 입력값이 변경될 때 호출
  const handleInputChange = (id: string, value: string) => {
    setInputValues(prevValues => {
      const updatedValues = {...prevValues, [id]: value};
      updateInputRef(updatedValues); // inputRef 업데이트
      return updatedValues;
    });
  };

  // inputRef에 저장된 문자열 업데이트
  const updateInputRef = (values: {[key: string]: string}) => {
    const orderedValues = chatBars.map(id => `{${values[id] || ''}}`).join('');
    if (inputRef.current) {
      inputRef.current.value = orderedValues;
    }
  };

  // 아이콘 토글
  const toggleIcon = (id: string) => {
    setToggledIcons(prevIcons => ({
      ...prevIcons,
      [id]: !prevIcons[id],
    }));
  };

  // 각 채팅바의 메시지를 onSend로 전송하고 입력 필드 초기화
  const handleSend = (id: string) => {
    const messageText = inputValues[id] || ''; // inputValues에서 메시지를 가져옴
    if (messageText.trim()) {
      onSend(messageText); // 메시지 전송
      handleInputChange(id, ''); // 입력 필드 초기화
    }
  };

  return (
    <Box>
      {chatBars.map((id, index) => (
        <Box display="flex" alignItems="center" padding={1} key={id}>
          {index === chatBars.length - 1 && (
            <IconButton onClick={toggleExpand} sx={{marginLeft: 1, marginBottom: 1}}>
              {isExpanded ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
            </IconButton>
          )}
          <TextField
            variant="outlined"
            placeholder="Type your message..."
            value={inputValues[id]}
            onChange={e => handleInputChange(id, e.target.value)}
            onKeyDown={e => handleKeyDown(e)}
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
          {/* 'main' 채팅바에만 보내기 버튼 표시 */}
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
              onClick={() => handleSend(id)} // main 채팅바의 보내기 버튼 클릭 시 전송
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
