import React, {useState} from 'react';
import MessageTabMenu, {MessageTabType} from './MessageTabMenu';
import MessageTagList, {MessageTagType} from './MessageTagList';
import styles from './MessageMain.module.css';
import MessageProfile from './MessageProfile';
import Splitters, {Splitter} from '@/components/layout/shared/CustomSplitter';
import {LineSearch} from '@ui/Icons';

const MessageMain: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<MessageTabType>(MessageTabType.Chat);
  const [selectedTag, setSelectedTag] = useState<MessageTagType>(MessageTagType.All);
  const [selectedFilter, setSelectedFilter] = useState<'OnChat' | 'Favorite'>('OnChat');

  const splitData: Splitter[] = [
    {
      label: 'Character Chat',
      preContent: '',
      content: (
        <>
          <MessageTagList onTagChange={setSelectedTag} />

          <div className={styles.scrollArea}>
            <MessageProfile
              profileImage="/lora/meina_hentai.png"
              level="2"
              profileName="tempName"
              timestamp="tempTime"
            />
            <div style={{height: 'calc(48px + 2px)'}}></div>
          </div>
        </>
      ),
    },
    {
      label: 'DM',
      preContent: '',
      content: (
        <></>
        // <iframe
        //   src="https://react-webgame2.s3.ap-northeast-2.amazonaws.com/index.html"
        //   width="var(--second-width)"
        //   height="80%"
        //   title="game"
        // ></iframe>
      ),
    },
    {
      label: 'AI Help',
      preContent: '',
      content: <></>,
    },
    {
      label: '',
      labelType: 'OnlyIcon',
      labelIconSrc: LineSearch.src,
      preContent: '',
      content: <></>,
    },
  ];

  return (
    <div className={styles.splitterContainer}>
      <Splitters splitters={splitData} splitterStyle={{height: '100%'}} headerStyle={{margin: '0 16px'}} />

      {/* <MessageTabMenu onTabChange={setSelectedTab} /> */}
    </div>
  );
};

export default MessageMain;
