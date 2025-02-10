import React, {useState} from 'react';
import MessageTabMenu, {MessageTabType} from './MessageTabMenu';
import MessageTagList, {MessageTagType} from './MessageTagList';
import styles from './MyContents.module.css';
import MessageProfile from './MessageProfile';
import Splitters from '@/components/layout/shared/CustomSplitter';
const MyContents: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<MessageTabType>(MessageTabType.Chat);
  const [selectedTag, setSelectedTag] = useState<MessageTagType>(MessageTagType.All);
  const [selectedFilter, setSelectedFilter] = useState<'OnChat' | 'Favorite'>('OnChat');

  const splitData = [
    {
      label: 'Chat',
      preContent: '',
      content: (
        <>
          <MessageTagList onTagChange={setSelectedTag} />

          <div className={styles.filters}>
            <div
              className={`${styles.filter} ${selectedFilter === 'OnChat' ? styles.active : ''}`}
              onClick={() => setSelectedFilter('OnChat')}
            >
              OnChat
            </div>
            <div
              className={`${styles.filter} ${selectedFilter === 'Favorite' ? styles.active : ''}`}
              onClick={() => setSelectedFilter('Favorite')}
            >
              Favorite
            </div>
          </div>
          <div className={styles.scrollArea}>
            <MessageProfile
              profileImage="/lora/meina_hentai.png"
              level="2"
              profileName="tempName"
              timestamp="tempTime"
            />
            <MessageProfile
              profileImage="/lora/meina_hentai.png"
              level="2"
              profileName="tempName"
              timestamp="tempTime"
            />
            <MessageProfile
              profileImage="/lora/meina_hentai.png"
              level="2"
              profileName="tempName"
              timestamp="tempTime"
            />
            <MessageProfile
              profileImage="/lora/meina_hentai.png"
              level="2"
              profileName="tempName"
              timestamp="tempTime"
            />
            <MessageProfile
              profileImage="/lora/meina_hentai.png"
              level="2"
              profileName="tempName"
              timestamp="tempTime"
            />
            <MessageProfile
              profileImage="/lora/meina_hentai.png"
              level="2"
              profileName="tempName"
              timestamp="tempTime"
            />
            <MessageProfile
              profileImage="/lora/meina_hentai.png"
              level="2"
              profileName="tempName"
              timestamp="tempTime"
            />
            <MessageProfile
              profileImage="/lora/meina_hentai.png"
              level="2"
              profileName="tempName"
              timestamp="tempTime"
            />
            <MessageProfile
              profileImage="/lora/meina_hentai.png"
              level="2"
              profileName="tempName"
              timestamp="tempTime"
            />
            <MessageProfile
              profileImage="/lora/meina_hentai.png"
              level="2"
              profileName="tempName"
              timestamp="tempTime"
            />
            <MessageProfile
              profileImage="/lora/meina_hentai.png"
              level="2"
              profileName="tempName"
              timestamp="tempTime"
            />
            <MessageProfile
              profileImage="/lora/meina_hentai.png"
              level="2"
              profileName="tempName"
              timestamp="tempTime"
            />
            <MessageProfile
              profileImage="/lora/meina_hentai.png"
              level="2"
              profileName="tempName"
              timestamp="tempTime"
            />
            <MessageProfile
              profileImage="/lora/meina_hentai.png"
              level="2"
              profileName="tempName"
              timestamp="tempTime"
            />
            <MessageProfile
              profileImage="/lora/meina_hentai.png"
              level="2"
              profileName="tempName"
              timestamp="tempTime"
            />
            <MessageProfile
              profileImage="/lora/meina_hentai.png"
              level="2"
              profileName="tempName"
              timestamp="tempTime"
            />
            <MessageProfile
              profileImage="/lora/meina_hentai.png"
              level="2"
              profileName="tempName"
              timestamp="tempTime"
            />
            <MessageProfile
              profileImage="/lora/meina_hentai.png"
              level="2"
              profileName="tempName"
              timestamp="tempTime"
            />
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
      label: 'Story',
      preContent: '',
      content: (
        <iframe
          src="https://react-webgame2.s3.ap-northeast-2.amazonaws.com/index.html"
          width="var(--second-width)"
          height="80%"
          title="game"
        ></iframe>
      ),
    },
    {
      label: 'DM',
      preContent: '',
      content: <></>,
    },
    {
      label: 'ForYou',
      preContent: '',
      content: <></>,
    },
  ];

  return (
    <>
      <Splitters splitters={splitData} splitterStyle={{height: '100%'}} />

      {/* <MessageTabMenu onTabChange={setSelectedTab} /> */}
    </>
  );
};

export default MyContents;
