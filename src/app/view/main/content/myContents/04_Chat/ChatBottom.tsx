import React, {useState} from 'react';
import styles from './ChatBottom.module.css';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';

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
        <div className={styles.inputIcon} /> {/* 왼쪽 아이콘 영역 */}
        <input
          className={styles.inputField}
          placeholder="Tears on her face.."
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <div className={styles.sendWrap} onClick={handleSend}>
          <SendIcon className={styles.sendIcon} />
        </div>
      </div>
    </div>
  );
};

export default ChatBottom;
