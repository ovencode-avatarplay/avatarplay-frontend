import React, {useState} from 'react';
import styles from './MessageMain.module.css';
import HeaderNavBarWhite from './HeaderNavBarWhite';
import CharacterChat from './02_ChatList/CharacterChat';
import DMChat from './02_ChatList/DMChat';
import FriendsList from './FriendsList';

const tabItems = ['Character Chat' /*, 'DM'*/];
const MessageMain: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <div className={styles.Container}>
        <HeaderNavBarWhite></HeaderNavBarWhite>
        {/* <div className={styles.tabContainer}>
          {tabItems.map((label, index) => (
            <div
              key={label}
              className={`${styles.tab} ${index === activeIndex ? styles.active : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              {label}
            </div>
          ))}
        </div> */}
        {activeIndex === 0 && <CharacterChat></CharacterChat>}
        {activeIndex === 1 && <DMChat></DMChat>}
        {activeIndex === 2 && <FriendsList></FriendsList>}
      </div>
    </>
  );
};

export default MessageMain;
