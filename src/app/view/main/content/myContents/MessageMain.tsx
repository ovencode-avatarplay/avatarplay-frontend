import React, {useState} from 'react';
import MessageTabMenu, {MessageTabType} from './MessageTabMenu';
import MessageTagList, {MessageTagType} from './MessageTagList';
import styles from './MessageMain.module.css';
import MessageProfile from './MessageProfile';
import Splitters, {Splitter} from '@/components/layout/shared/CustomSplitter';
import {LineSearch} from '@ui/Icons';
import HeaderNavBarWhite from './HeaderNavBarWhite';
import CharacterChat from './CharacterChat';

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
        {activeIndex === 1 && <></>}
        {activeIndex === 2 && <></>}
      </div>
    </>
  );
};

export default MessageMain;
