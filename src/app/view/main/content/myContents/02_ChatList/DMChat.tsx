import React, {useEffect, useState} from 'react';
import styles from './Styles.module.css';
import MessageProfile, {BadgeType, FollowState} from '../01_Layout/MessageProfile';
import FilterBar from '../FilterBar';
import MessageTagList from '../01_Layout/MessageTagList';
import {DMChatRoomInfo, sendGetDMChatRoomList} from '@/app/NetWork/ChatMessageNetwork';
import {useInView} from 'react-intersection-observer';
import {CharacterIP} from '@/app/NetWork/CharacterNetwork';

const tags = ['All', 'My', 'Story', 'Music', 'Gravure', 'Custom1', 'Custom2'];

const DMChat: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState(tags[0]);
  const [filterValue, setFilterValue] = useState<string>('Original');
  const [sortValue, setSortValue] = useState<string>('Newest');
  const [dmList, setDmList] = useState<DMChatRoomInfo[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const LIMIT = 10;

  const {ref: observerRef, inView} = useInView();

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
        interest: '',
        sort: 0,
        page: {offset: currentOffset, limit: LIMIT},
        alreadyReceivedProfileIds: [],
      });

      let newList = response.data?.dmChatRoomList ?? [];

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
    fetchDMChatRooms(true);
  }, [filterValue, sortValue, selectedTag]);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      fetchDMChatRooms(false);
    }
  }, [inView]);

  return (
    <>
      <MessageTagList tags={tags} defaultTag="All" onTagChange={tag => setSelectedTag(tag)} />
      <FilterBar
        filters={['Original', 'Fan']}
        sortOptions={['Newest', 'Oldest']}
        onFilterChange={filter => setFilterValue(filter)}
        onSortChange={sort => setSortValue(sort)}
      />
      <div className={styles.name}>Chat</div>
      <div className={styles.scrollArea}>
        {dmList.map((dm, index) => (
          <MessageProfile
            key={dm.roomId}
            profileImage={dm.profileIconUrl}
            profileName={dm.profileName}
            timestamp={formatTimestamp(dm.lastMessageAt)}
            badgeType={index % 2 === 0 ? BadgeType.Original : BadgeType.Fan}
            followState={FollowState.Following}
            isHighlight={true}
            isDM={true}
            roomid={dm.roomId.toString()}
            urlLinkKey={dm.urlLinkKey}
          />
        ))}
        <div ref={observerRef} style={{height: '1px'}} />
      </div>
    </>
  );
};

export default DMChat;
