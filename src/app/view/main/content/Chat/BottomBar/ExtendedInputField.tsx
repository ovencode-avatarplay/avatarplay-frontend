import React from 'react';
import {Menu, MenuItem} from '@mui/material';
import ChatTalkCard from './ChatTalkCard';

interface ExtendedInputFieldProps {
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

const ExtendedInputField: React.FC<ExtendedInputFieldProps> = ({anchorEl, onClose}) => {
  const handleShowChatCard = (card: {id: number; title: string; description: string}) => {
    onClose(); // 메뉴 닫기
  };

  return (
    <div>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onClose}>
        <MenuItem onClick={() => handleShowChatCard({id: 1, title: 'User Talk', description: 'User Talk Description'})}>
          <ChatTalkCard />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default ExtendedInputField;
