import React from 'react';
import EmojiPicker from './EmojiPicker';

interface StickerProps {
  onSelectEmoji: (emoji: string) => void;
}

const Sticker: React.FC<StickerProps> = ({onSelectEmoji}) => {
  return (
    <div>
      <EmojiPicker onEmojiClick={onSelectEmoji} />
    </div>
  );
};

export default Sticker;
