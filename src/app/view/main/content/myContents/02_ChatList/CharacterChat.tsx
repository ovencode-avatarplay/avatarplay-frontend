import React, {useState} from 'react';
import styles from './Styles.module.css';
import MessageProfile, {BadgeType, CheckType, FollowState} from '../01_Layout/MessageProfile';
import FilterBar from '../FilterBar';
import MessageTagList from '../01_Layout/MessageTagList';
import SelectDrawer from '@/components/create/SelectDrawer';
import {SelectDrawerArrowItem} from '@/components/create/SelectDrawerArrow';
import ProfilePopup from '../ProfilePopup';

const tags = ['All', 'My', 'Story', 'Music', 'Gravure', 'Custom1', 'Custom2'];
interface Props {
  name?: string;
}

const CharacterChat: React.FC<Props> = ({name}) => {
  const [selectedTag, setSelectedTag] = useState(tags[0]);
  const [openOption, setOpenOption] = useState(false);
  const [openLeavePopup, setOpenLeavePopup] = useState(false);

  const optionItems: SelectDrawerArrowItem[] = [
    {
      name: 'Favorites /Unfavorites',
      arrowName: '',
      onClick: () => {},
    },
    {
      name: 'Pin to Top / Unpin ',
      arrowName: '',
      onClick: () => {},
    },
    {
      name: 'Leave',
      arrowName: '',
      onClick: () => {
        setOpenLeavePopup(true);
      },
    },
  ];
  return (
    <>
      <MessageTagList tags={tags} defaultTag="All" onTagChange={tag => setSelectedTag(tag)} />
      <FilterBar
        filters={['Original', 'Fan']}
        sortOptions={['Newest', 'Oldest']}
        onFilterChange={filter => console.log('선택된 필터:', filter)}
        onSortChange={sort => console.log('선택된 정렬:', sort)}
      />
      <div className={styles.name}>Favorite ({3})</div>
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
          isOption={true}
          onClickOption={() => {
            setOpenOption(true);
          }}
        />
        <div style={{height: 'calc(48px + 2px)'}}></div>
      </div>
      <SelectDrawer
        isOpen={openOption}
        items={optionItems}
        onClose={() => {
          setOpenOption(false);
        }}
        isCheck={false}
        selectedIndex={1}
      ></SelectDrawer>
      {openLeavePopup && (
        <ProfilePopup
          type="alert"
          title="Alert"
          description="Do uou want to leave the Chatroom?"
          buttons={[
            {
              label: 'Cancel',
              onClick: () => {
                setOpenLeavePopup(false);
              },
              isPrimary: false,
            },
            {
              label: 'Leave',
              onClick: () => {
                setOpenLeavePopup(false);
              },
              isPrimary: true,
            },
          ]}
          badgeType={BadgeType.Original}
          profileDesc="asdasdad"
          profileImage="/lora/meina_hentai.png"
          profileName="asdasds"
        ></ProfilePopup>
      )}
    </>
  );
};

export default CharacterChat;
