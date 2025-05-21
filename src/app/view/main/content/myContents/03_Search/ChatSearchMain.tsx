import React, {useState, useRef, useEffect, KeyboardEvent} from 'react';
import styles from './ChatSearchMain.module.css';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import {Drawer} from '@mui/material';
import SearchBar from './SearchBar';
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
  sendAddFriend,
  sendCancelAddFriend,
} from '@/app/NetWork/ChatMessageNetwork';
import {FilterDataItem} from '@/components/search/FilterSelector';
import MessageProfile, {BadgeType, FollowState} from '../01_Layout/MessageProfile';
import {sendGetCharacterChatRoomList, sendGetDMChatRoomList} from '@/app/NetWork/ChatMessageNetwork';
import {useInView} from 'react-intersection-observer';
import {CharacterIP} from '@/app/NetWork/CharacterNetwork';
import {addSearch} from './RecentSearchList';
import {followProfile} from '@/app/NetWork/ProfileNetwork';

import SelectDrawer from '@/components/create/SelectDrawer';
import {SelectDrawerArrowItem} from '@/components/create/SelectDrawerArrow';
import {bookmark, InteractionType} from '@/app/NetWork/CommonNetwork';
import {ToastMessageAtom, ToastType} from '@/app/Root';
import {useAtom} from 'jotai';
import SwipeTagList from '@/components/layout/shared/SwipeTagList';
import {LineArrowDown} from '@ui/Icons';

const tags = ['Following', 'Character', 'Friend', 'People'];
const popularTags = ['Romance', 'Fantasy', 'AI Friend'];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// SearchCharacterRoomInfo에 isFriendRequested 필드 추가(로컬 상태)
type SearchResultWithFriend = SearchCharacterRoomInfo & {followState?: FollowState};

const ChatSearchMain: React.FC<Props> = ({isOpen, onClose}) => {
  const [selectedTag, setSelectedTag] = useState<string>('Following');
  const [searchText, setSearchText] = useState<string>('');
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [favoriteList, setFavoriteList] = useState<SearchResultWithFriend[]>([]);
  const [normalList, setNormalList] = useState<SearchResultWithFriend[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [favoriteOpen, setFavoriteOpen] = useState(false);
  const [listOpen, setListOpen] = useState(true);
  // 필터, isAdult 상태를 기억하기 위한 ref
  const positiveFiltersRef = useRef<FilterDataItem[]>([]);
  const negativeFiltersRef = useRef<FilterDataItem[]>([]);
  const isAdultRef = useRef(true);

  const [dataToast, setDataToast] = useAtom(ToastMessageAtom);
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
  const [recentSearchVersion, setRecentSearchVersion] = useState(0);
  const [recentSearchItems, setRecentSearchItems] = useState<string[]>([]);

  // 최근 검색어와 추천 태그를 합친 배열
  const combinedList = [...recentSearchItems, ...popularTags];

  // 탭 변경 시 페이징 상태 초기화 및 첫 페이지 fetch
  useEffect(() => {
    if (isOpen === false) return;
    // 1. 리스트를 먼저 비움
    setFavoriteList([]);
    setNormalList([]);
    setFollowingProfileIds([]);
    setCharacterProfileIds([]);
    setFriendProfileIds([]);
    setPeopleProfileIds([]);
    setOffset(0);
    setHasMore(true);
    setFavoriteOpen(false);
    setListOpen(true);

    // 2. fetchMore는 다음 tick에서 실행 (비동기적으로)
    setTimeout(() => {
      fetchMore(true);
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTag, isOpen]);

  // inView가 true가 되면 다음 페이지 fetch
  useEffect(() => {
    if (inView && hasMore && !isPagingLoading && offset !== 0) {
      fetchMore();
    }
    // eslint-disable-next-line
  }, [inView]);

  const [openOption, setOpenOption] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<SearchResultWithFriend | null>(null);

  const handleClose = () => {
    setFavoriteList([]);
    setNormalList([]);
    setError(null);
    setSearchText('');
    setIsInputFocused(false);
    setFavoriteOpen(false);
    setFollowingProfileIds([]);
    setCharacterProfileIds([]);
    setFriendProfileIds([]);
    setPeopleProfileIds([]);
    setOffset(0);
    setHasMore(true);
    onClose();
  };

  // 기존 handleSearch는 사용하지 않음, 대신 fetchMore 사용
  const fetchMore = async (isRefreshAll = false) => {
    setIsPagingLoading(true);
    setIsLoading(true);
    setError(null);
    let newFavoriteList: SearchResultWithFriend[] = [];
    let newNormalList: SearchResultWithFriend[] = [];
    let currentOffset = isRefreshAll ? 0 : offset;
    const keyword = searchText;

    try {
      if (isRefreshAll) {
        // 모든 상태 초기화를 한 곳에서 처리
        setFavoriteList([]);
        setNormalList([]);
        setOffset(0);
        setHasMore(true);
        setFollowingProfileIds([]);
        setCharacterProfileIds([]);
        setFriendProfileIds([]);
        setPeopleProfileIds([]);
      }

      if (selectedTag === 'Following') {
        const response = await sendGetSearchFollowingList({
          characterIP: 0,
          search: keyword,
          positiveFilterTags: positiveFiltersRef.current.map(f => f.key),
          nagativeFilterTags: negativeFiltersRef.current.map(f => f.key),
          isAdults: isAdultRef.current,
          page: {offset: currentOffset, limit: LIMIT},
          alreadyReceivedProfileIds: followingProfileIds,
        });
        if (response.data) {
          newFavoriteList = response.data.favoriteCharacterList || [];
          newNormalList = response.data.followCharacterList || [];
        }
      } else if (selectedTag === 'Character') {
        const response = await sendGetSearchCharacterList({
          characterIP: 0,
          search: keyword,
          positiveFilterTags: positiveFiltersRef.current.map(f => f.key),
          nagativeFilterTags: negativeFiltersRef.current.map(f => f.key),
          isAdults: isAdultRef.current,
          page: {offset: currentOffset, limit: LIMIT},
          alreadyReceivedProfileIds: characterProfileIds,
        });
        if (response.data) {
          newNormalList = response.data.recommendCharacterList || [];
        }
      } else if (selectedTag === 'Friend') {
        const response = await sendGetSearchFriendList({
          search: keyword,
          page: {offset: currentOffset, limit: LIMIT},
          alreadyReceivedProfileIds: friendProfileIds,
        });
        if (response.data) {
          newFavoriteList = response.data.favoriteFriendList || [];
          newNormalList = response.data.friendList || [];
        }
      } else if (selectedTag === 'People') {
        const response = await sendGetSearchPeopleList({
          search: keyword,
          page: {offset: currentOffset, limit: LIMIT},
          alreadyReceivedProfileIds: peopleProfileIds,
        });
        if (response.data) {
          newNormalList = response.data.recommendPeopleList || [];
        }
      }

      if (newFavoriteList.length > 0 || newNormalList.length > 0) {
        const newProfileIds = [...newFavoriteList, ...newNormalList].map(item => item.characterProfileId);

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
          setFavoriteList(newFavoriteList);
          setNormalList(newNormalList);
        } else {
          setFavoriteList(prev => [...prev, ...newFavoriteList]);
          setNormalList(prev => [...prev, ...newNormalList]);
        }
        setOffset(currentOffset + LIMIT);

        // Following 태그일 때는 favoriteList와 normalList를 각각 확인
        if (selectedTag === 'Following') {
          setHasMore(newFavoriteList.length === LIMIT || newNormalList.length === LIMIT);
        } else {
          setHasMore(newNormalList.length === LIMIT);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      setError('검색 중 오류가 발생했습니다.');
    } finally {
      setIsPagingLoading(false);
      setIsLoading(false);
    }
  };

  // SearchBar에서 필터, isAdult 상태를 ref에 저장
  const handleSearchBarSearch = (
    keyword: string,
    isAdult: boolean,
    positiveFilters: FilterDataItem[],
    negativeFilters: FilterDataItem[],
  ) => {
    addSearch(keyword, recentSearchItems, setRecentSearchItems);
    isAdultRef.current = isAdult;
    positiveFiltersRef.current = positiveFilters;
    negativeFiltersRef.current = negativeFilters;
    setOffset(0);
    setHasMore(true);
    setFavoriteList([]);
    setNormalList([]);
    setIsInputFocused(false);
    setSearchText(keyword);
    fetchMore(true);
  };

  // 최근 검색어 선택 시
  const handleRecentSearchSelect = (keyword: string) => {
    setSearchText(keyword);
    setIsInputFocused(false);
    setTimeout(() => {
      handleSearchBarSearch(keyword, isAdultRef.current, positiveFiltersRef.current, negativeFiltersRef.current);
    }, 0);
  };

  // 추천 검색어 클릭 시
  const handlePopularTagClick = (tag: string) => {
    setSearchText(tag);
    setIsInputFocused(false);
    setTimeout(() => {
      handleSearchBarSearch(tag, isAdultRef.current, positiveFiltersRef.current, negativeFiltersRef.current);
    }, 0);
  };

  // 키보드 이벤트 핸들러 (최근 검색어만)
  const handleSearchBarKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isInputFocused || recentSearchItems.length === 0) return;
    if (e.key === 'Enter') {
      if (searchText.trim()) {
        handleSearchBarSearch(searchText, isAdultRef.current, positiveFiltersRef.current, negativeFiltersRef.current);
        e.preventDefault();
      }
    }
  };

  useEffect(() => {
    if (searchText == '') {
      handleSearchBarSearch(searchText, isAdultRef.current, positiveFiltersRef.current, negativeFiltersRef.current);
    }
  }, [searchText]);

  // Character Follow 버튼 클릭 핸들러
  const handleFollow = async (character: SearchResultWithFriend) => {
    try {
      await followProfile(character.characterProfileId, true);
      setFavoriteList(prev => prev.filter(item => item.characterProfileId !== character.characterProfileId));
      setNormalList(prev => prev.filter(item => item.characterProfileId !== character.characterProfileId));
    } catch (e) {
      alert('팔로우 실패');
    }
  };

  // People AddFriend/Cancel 버튼 클릭 핸들러
  const handleAddFriendToggle = async (person: SearchResultWithFriend) => {
    try {
      if (person.followState === FollowState.FriendCancel) {
        await sendCancelAddFriend({canceledProfileId: person.characterProfileId});
        setFavoriteList(prev =>
          prev.map(item =>
            item.characterProfileId === person.characterProfileId
              ? {...item, followState: FollowState.AddFriend}
              : item,
          ),
        );
        setNormalList(prev =>
          prev.map(item =>
            item.characterProfileId === person.characterProfileId
              ? {...item, followState: FollowState.AddFriend}
              : item,
          ),
        );
      } else {
        await sendAddFriend({addFriendProfileId: person.characterProfileId});
        setFavoriteList(prev =>
          prev.map(item =>
            item.characterProfileId === person.characterProfileId
              ? {...item, followState: FollowState.FriendCancel}
              : item,
          ),
        );
        setNormalList(prev =>
          prev.map(item =>
            item.characterProfileId === person.characterProfileId
              ? {...item, followState: FollowState.FriendCancel}
              : item,
          ),
        );
      }
    } catch (e) {
      alert('친구 추가/취소 실패');
    }
  };

  const handleRoomSelect = (room: SearchResultWithFriend) => {
    setSelectedRoomId(room.chatRoomId);
    setSelectedRoom(room);
    setOpenOption(true);
  };

  const optionItems: SelectDrawerArrowItem[] = [
    {
      name: 'Favorites /Unfavorites',
      arrowName: '',
      onClick: async () => {
        if (selectedRoom) {
          try {
            // 현재 선택된 프로필이 Favorite 목록에 있는지 확인
            const isInFavoriteList = favoriteList.some(
              item => item.characterProfileId === selectedRoom.characterProfileId,
            );

            const response = await bookmark({
              interactionType: selectedTag === 'Following' ? InteractionType.Character : InteractionType.Friend,
              typeValueId: selectedRoom.characterProfileId,
              isBookMark: !isInFavoriteList, // Favorite 목록에 있으면 false, 없으면 true
            });

            if (response?.data) {
              if (isInFavoriteList) {
                // Favorite 목록에서 제거
                setFavoriteList(prev =>
                  prev.filter(item => item.characterProfileId !== selectedRoom.characterProfileId),
                );
              } else {
                // Favorite 목록에 추가
                setFavoriteList(prev => {
                  const exists = prev.some(item => item.characterProfileId === selectedRoom.characterProfileId);
                  if (!exists) {
                    return [...prev, selectedRoom];
                  }
                  return prev;
                });
              }
            }
            setOpenOption(false);
          } catch (e) {
            alert('즐겨찾기 실패');
          }
        }
      },
    },
    {
      name: 'Unfriend/ Unfollow',
      arrowName: '',
      onClick: async () => {
        if (selectedRoom) {
          try {
            const result = await followProfile(selectedRoom.characterProfileId, false);
            if (result == 0) {
              // Following/Friend 목록에서만 제거
              if (selectedTag === 'Following' || selectedTag === 'Friend') {
                console.log('selectedRoomnormalList', selectedRoom, normalList);

                setNormalList(prev => prev.filter(item => item.characterProfileId !== selectedRoom.characterProfileId));
              }
            } else if (result != 0) {
              if (result == 22) {
                dataToast.open('이미 언팔로우 상태입니다.', ToastType.Error);
              }
            }
            setOpenOption(false);
          } catch (e) {
            alert('언팔로우 실패');
          }
        }
      },
    },
    {
      name: 'Report',
      arrowName: '',
      onClick: () => {
        if (selectedRoom) {
          // 채팅방 나가기 로직
        }
        setOpenOption(false);
      },
    },
  ];

  const renderCharacterList = (list: SearchResultWithFriend[]) => {
    if (selectedTag === 'Following' || selectedTag === 'Friend') {
      return (
        <div>
          <div className={styles.section}>
            <div className={styles.sectionHeader} onClick={() => setFavoriteOpen(!favoriteOpen)}>
              <div className={styles.sectionHeaderText}>Favorite ({favoriteList.length})</div>
              <img src={LineArrowDown.src} alt="arrow" style={{transform: `rotate(${favoriteOpen ? 180 : 0}deg)`}} />
            </div>
            {favoriteOpen &&
              favoriteList.map(character => {
                let badgeType = BadgeType.None;
                if (character.characterIP === CharacterIP.Original) badgeType = BadgeType.Original;
                else if (character.characterIP === CharacterIP.Fan) badgeType = BadgeType.Fan;

                return (
                  <MessageProfile
                    key={character.characterProfileId}
                    profileImage={character.profileImageUrl}
                    profileName={character.characterName}
                    badgeType={selectedTag == tags[2] || selectedTag == tags[3] ? BadgeType.None : badgeType}
                    followState={FollowState.None}
                    roomid={String(character.chatRoomId)}
                    isOption={true}
                    isPin={character.isPinFix}
                    onClickOption={() => handleRoomSelect(character)}
                    isDM={selectedTag === 'Friend'}
                    profileUrlLinkKey={character.profileUrlLinkKey}
                  />
                );
              })}
          </div>
          <div className={styles.section}>
            <div className={styles.sectionHeader} onClick={() => setListOpen(!listOpen)}>
              <div className={styles.sectionHeaderText}>{selectedTag}</div>
              <img src={LineArrowDown.src} alt="arrow" style={{transform: `rotate(${listOpen ? 180 : 0}deg)`}} />
            </div>
            {listOpen &&
              normalList.map(character => {
                let badgeType = BadgeType.None;
                if (character.characterIP === CharacterIP.Original) badgeType = BadgeType.Original;
                else if (character.characterIP === CharacterIP.Fan) badgeType = BadgeType.Fan;

                return (
                  <MessageProfile
                    key={character.characterProfileId}
                    profileImage={character.profileImageUrl}
                    profileName={character.characterName}
                    badgeType={selectedTag == tags[2] || selectedTag == tags[3] ? BadgeType.None : badgeType}
                    followState={FollowState.None}
                    roomid={String(character.chatRoomId)}
                    isOption={true}
                    isPin={character.isPinFix}
                    onClickOption={() => handleRoomSelect(character)}
                    isDM={selectedTag === 'Friend'}
                    profileUrlLinkKey={character.profileUrlLinkKey}
                  />
                );
              })}
          </div>
        </div>
      );
    }

    return (
      <div>
        {list.map(character => {
          let badgeType = BadgeType.None;
          if (character.characterIP === CharacterIP.Original) badgeType = BadgeType.Original;
          else if (character.characterIP === CharacterIP.Fan) badgeType = BadgeType.Fan;
          let followState =
            selectedTag === 'People' ? character.followState || FollowState.AddFriend : FollowState.Follow;

          return (
            <MessageProfile
              key={character.characterProfileId}
              profileImage={character.profileImageUrl}
              profileName={character.characterName}
              badgeType={selectedTag == tags[2] || selectedTag == tags[3] ? BadgeType.None : badgeType}
              followState={followState}
              roomid={String(character.chatRoomId)}
              isOption={false}
              isPin={character.isPinFix}
              isDM={true}
              profileUrlLinkKey={character.profileUrlLinkKey}
              onClickButton={() => {
                if (selectedTag === 'People') {
                  handleAddFriendToggle(character);
                } else {
                  handleFollow(character);
                }
              }}
            />
          );
        })}
      </div>
    );
  };

  const renderSearchResults = () => {
    if (error) {
      return <div className={styles.error}>{error}</div>;
    }
    if (!isLoading && favoriteList.length === 0 && normalList.length === 0) {
      return <EmptyState stateText="No search results found." />;
    }
    return (
      <div className={styles.searchResults}>
        {renderCharacterList(
          selectedTag === 'Following' || selectedTag === 'Friend' ? [...favoriteList, ...normalList] : normalList,
        )}

        {/* 무한 스크롤 트리거용 div */}
        {hasMore && <div ref={observerRef} style={{height: 1}} />}
        {isPagingLoading && (
          <div className={styles.loading} style={{position: 'absolute', bottom: 0, width: '100%'}}>
            불러오는 중...
          </div>
        )}
      </div>
    );
  };

  const renderSubMenu = () => {
    if (!isInputFocused) return null;
    return (
      <div className={styles.subMenu}>
        <RecentSearchList onSelect={handleRecentSearchSelect} />
        <PopularTagList tags={popularTags} onTagClick={handlePopularTagClick} />
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
          onSearchTextChange={setSearchText}
          onFocusChange={setIsInputFocused}
          onSearch={handleSearchBarSearch}
          onKeyDown={handleSearchBarKeyDown}
          value={searchText}
          onChange={setSearchText}
          selectTag={selectedTag}
        />
        <div className={styles.content}>
          <SwipeTagList tags={tags} currentTag={selectedTag} onTagChange={setSelectedTag} />
          {renderSubMenu()}
          {renderSearchResults()}
        </div>
      </div>
      <SelectDrawer
        isOpen={openOption}
        items={optionItems}
        onClose={() => {
          setOpenOption(false);
          setSelectedRoomId(null);
          setSelectedRoom(null);
        }}
        isCheck={false}
        selectedIndex={1}
      />
    </CustomDrawer>
  );
};

export default ChatSearchMain;
