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
import {CharacterIP} from '@/app/NetWork/CharacterNetwork';

const tags = ['Following', 'Character', 'Friend', 'People'];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ChatSearchMain: React.FC<Props> = ({isOpen, onClose}) => {
  const [selectedTag, setSelectedTag] = useState<string>('Following');
  const [searchText, setSearchText] = useState<string>('');
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<SearchCharacterRoomInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // 필터, isAdult 상태를 기억하기 위한 ref
  const positiveFiltersRef = useRef<FilterDataItem[]>([]);
  const negativeFiltersRef = useRef<FilterDataItem[]>([]);
  const isAdultRef = useRef(true);

  // 페이징 관련 상태
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isPagingLoading, setIsPagingLoading] = useState<boolean>(false);
  const [followingProfileIds, setFollowingProfileIds] = useState<number[]>([]);
  const [characterProfileIds, setCharacterProfileIds] = useState<number[]>([]);
  const [friendProfileIds, setFriendProfileIds] = useState<number[]>([]);
  const [peopleProfileIds, setPeopleProfileIds] = useState<number[]>([]);
  const LIMIT = 20;
  const {ref: observerRef, inView} = useInView();

  // 탭 변경 시 페이징 상태 초기화 및 첫 페이지 fetch
  useEffect(() => {
    if (isOpen == false) return;
    setOffset(0);
    setHasMore(true);
    setSearchResults([]);
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
    setSearchResults([]);
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

      if (isRefreshAll) {
        switch (selectedTag) {
          case 'Following':
            setFollowingProfileIds([]);
            break;
          case 'Character':
            setCharacterProfileIds([]);
            break;
          case 'Friend':
            setFriendProfileIds([]);
            break;
          case 'People':
            setPeopleProfileIds([]);
            break;
        }
      }

      if (selectedTag === 'Following') {
        const response = await sendGetSearchFollowingList({
          characterIP: 0,
          search: searchText,
          positiveFilterTags: positiveFiltersRef.current.map(f => f.key),
          nagativeFilterTags: negativeFiltersRef.current.map(f => f.key),
          isAdults: isAdultRef.current,
          page: {offset: currentOffset, limit: LIMIT},
          alreadyReceivedProfileIds: followingProfileIds,
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
          alreadyReceivedProfileIds: characterProfileIds,
        });
        newList = response.data?.recommendCharacterList || [];
      } else if (selectedTag === 'Friend') {
        const response = await sendGetSearchFriendList({
          search: searchText,
          page: {offset: currentOffset, limit: LIMIT},
          alreadyReceivedProfileIds: friendProfileIds,
        });
        newList = response.data?.friendList || [];
      } else if (selectedTag === 'People') {
        const response = await sendGetSearchPeopleList({
          search: searchText,
          page: {offset: currentOffset, limit: LIMIT},
          alreadyReceivedProfileIds: peopleProfileIds,
        });
        newList = response.data?.recommendPeopleList || [];
      }

      if (newList.length > 0) {
        const newProfileIds = newList.map(item => item.characterProfileId);

        switch (selectedTag) {
          case 'Following':
            setFollowingProfileIds(prev => [...prev, ...newProfileIds]);
            break;
          case 'Character':
            setCharacterProfileIds(prev => [...prev, ...newProfileIds]);
            break;
          case 'Friend':
            setFriendProfileIds(prev => [...prev, ...newProfileIds]);
            break;
          case 'People':
            setPeopleProfileIds(prev => [...prev, ...newProfileIds]);
            break;
        }

        if (isRefreshAll) {
          setSearchResults(newList);
        } else {
          setSearchResults(prev => [...prev, ...newList]);
        }
        setOffset(currentOffset + LIMIT);
        setHasMore(newList.length === LIMIT);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
      console.error('Error fetching data:', err);
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
    setSearchResults([]);
    setIsInputFocused(false);
    fetchMore(true);
  };

  const renderCharacterList = (list: SearchCharacterRoomInfo[]) => (
    <div>
      {list.map(character =>
        (() => {
          // BadgeType 매핑
          let badgeType = BadgeType.None;
          if (selectedTag === 'Character' || selectedTag === 'Following' || selectedTag === 'Friend') {
            if (character.characterIP === CharacterIP.Original) badgeType = BadgeType.Original;
            else if (character.characterIP === CharacterIP.Fan) badgeType = BadgeType.Fan;
          }
          // followState 매핑
          let followState = FollowState.None;
          if (selectedTag === 'Character') followState = FollowState.Follow;
          else if (selectedTag === 'People') followState = FollowState.AddFriend;
          // isOption 매핑
          const isOption = !(followState === FollowState.Follow || followState === FollowState.AddFriend);
          return (
            <>
              {selectedTag == 'Character' ? (
                <MessageProfile
                  key={character.chatRoomId}
                  profileImage={character.profileImageUrl}
                  profileName={character.characterName}
                  badgeType={badgeType}
                  followState={followState}
                  urlLinkKey={character.urlLinkKey}
                  roomid={String(character.chatRoomId)}
                  isOption={isOption}
                  isPin={character.isPinFix}
                  // 기타 필요한 props 추가
                />
              ) : selectedTag == 'People' ? (
                <>
                  <MessageProfile
                    key={character.chatRoomId}
                    profileImage={character.profileImageUrl}
                    profileName={character.characterName}
                    badgeType={badgeType}
                    followState={followState}
                    urlLinkKey={''}
                    roomid={String(character.chatRoomId)}
                    isOption={isOption}
                    isPin={character.isPinFix}
                    isDM={true}
                    profileUrlLinkKey={character.urlLinkKey}
                    // 기타 필요한 props 추가
                  />
                </>
              ) : (
                <MessageProfile
                  key={character.chatRoomId}
                  profileImage={character.profileImageUrl}
                  profileName={character.characterName}
                  badgeType={badgeType}
                  followState={followState}
                  urlLinkKey={character.urlLinkKey}
                  roomid={String(character.chatRoomId)}
                  isOption={isOption}
                  isPin={character.isPinFix}
                  // 기타 필요한 props 추가
                />
              )}
            </>
          );
        })(),
      )}
    </div>
  );

  const renderSearchResults = () => {
    if (isLoading && offset === 0) {
      return <div className={styles.loading}>검색 중...</div>;
    }
    if (error) {
      return <div className={styles.error}>{error}</div>;
    }
    if (searchResults.length === 0) {
      return <EmptyState stateText="No search results found." />;
    }
    return (
      <div className={styles.searchResults}>
        {renderCharacterList(searchResults)}
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
    <CustomDrawer
      anchor="right"
      open={isOpen}
      onClose={handleClose}
      className={styles.drawer}
      PaperProps={{
        className: styles.drawerPaper,
      }}
    >
      <div className={styles.container}>
        <SearchBar
          onBack={handleClose}
          onSearchTextChange={text => setSearchText(text)}
          onFocusChange={isFocused => setIsInputFocused(isFocused)}
          onSearch={handleSearchBarSearch}
        />
        <div className={styles.content}>
          <MessageTagList tags={tags} defaultTag={selectedTag} onTagChange={setSelectedTag} />
          {renderSubMenu()}
          {renderSearchResults()}
        </div>
      </div>
    </CustomDrawer>
  );
};

export default ChatSearchMain;
