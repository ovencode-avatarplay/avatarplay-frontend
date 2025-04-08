import React, {useState} from 'react';
import styles from './CharacterChat.module.css';
import MessageTagList, {MessageTagType} from './MessageTagList';
import MessageProfile, {BadgeType, CheckType, FollowState} from './MessageProfile';
import FilterBar from './FilterBar';

interface Props {
  name?: string;
}

const CharacterChat: React.FC<Props> = ({name}) => {
  const [selectedTag, setSelectedTag] = useState<MessageTagType>(MessageTagType.All);
  return (
    <>
      <MessageTagList onTagChange={setSelectedTag} />
      <FilterBar
        filters={['Original', 'Fan']}
        sortOptions={['Newest', 'Oldest']}
        onFilterChange={filter => console.log('선택된 필터:', filter)}
        onSortChange={sort => console.log('선택된 정렬:', sort)}
      />
      <div className={styles.name}>Chat</div>
      <div className={styles.scrollArea}>
        <MessageProfile
          profileImage="/lora/meina_hentai.png"
          level="2"
          profileName="tempName"
          timestamp="tempTime"
          badgeType={BadgeType.Fan}
          followState={FollowState.Following}
          isHighlight={true}
        />
        <div style={{height: 'calc(48px + 2px)'}}></div>
      </div>
    </>
  );
};

export default CharacterChat;
