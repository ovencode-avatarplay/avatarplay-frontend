import React, {useState} from 'react';
import styles from './CharacterChat.module.css';
import MessageTagList, {MessageTagType} from './MessageTagList';
import MessageProfile from './MessageProfile';

interface Props {
  name?: string;
}

const CharacterChat: React.FC<Props> = ({name}) => {
  const [selectedTag, setSelectedTag] = useState<MessageTagType>(MessageTagType.All);
  return (
    <>
      <MessageTagList onTagChange={setSelectedTag} />

      <div className={styles.scrollArea}>
        <MessageProfile profileImage="/lora/meina_hentai.png" level="2" profileName="tempName" timestamp="tempTime" />
        <div style={{height: 'calc(48px + 2px)'}}></div>
      </div>
    </>
  );
};

export default CharacterChat;
