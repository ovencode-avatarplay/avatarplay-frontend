import React, {useState} from 'react';
import styles from './ChatBottom.module.css';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import {BoldSend, Emoticon, LineRecording, LineReward, VideoFrame} from '@ui/Icons';
import {useAtom} from 'jotai';
import {ToastMessageAtom} from '@/app/Root';

interface Props {
  onSend: (text: string) => void;
}

const ChatBottom: React.FC<Props> = ({onSend}) => {
  const [dataToast, setDataToast] = useAtom(ToastMessageAtom);
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <button className={styles.plusButton}>
          <AddIcon />
        </button>
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
        <img
          src={LineRecording.src}
          className={styles.micIcon}
          onClick={() => {
            dataToast.open('추후 개발 예정');
          }}
        ></img>
      </div>
      <AddContent></AddContent>
    </div>
  );
};

export default ChatBottom;

const AddContent: React.FC = () => {
  return (
    <div className={styles.addContent}>
      <div className={styles.addItem}>
        <div className={styles.addItemRound}>
          <img src={LineReward.src} className={styles.addItemIcon}></img>
        </div>
        <span className={styles.addItemText}>gift</span>
      </div>
      <div className={styles.addItem}>
        <div className={styles.addItemRound}>
          <img src={VideoFrame.src} className={styles.addItemIcon}></img>
        </div>
        <span className={styles.addItemText}>Media</span>
      </div>
      <div className={styles.addItem}>
        <div className={styles.addItemRound}>
          <img src={Emoticon.src} className={styles.addItemIcon}></img>
        </div>
        <span className={styles.addItemText}>Emoticon</span>
      </div>
    </div>
  );
};
