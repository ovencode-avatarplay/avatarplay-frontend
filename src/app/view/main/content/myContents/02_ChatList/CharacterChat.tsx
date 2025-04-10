import React, {useState} from 'react';
import styles from './Styles.module.css';
import MessageProfile, {BadgeType, CheckType, FollowState} from '../01_Layout/MessageProfile';
import FilterBar from '../FilterBar';
import MessageTagList from '../01_Layout/MessageTagList';

const tags = ['All', 'My', 'Story', 'Music', 'Gravure', 'Custom1', 'Custom2'];
interface Props {
  name?: string;
}

const CharacterChat: React.FC<Props> = ({name}) => {
  const [selectedTag, setSelectedTag] = useState(tags[0]);
  return (
    <>
      <MessageTagList tags={tags} defaultTag="All" onTagChange={tag => setSelectedTag(tag)} />
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
          onClick={() => {}}
        />
        <div style={{height: 'calc(48px + 2px)'}}></div>
      </div>
    </>
  );
};

export default CharacterChat;
