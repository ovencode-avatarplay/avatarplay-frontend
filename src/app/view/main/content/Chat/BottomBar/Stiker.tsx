import React from 'react';
import EmojiPicker from './EmojiPicker';

interface StikerProps {
  onSelectEmoji: (emoji: string) => void;
}

const Stiker: React.FC<StikerProps> = ({onSelectEmoji}) => {
  return (
    <div>
      <EmojiPicker onEmojiClick={onSelectEmoji} />
    </div>
  );
};

export default Stiker;
