import React from 'react';
import EmojiPicker from './EmojiPicker';
import {EmoticonGroupInfo} from '@/app/NetWork/ChatNetwork';

interface StickerProps {
  onSelectEmoji: (emojiUrl: string, emojiId: number, isFavorite: boolean) => void;
  EmoticonData?: EmoticonGroupInfo[];
}

const Sticker: React.FC<StickerProps> = ({onSelectEmoji, EmoticonData}) => {
  return (
    <div>
      <EmojiPicker onEmojiClick={onSelectEmoji} EmoticonData={EmoticonData} />
    </div>
  );
};

export default Sticker;
