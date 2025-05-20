import React, {useEffect, useState} from 'react';
import styles from './Styles.module.css';
import MessageProfile, {BadgeType, CheckType, FollowState} from '../01_Layout/MessageProfile';
import FilterBar from '../FilterBar';
import SwipeTagList from '@/components/layout/shared/SwipeTagList';
import SelectDrawer from '@/components/create/SelectDrawer';
import {SelectDrawerArrowItem} from '@/components/create/SelectDrawerArrow';
import ProfilePopup from '../ProfilePopup';
import {
  ChatRoomInfo,
  GetCharacterChatRoomListReq,
  GetCharacterChatRoomListRes,
  sendGetCharacterChatRoomList,
  sendLeaveChatRoom,
  ChatRoomType,
} from '@/app/NetWork/ChatMessageNetwork';
import {CharacterIP} from '@/app/NetWork/CharacterNetwork';
import {SportsVolleyballRounded} from '@mui/icons-material';
import {useInView} from 'react-intersection-observer';
import {pinFix, PinTabType, bookmark, InteractionType} from '@/app/NetWork/CommonNetwork';

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
  'common_filterinterest_dating',
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
  const [alreadyReceivedProfileIds, setAlreadyReceivedProfileIds] = useState<number[]>([]);
  const LIMIT = 10;
  const {ref: observerRef, inView} = useInView();
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoomInfo | null>(null);
  const [isPinOpen, setIsPinOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(true);

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
    setAlreadyReceivedProfileIds([]);
    setChatList([]);
  }, [filterValue, selectedTag, sortValue]);

  const handlePinToggle = async (roomId: number, isFix: boolean) => {
    try {
      await pinFix({
        type: PinTabType.CharacterChatMessage,
        typeValueId: roomId,
        isFix: isFix,
      });

      // 로컬 상태 업데이트
      setChatList(prevList => prevList.map(room => (room.chatRoomId === roomId ? {...room, isPinFix: isFix} : room)));
    } catch (error) {
      console.error('Failed to toggle pin:', error);
    }
  };

  const optionItems: SelectDrawerArrowItem[] = [
    {
      name: 'Favorites /Unfavorites',
      arrowName: '',
      onClick: async () => {
        if (selectedRoom) {
          try {
            const response = await bookmark({
              interactionType: InteractionType.Character,
              typeValueId: selectedRoom.characterProfileId,
              isBookMark: true,
            });

            if (response?.data) {
              // UI 업데이트 로직이 필요한 경우 여기에 추가
            }
            setOpenOption(false);
          } catch (e) {
            alert('즐겨찾기 실패');
          }
        }
      },
    },
    {
      name: 'Pin to Top / Unpin ',
      arrowName: '',
      onClick: () => {
        if (selectedRoomId) {
          const selectedRoom = chatList.find(room => room.chatRoomId === selectedRoomId);
          if (selectedRoom) {
            handlePinToggle(selectedRoomId, !selectedRoom.isPinFix);
          }
        }
        setOpenOption(false);
      },
    },
    {
      name: 'Leave',
      arrowName: '',
      onClick: () => {
        setOpenLeavePopup(true);
      },
    },
  ];

  const getFilter = (() => {
    switch (filterValue) {
      case 'Original':
        return CharacterIP.Original;
      case 'Fan':
        return CharacterIP.Fan;
      case 'None':
      default:
        return CharacterIP.None;
    }
  })();

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
        alreadyReceivedProfileIds: alreadyReceivedProfileIds,
        search: '',
      };

      const response = await sendGetCharacterChatRoomList(params);
      const newList = response.data?.chatRoomList ?? [];

      if (newList.length > 0) {
        const newProfileIds = newList.map(item => item.characterProfileId);
        setAlreadyReceivedProfileIds(prev => [...prev, ...newProfileIds]);
      }

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

  const pinnedRooms = chatList?.filter(item => item.isPinFix) ?? [];
  const unpinnedRooms = chatList?.filter(item => !item.isPinFix) ?? [];
  const sortedChatList = [...pinnedRooms, ...unpinnedRooms];

  const handleLeaveChatRoom = async (roomId: number) => {
    try {
      const selectedRoom = chatList.find(room => room.chatRoomId === roomId);
      if (!selectedRoom) return;

      await sendLeaveChatRoom({
        chatRoomType: ChatRoomType.Character,
        dmRoomId: 0,
        characterUrlLinkKey: selectedRoom.profileUrlLinkKey,
      });

      // 채팅방 목록에서 제거
      setChatList(prevList => prevList.filter(room => room.chatRoomId !== roomId));
      setOpenLeavePopup(false);
      setSelectedRoomId(null);
      setSelectedRoom(null);
    } catch (error) {
      console.error('Failed to leave chat room:', error);
    }
  };

  const handleRoomSelect = (roomId: number) => {
    const room = chatList.find(room => room.chatRoomId === roomId);
    if (room) {
      setSelectedRoomId(roomId);
      setSelectedRoom(room);
      setOpenOption(true);
    }
  };

  return (
    <>
      <SwipeTagList tags={tags} currentTag="Chatroom" onTagChange={tag => setSelectedTag(tag)} isBorder={false} />
      <FilterBar
        filters={[CharacterIP[1].toString(), CharacterIP[2].toString()]}
        sortOptions={['Newest', 'Popular', 'Name']}
        onFilterChange={filter => setFilterValue(filter)}
        onSortChange={sort => setSortValue(sort)}
      />
      <div className={styles.scrollArea}>
        {sortedChatList.map((item, index) => (
          <MessageProfile
            key={item.chatRoomId}
            profileImage={item.profileImageUrl}
            profileName={item.characterName}
            timestamp={formatTimestamp(item.updatedAt)}
            badgeType={
              item.characterIP == CharacterIP.Fan
                ? BadgeType.Fan
                : item.characterIP == CharacterIP.Original
                ? BadgeType.Original
                : BadgeType.None
            }
            followState={FollowState.None}
            isHighlight={false}
            isOption={true}
            isPin={item.isPinFix}
            roomid={item.chatRoomId.toString()}
            profileUrlLinkKey={item.profileUrlLinkKey}
            onClickOption={() => handleRoomSelect(item.chatRoomId)}
          />
        ))}
        <div style={{marginBottom: '80px'}}></div>
        <div ref={observerRef} style={{height: '1px'}}></div>
      </div>

      <SelectDrawer
        isOpen={openOption}
        items={optionItems}
        onClose={() => {
          setOpenOption(false);
          setSelectedRoomId(null);
        }}
        isCheck={false}
        selectedIndex={1}
      />
      {openLeavePopup && selectedRoom && (
        <ProfilePopup
          type="alert"
          title="Alert"
          description="Do uou want to leave the Chatroom?"
          buttons={[
            {
              label: 'Cancel',
              onClick: () => {
                setOpenLeavePopup(false);
                setSelectedRoom(null);
              },
              isPrimary: false,
            },
            {
              label: 'Leave',
              onClick: () => {
                if (selectedRoom) {
                  handleLeaveChatRoom(selectedRoom.chatRoomId);
                }
              },
              isPrimary: true,
            },
          ]}
          badgeType={selectedRoom.characterIP === CharacterIP.Fan ? BadgeType.Fan : BadgeType.Original}
          profileDesc={selectedRoom.characterName}
          profileImage={selectedRoom.profileImageUrl}
          profileName={selectedRoom.characterName}
        />
      )}
    </>
  );
};

export default CharacterChat;
