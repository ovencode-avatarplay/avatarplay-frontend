import React from 'react';
import EmojiPicker from './EmojiPicker';
import {EmoticonGroup} from '@/app/NetWork/ChatNetwork';

interface StickerProps {
  onSelectEmoji: (emojiUrl: string, emojiId: number, isFavorite: boolean) => void; // 두 개의 인수를 받도록 수정
  EmoticonData?: EmoticonGroup[];
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
