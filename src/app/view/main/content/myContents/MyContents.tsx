import React, {useState} from 'react';
import MessageTabMenu, {MessageTabType} from './MessageTabMenu';
import MessageTagList, {MessageTagType} from './MessageTagList';
import styles from './MyContents.module.css';
import MessageProfile from './MessageProfile';
const MyContents: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<MessageTabType>(MessageTabType.Chat);
  const [selectedTag, setSelectedTag] = useState<MessageTagType>(MessageTagType.All);
  const [selectedFilter, setSelectedFilter] = useState<'OnChat' | 'Favorite'>('OnChat');
  return (
    <>
      <MessageTabMenu onTabChange={setSelectedTab} />
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
        <MessageProfile profileImage="/lora/meina_hentai.png" level="2" profileName="tempName" timestamp="tempTime" />
        <MessageProfile profileImage="/lora/meina_hentai.png" level="2" profileName="tempName" timestamp="tempTime" />
        <MessageProfile profileImage="/lora/meina_hentai.png" level="2" profileName="tempName" timestamp="tempTime" />
        <MessageProfile profileImage="/lora/meina_hentai.png" level="2" profileName="tempName" timestamp="tempTime" />
        <MessageProfile profileImage="/lora/meina_hentai.png" level="2" profileName="tempName" timestamp="tempTime" />
        <MessageProfile profileImage="/lora/meina_hentai.png" level="2" profileName="tempName" timestamp="tempTime" />
        <MessageProfile profileImage="/lora/meina_hentai.png" level="2" profileName="tempName" timestamp="tempTime" />
        <MessageProfile profileImage="/lora/meina_hentai.png" level="2" profileName="tempName" timestamp="tempTime" />
        <MessageProfile profileImage="/lora/meina_hentai.png" level="2" profileName="tempName" timestamp="tempTime" />
        <MessageProfile profileImage="/lora/meina_hentai.png" level="2" profileName="tempName" timestamp="tempTime" />
        <MessageProfile profileImage="/lora/meina_hentai.png" level="2" profileName="tempName" timestamp="tempTime" />
        <MessageProfile profileImage="/lora/meina_hentai.png" level="2" profileName="tempName" timestamp="tempTime" />
        <MessageProfile profileImage="/lora/meina_hentai.png" level="2" profileName="tempName" timestamp="tempTime" />
        <MessageProfile profileImage="/lora/meina_hentai.png" level="2" profileName="tempName" timestamp="tempTime" />
        <MessageProfile profileImage="/lora/meina_hentai.png" level="2" profileName="tempName" timestamp="tempTime" />
        <MessageProfile profileImage="/lora/meina_hentai.png" level="2" profileName="tempName" timestamp="tempTime" />
        <MessageProfile profileImage="/lora/meina_hentai.png" level="2" profileName="tempName" timestamp="tempTime" />
        <MessageProfile profileImage="/lora/meina_hentai.png" level="2" profileName="tempName" timestamp="tempTime" />
        <MessageProfile profileImage="/lora/meina_hentai.png" level="2" profileName="tempName" timestamp="tempTime" />
        <div style={{height: 'calc(48px + 2px)'}}></div>
      </div>
    </>
  );
};

export default MyContents;
