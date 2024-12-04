import React, {useState} from 'react';

import InputCard from '../../create/content-main/episode/episode-conversationtemplate/InputCard';
import {ConversationTalkType} from '@/types/apps/DataTypes';

const ChatTalkCard: React.FC = () => {
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
          defalutType={ConversationTalkType.Speech}
          onChange={() => {}}
          onDelete={() => handleDeleteInputCard('user', index)}
        />
      ))}
    </div>
  );
};

export default ChatTalkCard;
