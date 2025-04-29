import React, {useEffect, useState} from 'react';
import styles from './Styles.module.css';
import MessageProfile, {BadgeType, CheckType, FollowState} from '../01_Layout/MessageProfile';
import FilterBar from '../FilterBar';
import MessageTagList from '../01_Layout/MessageTagList';
import SelectDrawer from '@/components/create/SelectDrawer';
import {SelectDrawerArrowItem} from '@/components/create/SelectDrawerArrow';
import ProfilePopup from '../ProfilePopup';
import {
  ChatRoomInfo,
  GetCharacterChatRoomListReq,
  GetCharacterChatRoomListRes,
  sendGetCharacterChatRoomList,
} from '@/app/NetWork/ChatMessageNetwork';
import {CharacterIP} from '@/app/NetWork/CharacterNetwork';

const tags = ['Chatroom', 'Music', 'BL', 'Gravure', 'Novel', 'Drama', 'Animation', 'Edu', 'Sports', 'Star', 'Brand'];
interface Props {
  name?: string;
}

const CharacterChat: React.FC<Props> = ({name}) => {
  const [selectedTag, setSelectedTag] = useState(tags[0]);
  const [openOption, setOpenOption] = useState(false);
  const [openLeavePopup, setOpenLeavePopup] = useState(false);

  const [filterValue, setFilterValue] = useState<string>(CharacterIP[1].toString());
  const [ChatList, setChatList] = useState<ChatRoomInfo[]>();
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

  const getFilter =
    filterValue == CharacterIP[0].toString()
      ? CharacterIP.None
      : filterValue == CharacterIP[1].toString()
      ? CharacterIP.Original
      : filterValue == CharacterIP[2]
      ? CharacterIP.Fan
      : 0;

  const fetchCharacterChatRooms = async () => {
    try {
      const params: GetCharacterChatRoomListReq = {
        isChatTag: selectedTag == 'Chatroom' ? false : true,
        characterIP: getFilter,
        tag: selectedTag,
        sort: 0,
        page: {
          offset: 0,
          limit: 20,
        },
        alreadyReceivedProfileIds: [], // 초기엔 아무것도 받지 않은 상태
      };

      const response = await sendGetCharacterChatRoomList(params);
      return response.data?.chatRoomList ?? [];
    } catch (error) {
      console.error('fetchCharacterChatRooms error:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const list = await fetchCharacterChatRooms();
      setChatList(list);
    };

    fetchData();
  }, [filterValue]);

  return (
    <>
      <MessageTagList tags={tags} defaultTag="All" onTagChange={tag => setSelectedTag(tag)} />
      <FilterBar
        filters={[CharacterIP[1].toString(), CharacterIP[2].toString()]}
        sortOptions={['Newest', 'Popular', 'Name']}
        onFilterChange={filter => setFilterValue(filter)}
        onSortChange={sort => console.log('선택된 정렬:', sort)}
      />
      <div className={styles.name}>Chat</div>
      <div className={styles.scrollArea}>
        {ChatList?.map((item, index) => (
          <MessageProfile
            key={item.chatRoomId}
            profileImage={item.profileImageUrl}
            profileName={item.characterName}
            timestamp={item.updatedAt.toString()} // 예: "2025-04-29T01:44:00.934Z"
            badgeType={
              item.characterIP == CharacterIP.Fan
                ? BadgeType.Fan
                : item.characterIP == CharacterIP.Original
                ? BadgeType.Original
                : BadgeType.None
            } // 고정값
            followState={FollowState.None} // 고정값
            isHighlight={false} // 고정값
            isOption={true}
            onClick={() => {}}
            onClickOption={() => {
              setOpenOption(true);
            }}
          />
        ))}
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
