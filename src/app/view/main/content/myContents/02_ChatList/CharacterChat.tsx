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
import {SportsVolleyballRounded} from '@mui/icons-material';
import {useInView} from 'react-intersection-observer';

const tags = [
  'Chatroom',
  'common_tag_music',
  'common_tag_bl',
  'common_tag_gravure',
  'common_tag_novel',
  'common_tag_drama',
  'common_tag_anime',
  'common_tag_edu',
  'common_tag_sports',
  'common_tag_star',
  'common_tag_brand',
];
interface Props {
  name?: string;
}

const CharacterChat: React.FC<Props> = ({name}) => {
  const [selectedTag, setSelectedTag] = useState<string>(tags[0]);
  const [openOption, setOpenOption] = useState(false);
  const [openLeavePopup, setOpenLeavePopup] = useState(false);

  const [filterValue, setFilterValue] = useState<string>(CharacterIP[1].toString());
  const [sortValue, setSortValue] = useState<string>('Newest');

  const [chatList, setChatList] = useState<ChatRoomInfo[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const LIMIT = 10;
  const {ref: observerRef, inView} = useInView();
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      const fetchMore = async () => {
        const list = await fetchCharacterChatRooms(false);
        const sortedList = [...list].sort((a, b) => {
          if (sortValue === 'Newest') {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          } else if (sortValue === 'Popular') {
            return b.likeCount - a.likeCount;
          } else if (sortValue === 'Name') {
            return a.characterName.localeCompare(b.characterName, 'ko-KR');
          }
          return 0;
        });

        setChatList(prev => [...prev, ...sortedList]);
        setOffset(prev => prev + sortedList.length);
        setHasMore(sortedList.length === LIMIT);
      };

      fetchMore();
    }
  }, [inView]);

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
  }, [filterValue, selectedTag, sortValue]);

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

  const getSort = sortValue == 'Newest' ? 0 : sortValue == 'Name' ? 1 : sortValue == 'Popular' ? 2 : 0;

  const fetchCharacterChatRooms = async (isRefreshAll = false): Promise<ChatRoomInfo[]> => {
    try {
      setIsLoading(true);
      const currentOffset = isRefreshAll ? 0 : offset;

      const params: GetCharacterChatRoomListReq = {
        isChatRoom: selectedTag === 'Chatroom',
        characterIP: getFilter,
        tag: selectedTag,
        sort: getSort,
        page: {
          offset: currentOffset,
          limit: LIMIT,
        },
        alreadyReceivedProfileIds: [],
        search: '',
      };

      const response = await sendGetCharacterChatRoomList(params);
      const newList = response.data?.chatRoomList ?? [];
      // 상태는 외부에서 처리할 수 있도록 값만 반환
      return newList;
    } catch (error) {
      console.error('fetchCharacterChatRooms error:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const list = await fetchCharacterChatRooms(true);
      const sortedList = [...list].sort((a, b) => {
        if (sortValue === 'Newest') {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        } else if (sortValue === 'Popular') {
          return b.likeCount - a.likeCount;
        } else if (sortValue === 'Name') {
          return a.characterName.localeCompare(b.characterName, 'ko-KR');
        }
        return 0;
      });

      setChatList(sortedList);
      setOffset(sortedList.length);
      setHasMore(sortedList.length === LIMIT);
    };

    fetchData();
  }, [filterValue, selectedTag, sortValue]);

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();

    const isToday =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();

    if (isToday) {
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const isAM = hours < 12;
      const displayHour = hours % 12 === 0 ? 12 : hours % 12;
      return `${isAM ? '오전' : '오후'} ${displayHour}:${minutes}`;
    } else {
      // YYYY-MM-DD 포맷
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  };

  return (
    <>
      <MessageTagList tags={tags} defaultTag="Chatroom" onTagChange={tag => setSelectedTag(tag)} />
      <FilterBar
        filters={[CharacterIP[1].toString(), CharacterIP[2].toString()]}
        sortOptions={['Newest', 'Popular', 'Name']}
        onFilterChange={filter => setFilterValue(filter)}
        onSortChange={sort => setSortValue(sort)}
      />
      <div className={styles.name}>Chat</div>
      <div className={styles.scrollArea}>
        {chatList?.map((item, index) => (
          <MessageProfile
            key={item.chatRoomId}
            profileImage={item.profileImageUrl}
            profileName={item.characterName}
            timestamp={formatTimestamp(item.updatedAt)} // 예: "2025-04-29T01:44:00.934Z"
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
            urlLinkKeyProfile={item.urlLinkKey}
            onClickOption={() => {
              setOpenOption(true);
            }}
          />
        ))}
        <div ref={observerRef} style={{height: '1px'}}></div>
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
