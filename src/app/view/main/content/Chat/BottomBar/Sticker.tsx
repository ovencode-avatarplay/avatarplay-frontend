import React from 'react';
import EmojiPicker from './EmojiPicker';
import {EmoticonGroup} from '@/app/NetWork/ChatNetwork';

interface StickerProps {
  onSelectEmoji: (emoji: string) => void;
  EmoticonData?: EmoticonGroup[]; // null 및 undefined를 허용
}

const Sticker: React.FC<StickerProps> = ({onSelectEmoji, EmoticonData}) => {
  console.log(EmoticonData);
  return (
    <div>
      <EmojiPicker onEmojiClick={onSelectEmoji} EmoticonData={EmoticonData} />
    </div>
  );
};

export default Sticker;
