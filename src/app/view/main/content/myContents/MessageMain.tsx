import React, {useState} from 'react';
import styles from './MessageMain.module.css';
import HeaderNavBarWhite from './HeaderNavBarWhite';
import CharacterChat from './02_ChatList/CharacterChat';
import DMChat from './02_ChatList/DMChat';

const tabItems = ['Character Chat', 'DM', 'AI Help'];
const MessageMain: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <HeaderNavBarWhite></HeaderNavBarWhite>
      <div className={styles.Container}>
        <div className={styles.tabContainer}>
          {tabItems.map((label, index) => (
            <div
              key={label}
              className={`${styles.tab} ${index === activeIndex ? styles.active : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              {label}
            </div>
          ))}
        </div>
        {activeIndex === 0 && <CharacterChat></CharacterChat>}
        {activeIndex === 1 && <DMChat></DMChat>}
        {activeIndex === 2 && <></>}
      </div>
    </>
  );
};

export default MessageMain;
