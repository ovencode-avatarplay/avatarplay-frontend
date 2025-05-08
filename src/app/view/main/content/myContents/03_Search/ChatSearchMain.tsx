import React, {useState, useRef, useEffect} from 'react';
import styles from './ChatSearchMain.module.css';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import {Drawer} from '@mui/material';
import SearchBar from './SearchBar';
import MessageTagList from '../01_Layout/MessageTagList';
import RecentSearchList from './RecentSearchList';
import PopularTagList from './PopularTagList';
import {relative} from 'path';
import EmptyState from '@/components/search/EmptyState';
import {
  sendGetSearchFollowingList,
  sendGetSearchCharacterList,
  sendGetSearchFriendList,
  sendGetSearchPeopleList,
  SearchCharacterRoomInfo,
} from '@/app/NetWork/ChatMessageNetwork';
import {FilterDataItem} from '@/components/search/FilterSelector';
import MessageProfile, {BadgeType, FollowState} from '../01_Layout/MessageProfile';
import {sendGetCharacterChatRoomList, sendGetDMChatRoomList} from '@/app/NetWork/ChatMessageNetwork';
import {useInView} from 'react-intersection-observer';

const tags = ['Following', 'Character', 'Friend', 'People'];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ChatSearchMain: React.FC<Props> = ({isOpen, onClose}) => {
  const [selectedTag, setSelectedTag] = useState(tags[0]);
  const [searchText, setSearchText] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    followBackCharacterList: SearchCharacterRoomInfo[];
    recommendCharacterList: SearchCharacterRoomInfo[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // 필터, isAdult 상태를 기억하기 위한 ref
  const positiveFiltersRef = useRef<FilterDataItem[]>([]);
  const negativeFiltersRef = useRef<FilterDataItem[]>([]);
  const isAdultRef = useRef(true);

  // 페이징 관련 상태
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isPagingLoading, setIsPagingLoading] = useState(false);
  const LIMIT = 10;
  const {ref: observerRef, inView} = useInView();

  // 탭 변경 시 페이징 상태 초기화 및 첫 페이지 fetch
  useEffect(() => {
    if (isOpen == false) return;
    setOffset(0);
    setHasMore(true);
    setSearchResults({followBackCharacterList: [], recommendCharacterList: []});
    fetchMore(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTag, isOpen]);

  // inView가 true가 되면 다음 페이지 fetch
  useEffect(() => {
    if (inView && hasMore && !isPagingLoading && offset !== 0) {
      fetchMore();
    }
    // eslint-disable-next-line
  }, [inView]);

  const handleClose = () => {
    setSearchResults(null);
    setError(null);
    setSearchText('');
    setIsInputFocused(false);
    onClose();
  };

  // 기존 handleSearch는 사용하지 않음, 대신 fetchMore 사용
  const fetchMore = async (isRefreshAll = false) => {
    setIsPagingLoading(true);
    setError(null);
    try {
      let newList: SearchCharacterRoomInfo[] = [];
      let currentOffset = isRefreshAll ? 0 : offset;
      if (selectedTag === 'Following') {
        const response = await sendGetSearchFollowingList({
          characterIP: 0,
          search: searchText,
          positiveFilterTags: positiveFiltersRef.current.map(f => f.key),
          nagativeFilterTags: negativeFiltersRef.current.map(f => f.key),
          isAdults: isAdultRef.current,
          page: {offset: currentOffset, limit: LIMIT},
        });
        newList = response.data?.followCharacterList || [];
      } else if (selectedTag === 'Character') {
        const response = await sendGetSearchCharacterList({
          characterIP: 0,
          search: searchText,
          positiveFilterTags: positiveFiltersRef.current.map(f => f.key),
          nagativeFilterTags: negativeFiltersRef.current.map(f => f.key),
          isAdults: isAdultRef.current,
          page: {offset: currentOffset, limit: LIMIT},
        });
        newList = response.data?.recommendCharacterList || [];
      } else if (selectedTag === 'Friend') {
        const response = await sendGetSearchFriendList({
          search: searchText,
          page: {offset: currentOffset, limit: LIMIT},
        });
        newList = response.data?.friendList || [];
      } else if (selectedTag === 'People') {
        const response = await sendGetSearchPeopleList({
          search: searchText,
          page: {offset: currentOffset, limit: LIMIT},
        });
        newList = response.data?.recommendPeopleList || [];
      }
      setSearchResults(prev => {
        if (!prev) return {followBackCharacterList: newList, recommendCharacterList: []};
        return {
          followBackCharacterList: isRefreshAll ? newList : [...prev.followBackCharacterList, ...newList],
          recommendCharacterList: [],
        };
      });
      if (newList.length < LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
      setOffset(prev => prev + LIMIT);
    } catch (err) {
      setError('검색 중 오류가 발생했습니다.');
    } finally {
      setIsPagingLoading(false);
    }
  };

  // SearchBar에서 필터, isAdult 상태를 ref에 저장
  const handleSearchBarSearch = (
    searchText: string,
    isAdult: boolean,
    positiveFilters: FilterDataItem[],
    negativeFilters: FilterDataItem[],
  ) => {
    isAdultRef.current = isAdult;
    positiveFiltersRef.current = positiveFilters;
    negativeFiltersRef.current = negativeFilters;
    setOffset(0);
    setHasMore(true);
    setSearchResults({followBackCharacterList: [], recommendCharacterList: []});
    fetchMore(true);
  };

  const renderCharacterList = (list: SearchCharacterRoomInfo[]) => (
    <div>
      {list.map(character => (
        <MessageProfile
          key={character.chatRoomId}
          profileImage={character.profileImageUrl}
          profileName={character.characterName}
          badgeType={BadgeType.None} // TODO: 실제 데이터에 맞게 매핑
          followState={FollowState.None} // TODO: 실제 데이터에 맞게 매핑
          urlLinkKey={character.urlLinkKey}
          roomid={String(character.chatRoomId)}
          isOption={true}
          isPin={character.isPinFix}
          // 기타 필요한 props 추가
        />
      ))}
    </div>
  );

  const renderSearchResults = () => {
    if (isLoading && offset === 0) {
      return <div className={styles.loading}>검색 중...</div>;
    }
    if (error) {
      return <div className={styles.error}>{error}</div>;
    }
    if (!searchResults) {
      return <EmptyState stateText="No search results found." />;
    }
    if (searchResults.followBackCharacterList.length === 0 && searchResults.recommendCharacterList.length === 0) {
      return <EmptyState stateText="No search results found." />;
    }
    return (
      <div className={styles.searchResults}>
        {searchResults.followBackCharacterList.length > 0 && (
          <div className={styles.resultSection}>
            <h3>팔로우백 캐릭터</h3>
            {renderCharacterList(searchResults.followBackCharacterList)}
          </div>
        )}
        {searchResults.recommendCharacterList.length > 0 && (
          <div className={styles.resultSection}>
            <h3>추천 캐릭터</h3>
            {renderCharacterList(searchResults.recommendCharacterList)}
          </div>
        )}
        {/* 무한 스크롤 트리거용 div */}
        {hasMore && <div ref={observerRef} style={{height: 1}} />}
        {isPagingLoading && <div className={styles.loading}>불러오는 중...</div>}
      </div>
    );
  };

  const renderSubMenu = () => {
    if (!isInputFocused) return null;
    return (
      <div className={styles.subMenu}>
        <RecentSearchList
          initialItems={['anime', 'Prince', 'anime3']}
          onRemove={keyword => console.log(`${keyword} removed`)}
        />
        <PopularTagList tags={['Romance', 'Fantasy', 'AI Friend']} onTagClick={tag => console.log('clicked:', tag)} />
      </div>
    );
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      ModalProps={{style: {zIndex: 3000}}}
      PaperProps={{
        className: styles.drawerContainer,
        sx: {width: '100%', height: '100%', position: 'relative'},
      }}
    >
      <SearchBar
        onBack={handleClose}
        onSearchTextChange={text => {
          setSearchText(text);
        }}
        onFocusChange={isFocused => setIsInputFocused(isFocused)}
        onSearch={handleSearchBarSearch}
      />

      <div className={styles.content}>
        {renderSubMenu()}

        <MessageTagList
          tags={tags}
          defaultTag={tags[0]}
          onTagChange={tag => {
            setSelectedTag(tag);
          }}
        />
        {renderSearchResults()}
      </div>
    </Drawer>
  );
};

export default ChatSearchMain;
