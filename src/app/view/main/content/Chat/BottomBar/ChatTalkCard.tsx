import React, {useState} from 'react';
import {
  Card,
  FormControl,
  Select,
  MenuItem,
  Button,
  Typography,
  Avatar,
  IconButton,
  Collapse,
  SelectChangeEvent,
} from '@mui/material';
import styles from './ChatTalkCard.module.css';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InputCard from '../../create/content-main/episode/episode-conversationtemplate/InputCard';

interface ChatTalkCardProps {}

const ChatTalkCard: React.FC<ChatTalkCardProps> = () => {
  const [userInputCards, setUserInputCards] = useState([{type: 1, talk: 'User Talk 1'}]);

  const handleDeleteInputCard = (type: 'user' | 'character', index: number) => {
    if (type === 'user') {
      setUserInputCards(prev => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div>
      {userInputCards.map((inputCard, index) => (
        <InputCard
          defaultValue={inputCard.talk}
          onChange={() => {}}
          onDelete={() => handleDeleteInputCard('user', index)}
        />
      ))}
    </div>
  );
};

export default ChatTalkCard;
