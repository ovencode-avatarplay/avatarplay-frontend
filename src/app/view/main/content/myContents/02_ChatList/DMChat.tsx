import React, {useEffect, useState} from 'react';
import styles from './Styles.module.css';
import MessageProfile, {BadgeType, FollowState} from '../01_Layout/MessageProfile';
import FilterBar from '../FilterBar';
import SwipeTagList from '@/components/layout/shared/SwipeTagList';
import {
  DMChatRoomInfo,
  GetDMChatRoomListReq,
  GetDMChatRoomListRes,
  sendGetDMChatRoomList,
  sendLeaveChatRoom,
  ChatRoomType,
  SearchCharacterRoomInfo,
  sendCheckUnreadReddot,
} from '@/app/NetWork/ChatMessageNetwork';
import {useInView} from 'react-intersection-observer';
import {CharacterIP} from '@/app/NetWork/CharacterNetwork';
import SelectDrawer from '@/components/create/SelectDrawer';
import {SelectDrawerArrowItem} from '@/components/create/SelectDrawerArrow';
import ProfilePopup from '../ProfilePopup';
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
];

// API 응답 타입 정의
interface DMChatRoomResponse {
  dmChatRoomList: DMChatRoomInfo[];
  dmChatRecommendProfileList: DMChatRoomInfo[];
}

const DMChat: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>(tags[0]);
  const [filterValue, setFilterValue] = useState<string>('Original');
  const [sortValue, setSortValue] = useState<string>('Newest');
  const [dmList, setDmList] = useState<DMChatRoomInfo[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [alreadyReceivedProfileIds, setAlreadyReceivedProfileIds] = useState<number[]>([]);
  const [openOption, setOpenOption] = useState(false);
  const [openLeavePopup, setOpenLeavePopup] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<DMChatRoomInfo | null>(null);
  const LIMIT = 10;
  const [isPinOpen, setIsPinOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [highlightMap, setHighlightMap] = useState<Record<number, boolean>>({});

  const {ref: observerRef, inView} = useInView();

  const handlePinToggle = async (roomId: number, isFix: boolean) => {
    try {
      await pinFix({
        type: PinTabType.DMChatMessage,
        typeValueId: roomId,
        isFix: isFix,
      });

      // 로컬 상태 업데이트
      setDmList(prevList => prevList.map(room => (room.roomId === roomId ? {...room, isPinFix: isFix} : room)));
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
              interactionType: InteractionType.Friend,
              typeValueId: selectedRoom.roomId,
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
          const selectedRoom = dmList.find(room => room.roomId === selectedRoomId);
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
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
        .getDate()
        .toString()
        .padStart(2, '0')}`;
    }
  };

  const fetchDMChatRooms = async (isRefreshAll = false) => {
    if (isLoading) return;
    setIsLoading(true);

    const currentOffset = isRefreshAll ? 0 : offset;

    try {
      const response = await sendGetDMChatRoomList({
        isDMChatRoom: true,
        search: '',
        interest: selectedTag === 'Chatroom' ? '' : selectedTag,
        sort: 0,
        page: {offset: currentOffset, limit: LIMIT},
        alreadyReceivedProfileIds: alreadyReceivedProfileIds,
      });

      // 태그에 따라 다른 리스트 사용
      let newList =
        selectedTag === 'Chatroom'
          ? response.data?.dmChatRoomList ?? []
          : response.data?.dmChatRecommendProfileList ?? [];

      // 필터 처리 (CharacterIP는 서버에서 따로 안 주므로 테스트용 로직)
      const filter = filterValue === 'Original' ? '1' : filterValue === 'Fan' ? '2' : '0';
      newList = newList.filter((_, i) => {
        const characterIP = i % 2 === 0 ? '1' : '2';
        return filter === '0' || filter === characterIP;
      });

      // 정렬
      newList.sort((a, b) => {
        if (sortValue === 'Newest') {
          return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
        } else if (sortValue === 'Oldest') {
          return new Date(a.lastMessageAt).getTime() - new Date(b.lastMessageAt).getTime();
        }
        return 0;
      });

      if (newList.length > 0) {
        const newProfileIds = newList.map(item => item.roomId);
        setAlreadyReceivedProfileIds(prev => [...prev, ...newProfileIds]);
      }

      if (isRefreshAll) {
        setDmList(newList);
      } else {
        setDmList(prev => [...prev, ...newList]);
      }

      setOffset(currentOffset + newList.length);
      setHasMore(newList.length === LIMIT);
    } catch (error) {
      console.error('DM 페이징 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    setAlreadyReceivedProfileIds([]);
    fetchDMChatRooms(true);
  }, [filterValue, sortValue, selectedTag]);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      fetchDMChatRooms(false);
    }
  }, [inView]);

  // 폴링으로 레드닷 상태 체크
  useEffect(() => {
    if (dmList.length === 0) return;
    let timer: NodeJS.Timeout;
    let isUnmounted = false;
    const poll = async () => {
      try {
        const roomIdList = dmList.map(dm => dm.roomId);
        if (roomIdList.length === 0) return;
        const res = await sendCheckUnreadReddot({checkRoomIdList: roomIdList});
        if (!isUnmounted && res.data?.dmChatUrlLinkKey) {
          const map: Record<number, boolean> = {};
          res.data.dmChatUrlLinkKey.forEach((item: {key: number; value: boolean}) => {
            map[item.key] = item.value;
          });
          setHighlightMap(map);
        }
      } catch (e) {
        // 에러 무시
      }
    };
    poll();
    timer = setInterval(poll, 2000);
    return () => {
      isUnmounted = true;
      clearInterval(timer);
    };
  }, [dmList]);

  const pinnedRooms = dmList.filter(dm => dm.isPinFix);
  const unpinnedRooms = dmList.filter(dm => !dm.isPinFix);
  const sortedDmList = [...pinnedRooms, ...unpinnedRooms];

  const handleLeaveChatRoom = async (roomId: number) => {
    try {
      const selectedRoom = dmList.find(room => room.roomId === roomId);
      if (!selectedRoom) return;

      await sendLeaveChatRoom({
        chatRoomType: ChatRoomType.DM,
        dmRoomId: selectedRoom.roomId,
        characterUrlLinkKey: '',
      });

      // 채팅방 목록에서 제거
      setDmList(prevList => prevList.filter(room => room.roomId !== roomId));
      setOpenLeavePopup(false);
      setSelectedRoomId(null);
      setSelectedRoom(null);
    } catch (error) {
      console.error('Failed to leave chat room:', error);
    }
  };

  const handleRoomSelect = (roomId: number) => {
    const room = dmList.find(room => room.roomId === roomId);
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
        filters={['Original', 'Fan']}
        sortOptions={['Newest', 'Oldest']}
        onFilterChange={filter => setFilterValue(filter)}
        onSortChange={sort => setSortValue(sort)}
      />
      <div className={styles.scrollArea}>
        {sortedDmList.map((dm, index) => (
          <MessageProfile
            key={dm.roomId}
            profileImage={dm.profileIconUrl}
            profileName={dm.profileName}
            timestamp={formatTimestamp(dm.lastMessageAt)}
            badgeType={index % 2 === 0 ? BadgeType.Original : BadgeType.Fan}
            followState={FollowState.None}
            isHighlight={highlightMap[dm.roomId] === true}
            isDM={true}
            isOption={true}
            isPin={dm.isPinFix}
            roomid={dm.roomId.toString()}
            urlLinkKey={dm.urlLinkKey}
            onClickOption={() => handleRoomSelect(dm.roomId)}
          />
        ))}
        <div ref={observerRef} style={{height: '1px'}} />
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

      {openLeavePopup && (
        <ProfilePopup
          type="alert"
          title="Alert"
          description="Do you want to leave the Chatroom?"
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
                if (selectedRoom) {
                  handleLeaveChatRoom(selectedRoom.roomId);
                }
              },
              isPrimary: true,
            },
          ]}
          badgeType={BadgeType.Original}
          profileDesc=""
          profileImage=""
          profileName=""
        />
      )}
    </>
  );
};

export default DMChat;
