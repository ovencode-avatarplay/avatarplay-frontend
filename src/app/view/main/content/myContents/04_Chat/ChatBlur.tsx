// components/ChatBlur.tsx
import React from 'react';
import {useAtom} from 'jotai';
import {isBlurModeAtom} from './ChatBlurAtom';
import styles from './ChatBlur.module.css';

const ChatBlur: React.FC = () => {
  const [isBlurMode, setBlurMode] = useAtom(isBlurModeAtom);

  if (!isBlurMode) return null;

  return <div className={styles.blurOverlay} onClick={() => setBlurMode(false)} />;
};

export default ChatBlur;
