// ChatTtsPlayer.tsx
import React, {useEffect} from 'react';

interface ChatTtsPlayerProps {
  audioUrl: string | null;
}

const ChatTtsPlayer: React.FC<ChatTtsPlayerProps> = ({audioUrl}) => {
  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시 URL 해제
      if (audioUrl !== null) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  return (
    <audio autoPlay src={audioUrl !== null ? audioUrl : ''}>
      Your browser does not support the audio element.
    </audio>
  );
};

export default ChatTtsPlayer;
