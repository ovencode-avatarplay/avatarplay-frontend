// Stiker.tsx
import React from 'react';
import EmojiPicker from './EmojiPicker';

interface StikerProps {
  onSelectEmoji: (emoji: string) => void; // 선택된 이모지 핸들러
}

const Stiker: React.FC<StikerProps> = ({onSelectEmoji}) => {
  return (
    <div>
      <h3>이모지 선택</h3>
      <EmojiPicker onEmojiClick={onSelectEmoji} /> {/* onEmojiClick 프롭 전달 */}
    </div>
  );
};

export default Stiker;
