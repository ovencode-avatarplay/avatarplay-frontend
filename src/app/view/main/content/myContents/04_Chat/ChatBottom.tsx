import React, {useState} from 'react';
import styles from './ChatBottom.module.css';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import {BoldSend} from '@ui/Icons';

interface Props {
  onSend: (text: string) => void;
}

const ChatBottom: React.FC<Props> = ({onSend}) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.plusButton}>
        <AddIcon />
      </div>
      <div className={styles.inputWrap}>
        <input
          className={styles.inputField}
          placeholder="Input..."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <div className={styles.sendWrap} onClick={handleSend}>
          <img src={BoldSend.src} className={styles.sendIcon}></img>
        </div>
      </div>
      asd
    </div>
  );
};

export default ChatBottom;
