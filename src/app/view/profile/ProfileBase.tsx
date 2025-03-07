'use client';

import React, {useCallback, useEffect, useRef, useState} from 'react';

import {Box, Button, Drawer} from '@mui/material';
import ProfileTopEditMenu from './ProfileTopEditMenu';
import ProfileInfo from './ProfileInfo';
import profileData from 'data/profile/profile-data.json';
import ProfileTopViewMenu from './ProfileTopViewMenu';
import {
  BoldAltArrowDown,
  BoldArrowLeft,
  BoldCharacter,
  BoldComment,
  BoldContentLists,
  BoldDislike,
  BoldFollowers,
  BoldHeart,
  BoldImage,
  BoldLike,
  BoldMenuDots,
  BoldMore,
  BoldPin,
  BoldVideo,
  BoldViewGallery,
  LineArrowDown,
  LineCheck,
  LineCopy,
  LineMenu,
  LinePlus,
  LineShare,
} from '@ui/Icons';
import styles from './ProfileBase.module.scss';
import cx from 'classnames';
import Select, {components, StylesConfig} from 'react-select';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import {redirect, RedirectType, useParams, usePathname, useRouter, useSearchParams} from 'next/navigation';
import {
  CharacterProfileTabType,
  ExploreSortType,
  FeedMediaType,
  followProfile,
  FollowState,
  GetCharacterTabInfoeRes,
  getPdInfo,
  GetPdInfoRes,
  GetPdTabInfoeRes,
  getProfileCharacterTabInfo,
  getProfileInfo,
  GetProfileInfoRes,
  getProfileList,
  getProfilePdTabInfo,
  MediaState,
  PdProfileTabType,
  ProfileSimpleInfo,
  ProfileTabItemInfo,
  ProfileType,
  selectProfile,
} from '@/app/NetWork/ProfileNetwork';
import {useDispatch, useSelector} from 'react-redux';
import {setBottomNavColor} from '@/redux-store/slices/MainControl';
import {RootState} from '@/redux-store/ReduxStore';
import {updateProfile} from '@/redux-store/slices/Profile';
import {userDropDownAtom} from '@/components/layout/shared/UserDropdown';
import {useAtom} from 'jotai';
import Link from 'next/link';
import HamburgerBar from '../main/header/header-nav-bar/HamburgerBar';
import SharePopup from '@/components/layout/shared/SharePopup';
import {deleteFeed, FeedInfo, PinFixFeedReq, updatePin} from '@/app/NetWork/ShortsNetwork';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import {
  GetCharacterInfoReq,
  GetCharacterInfoRes,
  sendDeleteCharacter,
  sendGetCharacterInfo,
} from '@/app/NetWork/CharacterNetwork';
import {CharacterInfo} from '@/redux-store/slices/StoryInfo';
import {CharacterProfileDetailComponent} from '@/app/[lang]/(pages)/profile/detail/[[...id]]/page';
import {getBackUrl} from '@/utils/util-1';
import {useInView} from 'react-intersection-observer';
import {getCurrentLanguage, getLocalizedLink} from '@/utils/UrlMove';
import {deleteChannel, getChannelInfo, GetChannelRes} from '@/app/NetWork/ChannelNetwork';
import {channel} from 'diagnostics_channel';
import 'swiper/css';
import 'swiper/css/navigation'; // 필요시 다른 모듈도 가져오기
import PopupSubscription from '../main/content/create/common/PopupSubscription';
import PopupSubscriptionList from './PopupSubscriptionList';
import PopupFavoriteList from './PopupFavoriteList';
import PopupPlaylist from './PopupPlaylist';
import {sendDeleteContent} from '@/app/NetWork/ContentNetwork';

export enum eTabCommonType {
  Feed,
  Character,
  Channel,
  Contents,
  Game,
}

export enum eTabPDType {
  Feed,
  Channel = 1,
  Character = 2,
  Shared = 3,
}

export enum eTabPDOtherType {
  Feed,
  Info = 90, //Info를 앞에 배치하되 api랑 sync를 맞춰야해서 3으로 줌
  Channel = 1,
  Character = 2,
}

export enum eTabCharacterType {
  Feed,
  Info = 90,
  Contents = 1,
  Channel,
  Character,
  Game,
}

export enum eTabCharacterOtherType {
  Feed,
  Info = 90,
  Contents = 1,
  Channel,
  Character,
  Game,
}
export enum eTabChannelType {
  Feed,
  Contents = 1,
  Character,
  Game,
}

export enum eTabChannelOtherType {
  Feed,
  Info = 90,
  Contents = 1,
  Character,
  Game,
}

export enum eCharacterFilterType {
  Total,
  Original = 1,
  Fan = 2,
}

export enum eContentFilterType {
  Total,
  Series = 1,
  Single = 2,
}

export enum eSharedFilterType {
  Total,
  Channel = 1,
  Character = 2,
}

type TabContentMenuType = {
  isSettingOpen: boolean;
  isPin: boolean;
  id: number;
};

type DataProfileType = {
  profileId: number;
  indexTab:
    | eTabPDType
    | eTabCharacterType
    | eTabPDOtherType
    | eTabCharacterOtherType
    | eTabChannelType
    | eTabChannelOtherType;
  isOpenSelectProfile: boolean;
  profileInfo: null | GetProfileInfoRes;
  profileTabInfo: {
    [key: number]: GetCharacterTabInfoeRes &
      GetPdTabInfoeRes &
      GetCharacterInfoRes & {dataResPdInfo: GetPdInfoRes} & GetChannelRes;
  };
  filterCluster: FilterClusterType;

  isShowMore: boolean;
  isNeedShowMore: boolean;
  isMyMenuOpened: boolean;
  isShareOpened: boolean;

  tabContentMenu: TabContentMenuType;

  isOpenPopupSubscription: boolean;
  isOpenPopupSubscriptionList: boolean;
  isOpenPopupFavoritesList: boolean;
  isOpenPopupPlayList: boolean;

  gap: number;

  refreshProfileTab: (profileId: number, indexTab: number, isRefreshAll?: boolean) => void;
  getIsEmptyTab: () => boolean;
};

type ProfileBaseProps = {
  profileId?: number;
  onClickBack?: () => void;
  isPath?: boolean;
  maxWidth?: string;
};

const getUserType = (isMine: boolean, profileType: ProfileType) => {
  const isPD = [ProfileType.PD, ProfileType.User].includes(profileType);
  const isCharacter = [ProfileType.Character].includes(profileType);
  const isChannel = [ProfileType.Channel].includes(profileType);
  const isMyPD = isMine && isPD;
  const isMyCharacter = isMine && isCharacter;
  const isMyChannel = isMine && isChannel;
  const isOtherPD = !isMine && isPD;
  const isOtherCharacter = !isMine && isCharacter;
  const isOtherChannel = !isMine && isChannel;
  return {
    isPD,
    isCharacter,
    isMyPD,
    isMyCharacter,
    isOtherPD,
    isOtherCharacter,
    isChannel,
    isMyChannel,
    isOtherChannel,
  };
};

// /profile?type=pd?id=123123
const ProfileBase = React.memo(({profileId = 0, onClickBack = () => {}, isPath = false}: ProfileBaseProps) => {
  const searchParams = useSearchParams();
  const isNeedBackBtn = searchParams?.get('from'); // "from" 쿼리 파라미터 값 가져오기
  const [dataUserDropDown, setUserDropDown] = useAtom(userDropDownAtom);
  const router = useRouter();
  const pathname = usePathname();
  const refDescription = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<DataProfileType>({
    profileId: profileId,
    indexTab: eTabPDType.Feed,
    isOpenSelectProfile: false,
    profileInfo: null,
    profileTabInfo: {},

    filterCluster: {
      indexFilterMedia: FeedMediaType.Total,
      indexFilterCharacter: 0,
      indexFilterShared: 0,
      indexFilterChannel: 0,
      indexFilterContent: 0,
      indexSort: ExploreSortType.MostPopular,
    },
    isShowMore: false,
    isNeedShowMore: false,
    isMyMenuOpened: false,
    isShareOpened: false,

    tabContentMenu: {
      isSettingOpen: false,
      isPin: false,
      id: 0,
    },

    isOpenPopupSubscription: false,
    isOpenPopupSubscriptionList: false,
    isOpenPopupFavoritesList: false,
    isOpenPopupPlayList: false,

    gap: 0,

    refreshProfileTab: (profileId, indexTab, isRefreshAll = false) => {},
    getIsEmptyTab: () => true,
  });
  const dispatch = useDispatch();

  const isMine = data.profileInfo?.isMyProfile || false;
  const profileType = Number(data.profileInfo?.profileInfo?.type);
  const {isPD, isCharacter, isMyPD, isMyCharacter, isOtherPD, isOtherCharacter, isChannel, isOtherChannel} =
    getUserType(isMine, profileType);

  useEffect(() => {
    data.refreshProfileTab = refreshProfileTab;
    data.getIsEmptyTab = getIsEmptyTab;
  }, [data]);

  useEffect(() => {
    clearProfileTab();
    if (!isPath) {
      refreshProfileInfo(profileId);
      return;
    } else {
      //컴포넌트로 가져다 쓰는 경우 isPath=fase
      const id = pathname?.split('/').filter(Boolean).pop();
      if (id == undefined) return;
      const profileIdPath = parseInt(id);
      data.profileId = profileIdPath;
      refreshProfileInfo(profileIdPath);
      setData({...data});
      return;
    }
  }, [pathname]);

  useEffect(() => {
    if (!isPath) return;
    dispatch(setBottomNavColor(1));
    // refreshProfileInfo(profileId);
  }, []);

  useEffect(() => {
    if (refDescription.current) {
      const element = refDescription.current;
      const lineHeight = parseFloat(window.getComputedStyle(element).lineHeight);
      const height = element.clientHeight;
      const lineCount = Math.round(height / lineHeight);
      data.isNeedShowMore = lineCount > 3;
      setData({...data});
    }
  }, [data.profileInfo?.profileInfo.description]); // 내용이 바뀔 때마다 검사

  const getTabInfo = (
    typeProfile: ProfileType,
  ): ((
    profileId: number,
    tabIndex: number,
    indexSort: ExploreSortType,
    indexFilterMedia: FeedMediaType,
    offset: number,
    limit: number,
  ) => Promise<any>) => {
    if (typeProfile === ProfileType.User || typeProfile === ProfileType.PD) {
      return getProfilePdTabInfo;
    } else if (typeProfile === ProfileType.Character) {
      return getProfileCharacterTabInfo; // 타입 캐스팅 추가
    } else if (typeProfile === ProfileType.Channel) {
      return getProfileCharacterTabInfo;
    } else {
      return async (profileId: number, tabType: PdProfileTabType) => {
        return null;
      };
    }
  };
  const getTabContentCount = (indexTab: number) => {
    let count = 0;
    if (isPD) {
      if (indexTab == eTabPDType.Feed) {
        count = data.profileTabInfo[indexTab]?.feedInfoList?.length;
      } else if (indexTab == eTabPDType.Character) {
        count = data.profileTabInfo[indexTab]?.characterInfoList?.length;
      } else if (indexTab == eTabPDType.Channel) {
        count = data.profileTabInfo[indexTab]?.channelInfoList?.length;
      } else if (indexTab == eTabPDType.Shared) {
        count = 0;
      } else {
        count = 0;
      }
    } else if (isCharacter) {
      if (indexTab == eTabCharacterType.Feed) {
        count = data.profileTabInfo[indexTab]?.feedInfoList?.length;
      } else if (indexTab == eTabCharacterType.Channel) {
        count = data.profileTabInfo[indexTab]?.channelInfoList?.length;
      } else if (indexTab == eTabCharacterType.Contents) {
        count = data.profileTabInfo[indexTab]?.contentInfoList?.length;
      } else if (indexTab == eTabCharacterType.Character) {
        count = data.profileTabInfo[indexTab]?.characterInfoList?.length;
      } else count = 0;
    } else if (isChannel) {
      if (indexTab == eTabChannelType.Feed) {
        count = data.profileTabInfo[indexTab]?.feedInfoList?.length;
      } else if (indexTab == eTabChannelType.Contents) {
        count = data.profileTabInfo[indexTab]?.contentInfoList?.length;
      } else if (indexTab == eTabCharacterType.Character) {
        count = data.profileTabInfo[indexTab]?.characterInfoList?.length;
      } else count = 0;
    } else {
      count = 0;
    }
    return count;
  };

  const clearProfileTab = () => {
    data.profileTabInfo = {};
    setData({...data});
  };

  const refreshProfileTab = async (profileId: number, indexTab: number, isRefreshAll: boolean = false) => {
    const profileType = data.profileInfo?.profileInfo?.type;
    if (profileType == undefined) return;
    let resProfileTabInfo = null;
    if (isCharacter && indexTab == eTabCharacterOtherType.Info) {
      const reqSendGetCharacterInfo: GetCharacterInfoReq = {
        languageType: getCurrentLanguage(),
        characterId: data.profileInfo?.profileInfo?.typeValueId || 0,
      };
      const resGetCharacterInfo = await sendGetCharacterInfo(reqSendGetCharacterInfo);
      if (resGetCharacterInfo.resultCode != 0) {
        console.error('api error : ', resGetCharacterInfo.resultMessage);
        return;
      }
      resProfileTabInfo = resGetCharacterInfo.data;
    } else if (isOtherPD && indexTab == eTabPDOtherType.Info) {
      const resPdInfo = await getPdInfo({profileId: profileId});
      if (resPdInfo?.resultCode != 0) {
        console.error('api error : ', resPdInfo?.resultMessage);
        return;
      }
      resProfileTabInfo = {dataResPdInfo: resPdInfo?.data};
    } else if (isOtherChannel && indexTab == eTabChannelOtherType.Info) {
      const resChannelInfo = await getChannelInfo({channelProfileId: profileId});
      if (resChannelInfo?.resultCode != 0) {
        console.error('api error : ', resChannelInfo?.resultMessage);
        return;
      }
      resProfileTabInfo = resChannelInfo?.data;
    } else {
      if (indexTab == eTabPDType.Character) {
        resProfileTabInfo = await getTabInfo(profileType)(
          profileId,
          indexTab,
          data.filterCluster?.indexSort || 0,
          data.filterCluster?.indexFilterCharacter || 0,
          isRefreshAll ? 0 : getTabContentCount(indexTab),
          isRefreshAll ? getTabContentCount(indexTab) : 10,
        );
      } else {
        resProfileTabInfo = await getTabInfo(profileType)(
          profileId,
          indexTab,
          data?.filterCluster.indexSort || 0,
          data?.filterCluster.indexFilterMedia || 0,
          isRefreshAll ? 0 : getTabContentCount(indexTab),
          isRefreshAll ? getTabContentCount(indexTab) : 10,
        );
      }
    }
    if (!resProfileTabInfo) return;

    // data.profileTabInfo[indexTab] = resProfileTabInfo;
    addTabContent(indexTab, resProfileTabInfo, isRefreshAll);
    setData({...data});
  };

  const addTabContent = (
    indexTab: number,
    resProfileTabInfo: GetCharacterTabInfoeRes &
      GetPdTabInfoeRes &
      GetCharacterInfoRes & {dataResPdInfo: GetPdInfoRes} & GetChannelRes,
    isRefreshAll: boolean,
  ) => {
    const {
      feedInfoList,
      characterInfoList,
      channelInfoList,
      storyInfoList,
      dataResPdInfo,
      channelInfo,
      contentInfoList,
    } = resProfileTabInfo;
    if (!data.profileTabInfo[indexTab]) {
      data.profileTabInfo[indexTab] = resProfileTabInfo;
      return;
    }

    if (!!channelInfo) {
      data.profileTabInfo[indexTab].channelInfo = channelInfo;
    }

    if (!!feedInfoList) {
      if (isRefreshAll) {
        data.profileTabInfo[indexTab].feedInfoList = feedInfoList;
      } else {
        data.profileTabInfo[indexTab]?.feedInfoList.push(...feedInfoList);
      }
    }
    if (!!characterInfoList) {
      if (isRefreshAll) {
        data.profileTabInfo[indexTab].characterInfoList = characterInfoList;
      } else {
        data.profileTabInfo[indexTab]?.characterInfoList.push(...characterInfoList);
      }
    }
    if (!!channelInfoList) {
      if (isRefreshAll) {
        data.profileTabInfo[indexTab].channelInfoList = channelInfoList;
      } else {
        data.profileTabInfo[indexTab]?.channelInfoList.push(...channelInfoList);
      }
    }
    if (!!contentInfoList) {
      if (isRefreshAll) {
        data.profileTabInfo[indexTab].contentInfoList = contentInfoList;
      } else {
        data.profileTabInfo[indexTab].contentInfoList.push(...contentInfoList);
      }
    }
    if (!!storyInfoList) {
      if (isRefreshAll) {
        data.profileTabInfo[indexTab].storyInfoList = storyInfoList;
      } else {
        data.profileTabInfo[indexTab].storyInfoList.push(...storyInfoList);
      }
    }
  };

  const refreshProfileInfo = async (profileId: number) => {
    const resProfileInfo = await getProfileInfo(profileId);
    if (!resProfileInfo) return;
    data.profileInfo = resProfileInfo;

    const indexTab = Number(data?.indexTab);
    await refreshProfileTab(profileId, indexTab);

    setData({...data});
  };

  const handleShare = async (url: string = window.location.href) => {
    const shareData = {
      title: '공유하기 제목',
      text: '이 링크를 확인해보세요!',
      url: url, // 현재 페이지 URL
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData); // 네이티브 공유 UI 호출
      } catch (error) {
        console.error('공유 실패:', error);
      }
    } else {
      data.isShareOpened = true;
      setData({...data});
    }
  };

  const handleFollow = async (profileId: number, value: boolean) => {
    try {
      const response = await followProfile(profileId, value);

      const resProfileInfo = await getProfileInfo(profileId);
      if (!resProfileInfo) return;
      data.profileInfo = resProfileInfo;
      setData({...data});
    } catch (error) {
      console.error('An error occurred while Following:', error);
    }
  };

  const routerBack = () => {
    // you can get the prevPath like this
    const prevPath = getBackUrl();
    if (!prevPath || prevPath == '') {
      router.replace(getLocalizedLink('/main/homefeed'));
    } else {
      router.replace(prevPath);
    }
  };

  const getIsEmptyTab = () => {
    let isEmptyTab = false;
    if (isPD) {
      if (data.indexTab == eTabPDType.Feed) {
        isEmptyTab = !data?.profileTabInfo?.[data.indexTab]?.feedInfoList?.length;
      } else if (data.indexTab == eTabPDType.Character) {
        isEmptyTab = !data?.profileTabInfo?.[data.indexTab]?.characterInfoList?.length;
      } else if (data.indexTab == eTabPDType.Channel) {
        isEmptyTab = !data?.profileTabInfo?.[data.indexTab]?.channelInfoList?.length;
        console.log('length : ', data?.profileTabInfo?.[data.indexTab]?.channelInfoList?.length);
      } else if (isOtherPD && data.indexTab == eTabPDOtherType.Info) {
        isEmptyTab = false;
      } else {
        isEmptyTab = true;
      }
    } else if (isCharacter) {
      if (data.indexTab == eTabCharacterType.Feed) {
        isEmptyTab = !data?.profileTabInfo?.[data.indexTab]?.feedInfoList?.length;
      } else if (data.indexTab == eTabCharacterType.Contents) {
        isEmptyTab = !data?.profileTabInfo?.[data.indexTab]?.contentInfoList?.length;
      } else if (data.indexTab == eTabCharacterType.Channel) {
        isEmptyTab = !data?.profileTabInfo?.[data.indexTab]?.channelInfoList?.length;
      } else if (data.indexTab == eTabCharacterOtherType.Info) {
        isEmptyTab = !data?.profileTabInfo?.[data.indexTab]?.characterInfo;
      } else if (data.indexTab == eTabCharacterType.Character) {
        isEmptyTab = !data?.profileTabInfo?.[data.indexTab]?.characterInfoList.length;
      } else {
        isEmptyTab = true;
      }
    } else if (isChannel) {
      if (data.indexTab == eTabChannelType.Feed) {
        isEmptyTab = !data?.profileTabInfo?.[data.indexTab]?.feedInfoList?.length;
      }
      // else if (data.indexTab == eTabCharacterType.Contents) {
      //   isEmptyTab = !data?.profileTabInfo?.[data.indexTab]?.contentsInfoList?.length;
      // }
      else if (data.indexTab == eTabChannelType.Contents) {
        isEmptyTab = !data?.profileTabInfo?.[data.indexTab]?.contentInfoList?.length;
      } else if (data.indexTab == eTabChannelOtherType.Info) {
        isEmptyTab = !data?.profileTabInfo?.[data.indexTab]?.characterInfo;
      } else if (data.indexTab == eTabChannelType.Character) {
        isEmptyTab = !data?.profileTabInfo?.[data.indexTab]?.characterInfoList?.length;
      } else {
        isEmptyTab = true;
      }
    } else {
      isEmptyTab = true;
    }
    return isEmptyTab;
  };

  const isFollow = data.profileInfo?.profileInfo.followState == FollowState.Follow;
  let isEmptyTab = getIsEmptyTab();

  const getEditUrl = (profileType: ProfileType) => {
    if ([ProfileType.User, ProfileType.PD].includes(profileType)) {
      return getLocalizedLink(`/profile/update/` + data.profileId);
    } else if ([ProfileType.Character].includes(profileType)) {
      return getLocalizedLink(`/update/character/` + data.profileInfo?.profileInfo.typeValueId);
    } else if ([ProfileType.Channel].includes(profileType)) {
      return getLocalizedLink(`/update/channel/` + data.profileId);
    }
    return getLocalizedLink(``);
  };

  console.log('profileId : ', profileId);
  return (
    <>
      {isMine && (
        <div className={styles.buttonWrap}>
          <button
            className={styles.subscribe}
            onClick={() => {
              data.isOpenPopupSubscriptionList = true;
              setData({...data});
            }}
          >
            Subscribe
          </button>
          <button
            className={styles.favorite}
            onClick={() => {
              data.isOpenPopupFavoritesList = true;
              setData({...data});
            }}
          >
            Favorites
          </button>
          <button
            className={styles.playlist}
            onClick={() => {
              data.isOpenPopupPlayList = true;
              setData({...data});
            }}
          >
            Playlist
          </button>
        </div>
      )}
      <section className={cx(styles.header, !isPath && styles.headerNoPath)}>
        <div className={styles.left}>
          {((!isMine && isPath) || isNeedBackBtn) && (
            <div
              className={styles.backBtn}
              onClick={() => {
                routerBack();
              }}
            >
              <img src={BoldArrowLeft.src} alt="" />
            </div>
          )}
          <div
            className={styles.selectProfileNameWrap}
            onClick={() => {
              if (!isMine) return;
              dataUserDropDown.onClickLong();
            }}
          >
            <div className={styles.left}>
              {isCharacter && <div className={styles.originalFan}>Original</div>}
              <div className={styles.profileName}>{data.profileInfo?.profileInfo.name}</div>
            </div>
            {isMine && (
              <div className={styles.iconSelect}>
                <img src={LineArrowDown.src} alt="" />
              </div>
            )}
          </div>
        </div>
        <div className={styles.right}>
          <img
            className={cx(styles.icon, styles.iconShare)}
            src={LineShare.src}
            alt=""
            onClick={() => {
              handleShare();
            }}
          />
          {isMine && (
            <img
              className={cx(styles.icon, styles.iconMenu)}
              onClick={e => {
                setData(v => ({...v, isMyMenuOpened: true}));
              }}
              src={LineMenu.src}
              alt=""
            />
          )}

          {!isMine && (
            <img className={cx(styles.icon, styles.iconNotification)} src="/ui/profile/icon_notification.svg" alt="" />
          )}
          {!isMine && <img className={cx(styles.icon, styles.iconSetting)} src={BoldMenuDots.src} alt="" />}
        </div>
      </section>
      <section className={cx(styles.main, !isPath && styles.mainNoPath)}>
        <div className={styles.profileStatisticsWrap}>
          <div className={styles.imgProfileWrap}>
            <img className={styles.imgProfile} src={data.profileInfo?.profileInfo.iconImageUrl} alt="" />
            {isMine && (
              <Link href={getEditUrl(profileType)}>
                <div className={styles.iconProfileEditWrap}>
                  <img className={styles.icon} src="/ui/profile/icon_edit.svg" alt="" />
                </div>
              </Link>
            )}
          </div>

          <div className={styles.itemStatistic}>
            <div className={styles.count}>{data.profileInfo?.profileInfo.postCount}</div>
            <div className={styles.label}>Posts</div>
          </div>
          <div className={styles.itemStatistic}>
            <div className={styles.count}>{data.profileInfo?.profileInfo.followerCount}</div>
            <div className={styles.label}>Followers</div>
          </div>
          <div className={styles.itemStatistic}>
            <div className={styles.count}>{data.profileInfo?.profileInfo.followingCount}</div>
            <div className={styles.label}>Following</div>
          </div>
        </div>
        <div className={styles.profileDetail}>
          <div className={styles.nameWrap}>
            <div className={styles.name}>{data.profileInfo?.profileInfo?.name}</div>
            {!isMine && <img className={styles.iconCopy} src={LineCopy.src} alt="" />}
          </div>
          {isPD && (
            <div className={styles.verify}>
              <span className={styles.label}>Creator</span>
              <img className={styles.icon} src="/ui/profile/icon_verify.svg" alt="" />
            </div>
          )}
          {isCharacter && (
            <div className={styles.verify}>
              <Link href={getLocalizedLink(`/profile/` + data.profileInfo?.profileInfo.pdProfileId + '?from=""')}>
                <span className={styles.label}>Manager: {data.profileInfo?.profileInfo?.pdEmail}</span>
              </Link>
            </div>
          )}
          <div
            ref={refDescription}
            className={cx(
              styles.hashTag,
              data.isNeedShowMore && styles.needShowMore,
              data.isShowMore && styles.showAll,
            )}
          >
            {data.profileInfo?.profileInfo.description}
          </div>
          {data.isNeedShowMore && !data.isShowMore && (
            <div
              className={styles.showMore}
              onClick={() => {
                data.isShowMore = true;
                setData({...data});
              }}
            >
              Show more...
            </div>
          )}
          {isMyPD && (
            <div className={styles.buttons}>
              <button className={styles.ad}>AD</button>
              <button
                className={styles.friends}
                onClick={() => {
                  alert('Add friends 구현 예정');
                }}
              >
                Add Friends
              </button>
            </div>
          )}
          {isMyCharacter && (
            <div className={styles.buttons}>
              <button className={styles.ad}>AD</button>
              <button className={styles.chat}>
                <Link href={getLocalizedLink(`/profile/detail/` + data.profileInfo?.profileInfo.typeValueId)}>
                  Chat
                </Link>
              </button>
            </div>
          )}
          {isOtherPD && (
            <div className={styles.buttonsOtherPD}>
              <button
                className={styles.follow}
                onClick={() => {
                  handleFollow(profileId, !isFollow);
                }}
              >
                {isFollow ? 'Following' : 'Follow'}
              </button>
              <button className={styles.gift}>
                <img className={styles.icon} src="/ui/profile/icon_gift.svg" alt="" />
              </button>
            </div>
          )}
          {isOtherCharacter && (
            <div className={styles.buttonsOtherCharacter}>
              <button
                className={styles.subscribe}
                onClick={() => {
                  data.isOpenPopupSubscription = true;
                  setData({...data});
                }}
              >
                Subscribe
              </button>
              <button
                className={styles.follow}
                onClick={() => {
                  handleFollow(profileId, !isFollow);
                }}
              >
                {isFollow ? 'Following' : 'Follow'}
              </button>
              <button className={styles.giftWrap}>
                <img className={styles.icon} src="/ui/profile/icon_gift.svg" alt="" />
              </button>
              <button className={styles.chat}>
                <Link href={getLocalizedLink(`/profile/detail/` + data.profileInfo?.profileInfo.typeValueId)}>
                  Chat
                </Link>
              </button>
            </div>
          )}
        </div>
        <section className={styles.tabSection}>
          <div className={styles.tabHeaderContainer}>
            <TabHeaderWrapComponent
              indexTab={data.indexTab}
              isMine
              profileId={data.profileId}
              profileType={profileType}
              onTabChange={async indexTab => {
                data.indexTab = indexTab;
                await refreshProfileTab(profileId, data.indexTab);
                setData({...data});
              }}
            />
            <TabFilterComponent
              isMine={isMine}
              profileType={profileType}
              tabIndex={data.indexTab}
              filterCluster={data.filterCluster}
              onChange={async (filterCluster: FilterClusterType) => {
                if ((filterCluster?.indexFilterMedia ?? -1) >= 0) {
                  data.filterCluster.indexFilterMedia = filterCluster?.indexFilterMedia ?? -1;
                  await data.refreshProfileTab(profileId, data.indexTab);
                  setData(v => ({...data}));
                }
                if ((filterCluster?.indexFilterCharacter ?? -1) >= 0) {
                  data.filterCluster.indexFilterCharacter = filterCluster?.indexFilterCharacter ?? -1;
                  await data.refreshProfileTab(profileId, data.indexTab);
                  setData(v => ({...data}));
                }

                if ((filterCluster?.indexSort ?? -1) >= 0) {
                  data.filterCluster.indexSort = filterCluster?.indexSort ?? -1;
                  await data.refreshProfileTab(profileId, data.indexTab);
                  setData(v => ({...data}));
                }

                if ((filterCluster?.indexFilterChannel ?? -1) >= 0) {
                  data.filterCluster.indexFilterChannel = filterCluster?.indexFilterChannel ?? -1;
                  await data.refreshProfileTab(profileId, data.indexTab);
                  setData(v => ({...data}));
                }

                if ((filterCluster?.indexFilterShared ?? -1) >= 0) {
                  data.filterCluster.indexFilterShared = filterCluster?.indexFilterShared ?? -1;
                  await data.refreshProfileTab(profileId, data.indexTab);
                  setData(v => ({...data}));
                }
                if ((filterCluster?.indexFilterContent ?? -1) >= 0) {
                  data.filterCluster.indexFilterContent = filterCluster?.indexFilterContent ?? -1;
                  await data.refreshProfileTab(profileId, data.indexTab);
                  setData(v => ({...data}));
                }
              }}
            />
          </div>

          <div className={styles.tabContent}>
            <TabContentComponentWrap
              profileId={data.profileId}
              isMine={isMine}
              profileType={profileType}
              tabIndex={data.indexTab}
              isEmptyTab={isEmptyTab}
              onRefreshTab={async (isRefreshAll: boolean) => {
                await data.refreshProfileTab(profileId, data.indexTab, true);
              }}
              profileTabInfo={data.profileTabInfo}
              filterCluster={data.filterCluster}
            />
          </div>
        </section>
      </section>
      <section className={styles.footer}></section>
      <HamburgerBar
        isLeft={false}
        onClose={() => {
          setData(v => ({...v, isMyMenuOpened: false}));
        }}
        open={data.isMyMenuOpened}
      ></HamburgerBar>

      <SharePopup
        open={data.isShareOpened}
        title={data.profileInfo?.profileInfo?.name || ''}
        url={window.location.href}
        onClose={() => {
          setData(v => ({...v, isShareOpened: false}));
        }}
      ></SharePopup>

      {data.isOpenPopupSubscription && (
        <PopupSubscription
          id={profileId}
          onClose={() => {
            data.isOpenPopupSubscription = false;
            setData({...data});
          }}
        />
      )}
      {data.isOpenPopupSubscriptionList && (
        <PopupSubscriptionList
          onClose={() => {
            data.isOpenPopupSubscriptionList = false;
            setData({...data});
          }}
        />
      )}
      {data.isOpenPopupFavoritesList && (
        <PopupFavoriteList
          isMine={isMine}
          profileId={profileId}
          profileType={profileType}
          onClose={() => {
            data.isOpenPopupFavoritesList = false;
            setData({...data});
          }}
        />
      )}

      {data.isOpenPopupPlayList && (
        <PopupPlaylist
          isMine={isMine}
          profileId={profileId}
          profileType={profileType}
          onClose={() => {
            data.isOpenPopupPlayList = false;
            setData({...data});
          }}
        />
      )}
    </>
  );
});

export default ProfileBase;

type ContentSettingType = {
  isMine: boolean;
  onClose: () => void;
  tabContentMenu: TabContentMenuType;
  refreshTabAll: () => void;
  onShare: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onReport: () => void;
  onHide: () => void;
};
const ContentSetting = ({
  isMine = false,
  onClose = () => {},
  tabContentMenu = {id: 0, isPin: false, isSettingOpen: false},
  refreshTabAll = () => {},
  onShare = () => {},
  onDelete = () => {},
  onEdit = () => {},
  onReport = () => {},
  onHide = () => {},
}: ContentSettingType) => {
  // const {isCharacter, isMyCharacter, isMyPD, isOtherCharacter, isOtherPD, isPD} = getUserType(isMine, profileType);
  let uploadImageItemsMine: SelectDrawerItem[] = [
    {
      name: 'Edit',
      onClick: () => {
        onEdit();
      },
    },
    {
      name: tabContentMenu.isPin ? 'Unpin' : 'Pin to Top',
      onClick: async () => {
        const dataUpdatePin: PinFixFeedReq = {
          feedId: tabContentMenu.id,
          isFix: !tabContentMenu.isPin,
        };
        await updatePin(dataUpdatePin);
        refreshTabAll();
      },
    },
    {
      name: 'Share',
      onClick: () => {
        onShare();
      },
    },
    {
      name: 'Delete',
      onClick: () => {
        onDelete();
      },
    },
  ];
  let uploadImageItems: SelectDrawerItem[] = [
    {
      name: tabContentMenu.isPin ? 'Unpin' : 'Pin to Top',
      onClick: () => {},
    },
    {
      name: 'Hide',
      onClick: () => {
        onHide();
      },
    },
    {
      name: 'Report',
      onClick: () => {
        onReport();
      },
    },
  ];

  if (isMine) {
    uploadImageItems = isMine ? uploadImageItemsMine : uploadImageItems;
  }

  return (
    <SelectDrawer isOpen={tabContentMenu.isSettingOpen} onClose={onClose} items={uploadImageItems} selectedIndex={-1} />
  );
};

export type SelectBoxProps = {
  value: {id: number; [key: string]: any} | null;
  options: {id: number; [key: string]: any}[];
  OptionComponent: (data: {id: number; [key: string]: any}, isSelected: boolean) => JSX.Element;
  ValueComponent: (data: any) => JSX.Element;
  ArrowComponent: () => JSX.Element;
  onChange: (id: number) => void;
  customStyles?: {
    control?: object; // 함수 또는 객체 허용
    singleValue?: object;
    valueContainer?: object;
    input?: object;
    option?: object;
    menu?: object;
    menuList?: object;
    indicatorSeparator?: object;
    dropdownIndicator?: object;
  };
};

export const SelectBox: React.FC<SelectBoxProps> = ({
  value,
  options,
  OptionComponent,
  ValueComponent,
  ArrowComponent,
  onChange,
  customStyles = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<{id: number} | null>(value);
  const styleDefault: StylesConfig<{id: number; [key: string]: any}, false> = {
    container: provided => ({
      ...provided,
      zIndex: 5,
    }),
    control: provided => ({
      ...provided,
      borderColor: 'transparent',
      boxShadow: 'none',
      border: 'none',
      '&:hover': {
        borderColor: 'transparent',
      },
      '&:focus': {
        borderColor: 'transparent',
      },
      background: 'transparent',
      padding: 0,
      cursor: 'pointer',
      width: '100%',
      ...customStyles?.control,
    }),
    singleValue: provided => ({
      // value부분
      ...provided,
      margin: '0',
      ...customStyles?.singleValue,
    }),
    valueContainer: provided => ({
      ...provided,
      paddingLeft: 0,
      textAlign: 'right',
      padding: '0',
      ...customStyles?.valueContainer,
    }),
    input: provided => ({
      ...provided,
      ...customStyles?.input,
    }),
    option: (provided, state) => ({
      // 옵션 부분
      ...provided,
      backgroundColor: state.isSelected ? '#ffffff' : 'transparent',
      color: 'black',
      ':active': {
        backgroundColor: state.isSelected ? '#ffffff' : 'transparent',
      },
      cursor: 'pointer',
      ...customStyles?.option,
    }),
    menu: provided => ({
      ...provided,
      marginTop: '7px',
      boxShadow: 'none',
      ...customStyles?.menu,
    }),
    menuList: provided => ({
      ...provided,
      padding: 0,
      background: 'white',
      ...customStyles?.menuList,
    }),
    indicatorSeparator: provided => ({
      ...provided,
      display: 'none',
      ...customStyles?.indicatorSeparator,
    }),
    dropdownIndicator: provided => ({
      ...provided,
      ...customStyles?.dropdownIndicator,
    }),
  };

  return (
    <div
      onClick={() => {
        if (!isOpen) {
          setIsOpen(true);
        }
      }}
    >
      {isOpen && (
        <div
          onClick={() => {
            setIsOpen(false);
          }}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            backgroundColor: 'rgba(0, 0, 0,0)',
            width: '100vw',
            height: '100vh',
            zIndex: 4,
          }}
        />
      )}
      <Select
        isSearchable={false}
        value={selectedOption}
        onChange={option => {
          if (option) {
            setSelectedOption(option);
            onChange(option.id);
            setIsOpen(false);
          }
        }}
        menuIsOpen={isOpen}
        onMenuOpen={() => setIsOpen(true)}
        // onMenuClose={() => setIsOpen(false)}
        styles={styleDefault}
        options={options}
        components={{
          DropdownIndicator: React.useCallback(() => {
            return ArrowComponent();
          }, []),
          Option: React.useCallback(
            (props: any) => (
              <components.Option {...props}>{OptionComponent(props.data, props.isSelected)}</components.Option>
            ),
            [],
          ),
          SingleValue: React.useCallback((props: any) => {
            return (
              <components.SingleValue {...props}>
                {ValueComponent(props.data)} {/* 선택된 값에서는 isSingleValue = true */}
              </components.SingleValue>
            );
          }, []),
        }}
        getOptionValue={option => option.id.toString()}
      />
    </div>
  );
};

const SelectBoxArrowComponent = () => <img className={styles.icon} src={BoldAltArrowDown.src} alt="altArrowDown" />;

const SelectBoxValueComponent = (data: any) => {
  return (
    <div key={data.id} className={styles.label}>
      {data.value}
    </div>
  );
};
const SelectBoxOptionComponent = (data: any, isSelected: boolean) => (
  <>
    <div className={styles.optionWrap}>
      <div key={data.id} className={styles.labelOption}>
        {data.value}
      </div>
      {isSelected && <img className={styles.iconCheck} src={LineCheck.src} alt="altArrowDown" />}
    </div>
  </>
);

type TabContentProps = {
  profileId: number;
  profileType: ProfileType;
  isMine: boolean;
  tabIndex: number;
  isEmptyTab: boolean;
  profileTabInfo: {
    [key: number]: GetCharacterTabInfoeRes &
      GetPdTabInfoeRes &
      GetCharacterInfoRes & {dataResPdInfo: GetPdInfoRes} & GetChannelRes;
  };

  filterCluster: FilterClusterType;
  onRefreshTab: (isRefreshAll: boolean) => void;
  onOpenContentMenu?: (data: TabContentMenuType) => void;
};

type TabFilterProps = {
  profileType: ProfileType;
  isMine: boolean;
  tabIndex: number;
  filterCluster: FilterClusterType;
  onChange: (data: FilterClusterType) => {};
};

export type FilterClusterType = {
  indexFilterMedia?: number;
  indexSort?: number;
  indexFilterCharacter?: number;
  indexFilterChannel?: number;
  indexFilterShared?: number;
  indexFilterContent?: number;
};

export const TabFilterComponent = ({profileType, isMine, tabIndex, filterCluster, onChange}: TabFilterProps) => {
  const {isPD, isCharacter, isMyPD, isMyCharacter, isOtherPD, isOtherCharacter, isChannel, isOtherChannel} =
    getUserType(isMine, profileType);
  const sortOptionList = [
    {id: ExploreSortType.Newest, value: 'Newest'},
    {id: ExploreSortType.MostPopular, value: 'Popular'},
    {id: ExploreSortType.WeeklyPopular, value: 'Name'},
  ];

  if (
    (isPD && [eTabPDType.Feed].includes(tabIndex)) ||
    (isCharacter && [eTabCharacterType.Feed].includes(tabIndex)) ||
    (isChannel && [eTabChannelType.Feed].includes(tabIndex))
  ) {
    return (
      <>
        <div className={styles.filter}>
          <div
            className={styles.left}
            onClick={async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              const target = e.target as HTMLElement;
              const category = target.closest('[data-filter]')?.getAttribute('data-filter');
              if (category) {
                const indexFilterMedia = parseInt(category);
                onChange({indexFilterMedia: indexFilterMedia});
              }
            }}
          >
            <div
              className={cx(styles.iconWrap, filterCluster.indexFilterMedia == FeedMediaType.Total && styles.active)}
              data-filter={FeedMediaType.Total}
            >
              <img src={BoldViewGallery.src} alt="" />
            </div>
            <div
              className={cx(styles.iconWrap, filterCluster.indexFilterMedia == FeedMediaType.Video && styles.active)}
              data-filter={FeedMediaType.Video}
            >
              <img src={BoldVideo.src} alt="" />
            </div>
            <div
              className={cx(styles.iconWrap, filterCluster.indexFilterMedia == FeedMediaType.Image && styles.active)}
              data-filter={FeedMediaType.Image}
            >
              <img src={BoldImage.src} alt="" />
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.filterTypeWrap}>
              <SelectBox
                value={sortOptionList[filterCluster?.indexSort || 0]}
                options={sortOptionList}
                ArrowComponent={SelectBoxArrowComponent}
                ValueComponent={SelectBoxValueComponent}
                OptionComponent={SelectBoxOptionComponent}
                onChange={async id => {
                  const indexSort = id;
                  onChange({indexSort: indexSort});
                }}
                customStyles={{
                  control: {
                    width: '120px',
                    display: 'flex',
                    gap: '10px',
                  },
                  menuList: {
                    borderRadius: '10px',
                    boxShadow: '0px 0px 30px 0px rgba(0, 0, 0, 0.10)',
                  },
                  option: {
                    padding: '11px 14px',
                    boxSizing: 'border-box',
                    '&:first-of-type': {
                      borderTop: 'none', // 첫 번째 옵션에는 border 제거
                    },
                    borderTop: '1px solid #EAECF0', // 옵션 사이에 border 추가
                  },
                }}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (
    (isCharacter && [eTabCharacterType.Contents].includes(tabIndex)) ||
    (isChannel && [eTabChannelType.Contents].includes(tabIndex))
  ) {
    return (
      <>
        <div className={cx(styles.filter, styles.character)}>
          <div
            className={styles.left}
            onClick={async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              const target = e.target as HTMLElement;
              const category = target.closest('[data-filter]')?.getAttribute('data-filter');
              if (category) {
                const indexFilter = parseInt(category);
                onChange({indexFilterContent: indexFilter});
              }
            }}
          >
            <div
              className={cx(
                styles.iconWrap,
                filterCluster.indexFilterContent == eContentFilterType.Total && styles.active,
              )}
              data-filter={eContentFilterType.Total}
            >
              <img src={BoldViewGallery.src} alt="" />
            </div>
            <div
              className={cx(
                styles.textWrap,
                filterCluster.indexFilterContent == eContentFilterType.Series && styles.active,
              )}
              data-filter={eContentFilterType.Series}
            >
              <div className={styles.text}>Series</div>
            </div>
            <div
              className={cx(
                styles.textWrap,
                filterCluster.indexFilterContent == eContentFilterType.Single && styles.active,
              )}
              data-filter={eContentFilterType.Single}
            >
              <div className={styles.text}>Single</div>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.filterTypeWrap}>
              <SelectBox
                value={sortOptionList[filterCluster?.indexSort || 0]}
                options={sortOptionList}
                ArrowComponent={SelectBoxArrowComponent}
                ValueComponent={SelectBoxValueComponent}
                OptionComponent={SelectBoxOptionComponent}
                onChange={async id => {
                  const indexSort = id;
                  onChange({indexSort: indexSort});
                }}
                customStyles={{
                  control: {
                    width: '120px',
                    display: 'flex',
                    gap: '10px',
                  },
                  menuList: {
                    borderRadius: '10px',
                    boxShadow: '0px 0px 30px 0px rgba(0, 0, 0, 0.10)',
                  },
                  option: {
                    padding: '11px 14px',
                    boxSizing: 'border-box',
                    '&:first-of-type': {
                      borderTop: 'none', // 첫 번째 옵션에는 border 제거
                    },
                    borderTop: '1px solid #EAECF0', // 옵션 사이에 border 추가
                  },
                }}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (
    (isPD && [eTabPDType.Channel, eTabPDType.Character].includes(tabIndex)) ||
    (isCharacter && [eTabCharacterType.Character].includes(tabIndex)) ||
    (isChannel && [eTabChannelType.Character].includes(tabIndex))
  ) {
    return (
      <>
        <div className={cx(styles.filter, styles.character)}>
          <div
            className={styles.left}
            onClick={async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              const target = e.target as HTMLElement;
              const category = target.closest('[data-filter]')?.getAttribute('data-filter');
              if (category) {
                const indexFilter = parseInt(category);
                if (tabIndex == eTabPDType.Channel) {
                  onChange({indexFilterChannel: indexFilter});
                } else if (tabIndex == eTabPDType.Character) {
                  onChange({indexFilterCharacter: indexFilter});
                }
              }
            }}
          >
            <div
              className={cx(
                styles.iconWrap,
                ((tabIndex == eTabPDType.Channel && filterCluster.indexFilterChannel == eCharacterFilterType.Total) ||
                  (tabIndex == eTabPDType.Character &&
                    filterCluster.indexFilterCharacter == eCharacterFilterType.Total)) &&
                  styles.active,
              )}
              data-filter={eCharacterFilterType.Total}
            >
              <img src={BoldViewGallery.src} alt="" />
            </div>
            <div
              className={cx(
                styles.textWrap,

                ((tabIndex == eTabPDType.Channel &&
                  filterCluster.indexFilterChannel == eCharacterFilterType.Original) ||
                  (tabIndex == eTabPDType.Character &&
                    filterCluster.indexFilterCharacter == eCharacterFilterType.Original)) &&
                  styles.active,
              )}
              data-filter={eCharacterFilterType.Original}
            >
              <div className={styles.text}>Original</div>
            </div>
            <div
              className={cx(
                styles.textWrap,

                ((tabIndex == eTabPDType.Channel && filterCluster.indexFilterChannel == eCharacterFilterType.Fan) ||
                  (tabIndex == eTabPDType.Character &&
                    filterCluster.indexFilterCharacter == eCharacterFilterType.Fan)) &&
                  styles.active,
              )}
              data-filter={eCharacterFilterType.Fan}
            >
              <div className={styles.text}>Fan</div>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.filterTypeWrap}>
              <SelectBox
                value={sortOptionList[filterCluster?.indexSort || 0]}
                options={sortOptionList}
                ArrowComponent={SelectBoxArrowComponent}
                ValueComponent={SelectBoxValueComponent}
                OptionComponent={SelectBoxOptionComponent}
                onChange={async id => {
                  const indexSort = id;
                  onChange({indexSort: indexSort});
                }}
                customStyles={{
                  control: {
                    width: '124px',
                    display: 'flex',
                    gap: '10px',
                  },
                  menuList: {
                    borderRadius: '10px',
                    boxShadow: '0px 0px 30px 0px rgba(0, 0, 0, 0.10)',
                  },
                  option: {
                    padding: '11px 14px',
                    boxSizing: 'border-box',
                    '&:first-of-type': {
                      borderTop: 'none', // 첫 번째 옵션에는 border 제거
                    },
                    borderTop: '1px solid #EAECF0', // 옵션 사이에 border 추가
                  },
                }}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (
    (isPD && [eTabPDType.Channel, eTabPDType.Channel].includes(tabIndex)) ||
    (isCharacter && [eTabCharacterType.Channel].includes(tabIndex))
  ) {
    return (
      <>
        <div className={cx(styles.filter, styles.character)}>
          <div
            className={styles.left}
            onClick={async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              const target = e.target as HTMLElement;
              const category = target.closest('[data-filter]')?.getAttribute('data-filter');
              if (category) {
                const indexFilter = parseInt(category);
                onChange({indexFilterChannel: indexFilter});
              }
            }}
          >
            <div
              className={cx(
                styles.iconWrap,
                filterCluster.indexFilterChannel == eCharacterFilterType.Total && styles.active,
              )}
              data-filter={eCharacterFilterType.Total}
            >
              <img src={BoldViewGallery.src} alt="" />
            </div>
            <div
              className={cx(
                styles.textWrap,

                filterCluster.indexFilterChannel == eCharacterFilterType.Original && styles.active,
              )}
              data-filter={eCharacterFilterType.Original}
            >
              <div className={styles.text}>Original</div>
            </div>
            <div
              className={cx(
                styles.textWrap,

                filterCluster.indexFilterChannel == eCharacterFilterType.Fan && styles.active,
              )}
              data-filter={eCharacterFilterType.Fan}
            >
              <div className={styles.text}>Fan</div>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.filterTypeWrap}>
              <SelectBox
                value={sortOptionList[filterCluster?.indexSort || 0]}
                options={sortOptionList}
                ArrowComponent={SelectBoxArrowComponent}
                ValueComponent={SelectBoxValueComponent}
                OptionComponent={SelectBoxOptionComponent}
                onChange={async id => {
                  const indexSort = id;
                  onChange({indexSort: indexSort});
                }}
                customStyles={{
                  control: {
                    width: '124px',
                    display: 'flex',
                    gap: '10px',
                  },
                  menuList: {
                    borderRadius: '10px',
                    boxShadow: '0px 0px 30px 0px rgba(0, 0, 0, 0.10)',
                  },
                  option: {
                    padding: '11px 14px',
                    boxSizing: 'border-box',
                    '&:first-of-type': {
                      borderTop: 'none', // 첫 번째 옵션에는 border 제거
                    },
                    borderTop: '1px solid #EAECF0', // 옵션 사이에 border 추가
                  },
                }}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (isCharacter && tabIndex == eTabCharacterOtherType.Info) {
    return <></>;
  }

  if (isPD && tabIndex == eTabPDOtherType.Info) {
    return <></>;
  }

  if (isPD && [eTabPDType.Shared].includes(tabIndex)) {
    return (
      <>
        <div className={cx(styles.filter, styles.character)}>
          <div
            className={styles.left}
            onClick={async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              const target = e.target as HTMLElement;
              const category = target.closest('[data-filter]')?.getAttribute('data-filter');
              if (category) {
                const indexFilter = parseInt(category);
                onChange({indexFilterShared: indexFilter});
              }
            }}
          >
            <div
              className={cx(
                styles.iconWrap,
                filterCluster.indexFilterShared == eSharedFilterType.Total && styles.active,
              )}
              data-filter={eSharedFilterType.Total}
            >
              <img src={BoldViewGallery.src} alt="" />
            </div>
            <div
              className={cx(
                styles.textWrap,
                filterCluster.indexFilterShared == eSharedFilterType.Channel && styles.active,
              )}
              data-filter={eSharedFilterType.Channel}
            >
              <div className={styles.text}>Channel</div>
            </div>
            <div
              className={cx(
                styles.textWrap,
                filterCluster.indexFilterShared == eSharedFilterType.Character && styles.active,
              )}
              data-filter={eSharedFilterType.Character}
            >
              <div className={styles.text}>Character</div>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.filterTypeWrap}>
              <SelectBox
                value={sortOptionList[filterCluster?.indexFilterShared || 0]}
                options={sortOptionList}
                ArrowComponent={SelectBoxArrowComponent}
                ValueComponent={SelectBoxValueComponent}
                OptionComponent={SelectBoxOptionComponent}
                onChange={async id => {
                  const indexSort = id;
                  onChange({indexSort: indexSort});
                }}
                customStyles={{
                  control: {
                    width: '120px',
                    display: 'flex',
                    gap: '10px',
                  },
                  menuList: {
                    borderRadius: '10px',
                    boxShadow: '0px 0px 30px 0px rgba(0, 0, 0, 0.10)',
                  },
                  option: {
                    padding: '11px 14px',
                    boxSizing: 'border-box',
                    '&:first-of-type': {
                      borderTop: 'none', // 첫 번째 옵션에는 border 제거
                    },
                    borderTop: '1px solid #EAECF0', // 옵션 사이에 border 추가
                  },
                }}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  return <></>;
};

export const TabHeaderWrapAllComponent = ({
  indexTab,
  profileId,
  profileType,
  isMine,
  onTabChange,
}: TabHeaderComponentType) => {
  const getTabHeaderList = () => {
    return Object.values(eTabCommonType)
      .filter(value => typeof value === 'number') // 숫자 타입만 필터링
      .map(type => ({type, label: eTabCommonType[type]}));
  };
  const tabHeaderList = getTabHeaderList();
  return (
    <>
      <TabHeaderComponent
        indexTab={indexTab}
        profileId={profileId}
        profileType={profileType}
        isMine={isMine}
        onTabChange={onTabChange}
        tabHeaderList={tabHeaderList}
      />
    </>
  );
};

export const TabHeaderWrapComponent = ({
  indexTab,
  profileId,
  profileType,
  isMine,
  onTabChange,
}: TabHeaderComponentType) => {
  const getTabHeaderList = (profileType: number, isMine = false) => {
    if (isMine) {
      if (profileType == ProfileType.User || profileType == ProfileType.PD) {
        return Object.values(eTabPDType)
          .filter(value => typeof value === 'number') // 숫자 타입만 필터링
          .map(type => ({type, label: eTabPDType[type]}));
      } else if (profileType == ProfileType.Character) {
        return Object.values(eTabCharacterType)
          .filter(value => typeof value === 'number')
          .map(type => ({type, label: eTabCharacterType[type]}));
      } else if (profileType == ProfileType.Channel) {
        return Object.values(eTabChannelType)
          .filter(value => typeof value === 'number')
          .map(type => ({type, label: eTabChannelType[type]}));
      }
    }

    //other
    if (profileType == ProfileType.User || profileType == ProfileType.PD) {
      return Object.values(eTabPDOtherType)
        .filter(value => typeof value === 'number') // 숫자 타입만 필터링
        .map(type => ({type, label: eTabPDOtherType[type]}));
    } else if (profileType == ProfileType.Character) {
      return Object.values(eTabCharacterOtherType)
        .filter(value => typeof value === 'number')
        .map(type => ({type, label: eTabCharacterOtherType[type]}));
    } else if (profileType == ProfileType.Channel) {
      return Object.values(eTabChannelOtherType)
        .filter(value => typeof value === 'number')
        .map(type => ({type, label: eTabChannelOtherType[type]}));
    }
    return [];
  };
  const tabHeaderList = getTabHeaderList(profileType, isMine);
  return (
    <>
      <TabHeaderComponent
        indexTab={indexTab}
        profileId={profileId}
        profileType={profileType}
        isMine={isMine}
        onTabChange={onTabChange}
        tabHeaderList={tabHeaderList}
      />
    </>
  );
};

type TabHeaderComponentType = {
  indexTab:
    | eTabPDType
    | eTabCharacterType
    | eTabPDOtherType
    | eTabCharacterOtherType
    | eTabChannelType
    | eTabChannelOtherType
    | eTabCommonType;
  profileId: number;
  profileType: ProfileType;
  isMine: boolean;
  onTabChange: (indexTab: number) => void;
  tabHeaderList?: {type: number; label: string}[];
};
export const TabHeaderComponent = ({
  indexTab,
  profileId,
  profileType,
  isMine,
  tabHeaderList,
  onTabChange,
}: TabHeaderComponentType) => {
  const [data, setData] = useState<{
    indexTab:
      | eTabPDType
      | eTabCharacterType
      | eTabPDOtherType
      | eTabCharacterOtherType
      | eTabChannelType
      | eTabChannelOtherType
      | eTabCommonType;
  }>({indexTab: indexTab});
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onResize = () => {
      setData({...data});
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [data]);

  useEffect(() => {
    data.indexTab = indexTab;
    setData({...data});
  }, [indexTab]);

  const calculateGap = () => {
    if (containerRef.current) {
      const containerWidth = Math.min(document.documentElement.clientWidth, document.body.clientWidth) - 32;
      // data-tab 속성이 붙은 모든 자식 요소 선택
      const tabItems = Array.from(containerRef.current.querySelectorAll('[data-tablabel]')) as HTMLElement[];
      if (tabItems.length > 1) {
        let totalChildrenWidth = 0;
        tabItems.forEach(item => {
          totalChildrenWidth += item.offsetWidth;
        });
        const gap = (containerWidth - totalChildrenWidth) / (tabItems.length - 1);
        return gap;
      }
      return 0;
    } else {
      return 0;
    }
  };
  const tabGap = calculateGap();
  return (
    <>
      <div className={styles.tabHeaderWrap}>
        <div
          ref={containerRef}
          className={styles.tabHeader}
          onClick={async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            const target = e.target as HTMLElement;
            const category = target.closest('[data-tab]')?.getAttribute('data-tab');
            let indexTab = 0;
            if (category) {
              const indexTab = parseInt(category);
              onTabChange(indexTab);
            } else {
              return;
            }
          }}
        >
          {tabHeaderList?.map((tab, index) => {
            let paddingLeft = tabGap / 2;
            let paddingRight = tabGap / 2;
            if (tabHeaderList.length - 1 == index) {
              paddingRight = 0;
            }
            if (index == 0) {
              paddingLeft = 0;
            }
            return (
              <div
                key={tab.type}
                className={styles.labelWrap}
                style={{paddingLeft: paddingLeft, paddingRight: paddingRight}}
                data-tab={tab?.type}
              >
                <div
                  className={cx(styles.label, data.indexTab == tab?.type && styles.active)}
                  data-tablabel={tab?.type}
                >
                  {tab.label}
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.line}></div>
      </div>
    </>
  );
};

export const TabContentComponentWrap = ({
  profileId,
  profileType,
  isMine,
  tabIndex,
  isEmptyTab,
  profileTabInfo,
  onRefreshTab,
  filterCluster,
}: TabContentProps) => {
  const {isPD, isCharacter, isMyPD, isMyCharacter, isOtherPD, isOtherCharacter, isChannel, isOtherChannel} =
    getUserType(isMine, profileType);
  const router = useRouter();
  const [data, setData] = useState<{
    tabContentMenu: TabContentMenuType;
    isShareOpened: boolean;
  }>({
    tabContentMenu: {
      id: 0,
      isPin: false,
      isSettingOpen: false,
    },
    isShareOpened: false,
  });
  const handleShare = async (url: string = window.location.href) => {
    const shareData = {
      title: '공유하기 제목',
      text: '이 링크를 확인해보세요!',
      url: url, // 현재 페이지 URL
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData); // 네이티브 공유 UI 호출
      } catch (error) {
        console.error('공유 실패:', error);
      }
    } else {
      data.isShareOpened = true;
      setData({...data});
    }
  };

  const onOpenContentMenu = (dataContentMenu: TabContentMenuType) => {
    data.tabContentMenu = dataContentMenu;
    setData({...data});
  };

  return (
    <>
      <TabContentComponent
        profileId={profileId}
        profileType={profileType}
        isMine={isMine}
        tabIndex={tabIndex}
        isEmptyTab={isEmptyTab}
        // data={data}
        // setData={setData}
        profileTabInfo={profileTabInfo}
        onRefreshTab={onRefreshTab}
        filterCluster={filterCluster}
        onOpenContentMenu={onOpenContentMenu}
      />
      <ContentSetting
        onClose={() => {
          data.tabContentMenu.isSettingOpen = false;
          setData({...data});
        }}
        isMine={isMine}
        tabContentMenu={data.tabContentMenu}
        refreshTabAll={async () => {
          onRefreshTab(true);
        }}
        onShare={() => {
          const url =
            getLocalizedLink(`/profile/feed/` + profileId) +
            `?type=${profileType}&idContent=${data.tabContentMenu.id}&feedMediaType=${filterCluster.indexFilterMedia}&feedSortType=${filterCluster.indexSort}`;
          handleShare(url);
        }}
        onDelete={async () => {
          if (
            (isPD && tabIndex == eTabPDType.Character) ||
            (isCharacter && tabIndex == eTabCharacterType.Character) ||
            (isChannel && tabIndex == eTabChannelType.Character)
          ) {
            await sendDeleteCharacter({characterId: data.tabContentMenu.id});
          }

          if (
            (isPD && tabIndex == eTabPDType.Feed) ||
            (isCharacter && tabIndex == eTabCharacterType.Feed) ||
            (isChannel && tabIndex == eTabChannelType.Feed)
          ) {
            await deleteFeed({feedId: data.tabContentMenu.id});
          }

          if (
            (isCharacter && tabIndex == eTabCharacterType.Contents) ||
            (isChannel && tabIndex == eTabChannelType.Contents)
          ) {
            await sendDeleteContent({contentId: data.tabContentMenu.id});
          }

          if ((isPD && tabIndex == eTabPDOtherType.Channel) || (isCharacter && tabIndex == eTabCharacterType.Channel)) {
            await deleteChannel({channelId: data.tabContentMenu.id});
          }
          onRefreshTab(true);
        }}
        onEdit={() => {
          if (
            (isPD && tabIndex == eTabPDType.Character) ||
            (isCharacter && tabIndex == eTabCharacterType.Character) ||
            (isChannel && tabIndex == eTabChannelType.Character)
          ) {
            router.push(getLocalizedLink(`/update/character/` + data.tabContentMenu.id));
          }

          if (
            (isPD && tabIndex == eTabPDType.Feed) ||
            (isCharacter && tabIndex == eTabCharacterType.Feed) ||
            (isChannel && tabIndex == eTabChannelType.Feed)
          ) {
            router.push(getLocalizedLink(`/update/post/` + data.tabContentMenu.id));
          }

          if (
            (isCharacter && tabIndex == eTabCharacterType.Contents) ||
            (isChannel && tabIndex == eTabChannelType.Contents)
          ) {
            router.push(getLocalizedLink(`/update/content/series/` + data.tabContentMenu.id));
          }

          if ((isPD && tabIndex == eTabPDOtherType.Channel) || (isCharacter && tabIndex == eTabCharacterType.Channel)) {
            router.push(getLocalizedLink(`/update/channel/` + data.tabContentMenu.id));
          }
        }}
        onHide={() => {
          alert('hide api 연동 필요');
        }}
        onReport={() => {
          alert('report api 연동 필요');
        }}
      />
    </>
  );
};

const TabContentComponent = ({
  profileId,
  profileType,
  isMine,
  tabIndex,
  isEmptyTab,
  profileTabInfo,
  filterCluster,
  onRefreshTab,
  onOpenContentMenu,
}: TabContentProps) => {
  const {ref: observerRef, inView} = useInView();
  const {isPD, isCharacter, isMyPD, isMyCharacter, isOtherPD, isOtherCharacter, isChannel, isOtherChannel} =
    getUserType(isMine, profileType);

  useEffect(() => {
    if (!inView) return;

    if (isEmptyTab) return;

    refreshTab();
  }, [inView]);

  const refreshTab = async () => {
    onRefreshTab();
  };

  if (isEmptyTab) {
    return (
      <>
        <div className={styles.emptyWrap}>
          <img src="/ui/profile/image_empty.svg" alt="" />
          <div className={styles.text}>
            Its pretty lonely out here.
            <br />
            Make a Post
          </div>
        </div>
      </>
    );
  }
  if (
    (isPD && tabIndex == eTabPDType.Feed) ||
    (isCharacter && tabIndex == eTabCharacterType.Feed) ||
    (isChannel && tabIndex == eTabChannelType.Feed)
  ) {
    return (
      <>
        <ul className={styles.itemWrap}>
          {profileTabInfo?.[tabIndex]?.feedInfoList?.map((one, index: number) => {
            return (
              <Link
                href={
                  getLocalizedLink(`/profile/feed/` + profileId) +
                  `?type=${profileType}&idContent=${one.id}&feedMediaType=${filterCluster.indexFilterMedia}&feedSortType=${filterCluster.indexSort}`
                }
              >
                <li className={styles.item} key={one?.id}>
                  {one.mediaState == MediaState.Image && (
                    <img className={styles.imgThumbnail} src={one?.mediaUrlList?.[0]} alt="" />
                  )}
                  {one.mediaState == MediaState.Video && (
                    <video className={styles.imgThumbnail} src={one?.mediaUrlList?.[0]} />
                  )}
                  {one?.isPinFix && (
                    <div className={styles.pin}>
                      <img src={BoldPin.src} alt="" />
                    </div>
                  )}
                  <div className={styles.info}>
                    <div className={styles.likeWrap}>
                      <img src={BoldLike.src} alt="" />
                      <div className={styles.value}>{one?.likeCount}</div>
                    </div>
                    {isMine && (
                      <div className={styles.likeWrap}>
                        <img src={BoldDislike.src} alt="" />
                        <div className={styles.value}>{one?.disLikeCount}</div>
                      </div>
                    )}
                    <div className={styles.viewWrap}>
                      <img src={BoldVideo.src} alt="" />
                      <div className={styles.value}>{one?.commentCount}</div>
                    </div>
                  </div>
                  <div className={styles.titleWrap}>
                    <div className={styles.title}>{one?.description}</div>
                    <img
                      src={BoldMenuDots.src}
                      alt=""
                      className={styles.iconSetting}
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        const dataContextMenu = {
                          id: one.id,
                          isPin: one?.isPinFix || false,
                          isSettingOpen: true,
                        };
                        if (onOpenContentMenu) onOpenContentMenu(dataContextMenu);
                      }}
                    />
                  </div>
                </li>
              </Link>
            );
          })}
          <div ref={observerRef}></div>
        </ul>
      </>
    );
  }
  if (
    (isPD && tabIndex == eTabPDType.Character) ||
    (isCharacter && tabIndex == eTabCharacterType.Character) ||
    (isChannel && tabIndex == eTabChannelType.Character)
  ) {
    return (
      <ul className={styles.itemWrap}>
        {profileTabInfo?.[tabIndex]?.characterInfoList.map((one, index: number) => {
          return (
            <Link href={getLocalizedLink(`/profile/` + one?.id + '?from=""')}>
              <li className={styles.item} key={one?.id}>
                {one.mediaState == MediaState.Image && (
                  <img className={styles.imgThumbnail} src={one?.mediaUrl} alt="" />
                )}
                {one.mediaState == MediaState.Video && <video className={styles.imgThumbnail} src={one?.mediaUrl} />}
                {one?.isFavorite && (
                  <div className={styles.pin}>
                    <img src={BoldPin.src} alt="" />
                  </div>
                )}
                <div className={styles.info}>
                  <div className={styles.likeWrap}>
                    <img src={BoldLike.src} alt="" />
                    <div className={styles.value}>{one?.likeCount}</div>
                  </div>
                  {isMine && (
                    <div className={styles.likeWrap}>
                      <img src={BoldDislike.src} alt="" />
                      <div className={styles.value}>{one?.dislikeCount}</div>
                    </div>
                  )}
                  <div className={styles.viewWrap}>
                    <img src={BoldVideo.src} alt="" />
                    <div className={styles.value}>{one?.mediaCount}</div>
                  </div>
                </div>
                <div className={styles.titleWrap}>
                  <div className={styles.title}>{one?.name}</div>
                  <img
                    src={BoldMenuDots.src}
                    alt=""
                    className={styles.iconSetting}
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      const dataContextMenu = {
                        id: one.id,
                        isPin: one?.isPinFix || false,
                        isSettingOpen: true,
                      };
                      if (onOpenContentMenu) onOpenContentMenu(dataContextMenu);
                    }}
                  />
                </div>
              </li>
            </Link>
          );
        })}
        <div ref={observerRef}></div>
      </ul>
    );
  }

  if ((isCharacter && tabIndex == eTabCharacterType.Contents) || (isChannel && tabIndex == eTabChannelType.Contents)) {
    return (
      <ul className={styles.itemWrap}>
        {profileTabInfo?.[tabIndex]?.contentInfoList.map((one, index: number) => {
          return (
            <Link href={getLocalizedLink(`/profile/` + one?.id + '?from=""')}>
              <li className={styles.item} key={one?.id}>
                {one.mediaState == MediaState.Image && (
                  <img className={styles.imgThumbnail} src={one?.mediaUrl} alt="" />
                )}
                {one.mediaState == MediaState.Video && <video className={styles.imgThumbnail} src={one?.mediaUrl} />}
                {one?.isFavorite && (
                  <div className={styles.pin}>
                    <img src={BoldPin.src} alt="" />
                  </div>
                )}
                <div className={styles.info}>
                  <div className={styles.likeWrap}>
                    <img src={BoldLike.src} alt="" />
                    <div className={styles.value}>{one?.likeCount}</div>
                  </div>
                  {isMine && (
                    <div className={styles.likeWrap}>
                      <img src={BoldDislike.src} alt="" />
                      <div className={styles.value}>{one?.dislikeCount}</div>
                    </div>
                  )}
                  <div className={styles.viewWrap}>
                    <img src={BoldVideo.src} alt="" />
                    <div className={styles.value}>{one?.mediaCount}</div>
                  </div>
                </div>
                <div className={styles.titleWrap}>
                  <div className={styles.title}>{one?.name}</div>
                  <img
                    src={BoldMenuDots.src}
                    alt=""
                    className={styles.iconSetting}
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      const dataContextMenu = {
                        id: one.id,
                        isPin: one?.isPinFix || false,
                        isSettingOpen: true,
                      };
                      if (onOpenContentMenu) onOpenContentMenu(dataContextMenu);
                    }}
                  />
                </div>
              </li>
            </Link>
          );
        })}
        <div ref={observerRef}></div>
      </ul>
    );
  }

  if ((isPD && tabIndex == eTabPDType.Channel) || (isCharacter && tabIndex == eTabCharacterType.Channel)) {
    return (
      <ul className={styles.itemWrap}>
        {profileTabInfo?.[tabIndex]?.channelInfoList?.map((one, index: number) => {
          return (
            <Link href={getLocalizedLink(`/profile/` + one?.id + '?from=""')}>
              <li className={styles.item} key={one?.id}>
                {one.mediaState == MediaState.Image && (
                  <img className={styles.imgThumbnail} src={one?.mediaUrl} alt="" />
                )}
                {one.mediaState == MediaState.Video && <video className={styles.imgThumbnail} src={one?.mediaUrl} />}
                {one?.isFavorite && (
                  <div className={styles.pin}>
                    <img src={BoldPin.src} alt="" />
                  </div>
                )}
                <div className={styles.info}>
                  <div className={styles.likeWrap}>
                    <img src={BoldContentLists.src} alt="" />
                    <div className={styles.value}>{one?.mediaCount}</div>
                  </div>
                  <div className={styles.likeWrap}>
                    <img src={BoldCharacter.src} alt="" />
                    <div className={styles.value}>{one?.memberCount}</div>
                  </div>
                </div>
                <div className={styles.titleWrap}>
                  <div className={styles.title}>{one?.name}</div>
                  <img
                    src={BoldMenuDots.src}
                    alt=""
                    className={styles.iconSetting}
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      const dataContextMenu = {
                        id: one.id,
                        isPin: one?.isPinFix || false,
                        isSettingOpen: true,
                      };
                      if (onOpenContentMenu) onOpenContentMenu(dataContextMenu);
                    }}
                  />
                </div>
              </li>
            </Link>
          );
        })}
        <div ref={observerRef}></div>
      </ul>
    );
  }

  if (isOtherPD && tabIndex == eTabPDOtherType.Info) {
    const pdInfo = profileTabInfo?.[tabIndex]?.dataResPdInfo;
    return (
      <>
        <section className={styles.pdInfo}>
          <div className={styles.label}>Introduce</div>
          <div className={styles.value}>{pdInfo?.introduce}</div>
          <div className={styles.label}>Interests</div>
          <ul className={styles.tags}>
            {pdInfo?.interests.map((one, index) => {
              return (
                <li key={index} className={styles.tag}>
                  {one}
                </li>
              );
            })}
          </ul>

          <div className={styles.label}>Skill</div>
          <ul className={styles.tags}>
            {pdInfo?.skills.map((one, index) => {
              return (
                <li key={index} className={styles.tag}>
                  {one}
                </li>
              );
            })}
          </ul>
          <div className={styles.label}>Personal History</div>
          <div className={styles.value}>{pdInfo?.personalHistory}</div>
          <div className={styles.label}>Honor & Awards</div>
          <div className={styles.value}>{pdInfo?.honorAwards}</div>
          <div className={styles.label}>URL</div>
          <div className={styles.value}>{pdInfo?.url}</div>
        </section>
      </>
    );
  }
  if (isCharacter && tabIndex == eTabCharacterOtherType.Info) {
    return (
      <>
        <CharacterProfileDetailComponent
          characterInfo={profileTabInfo?.[tabIndex].characterInfo}
          urlLinkKey={profileTabInfo?.[tabIndex].urlLinkKey}
        />
      </>
    );
  }

  if (isChannel && tabIndex == eTabChannelOtherType.Info) {
    const channelInfo = profileTabInfo?.[tabIndex]?.channelInfo;
    const tagList = channelInfo?.tags || [];
    return (
      <section className={styles.channelInfoTabSection}>
        <section className={styles.characterMainImageWrap}>
          <img src={channelInfo?.mediaUrl} alt="" className={styles.characterMainImage} />
          <div className={styles.infoWrap}>
            <Link href={getLocalizedLink(`/profile/` + channelInfo?.id + '?from=""')}>
              <div className={styles.left}>
                <img src={channelInfo?.mediaUrl} alt="" className={styles.profileMaker} />
                <div className={styles.name}>{channelInfo?.name}</div>
              </div>
            </Link>
            <div className={styles.right}>
              <div className={styles.statistics}>
                <div className={styles.commentWrap}>
                  <img src={BoldComment.src} alt="" className={styles.icon} />
                  <div className={styles.count}>{99}</div>
                </div>
                <div className={styles.viewsWrap}>
                  <img src={BoldFollowers.src} alt="" className={styles.icon} />
                  <div className={styles.count}>{99}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={styles.tagSection}>
          <ul className={styles.metatags}>
            {tagList.map((tag, index) => {
              return <li className={styles.item}>{tag}</li>;
            })}
          </ul>
        </section>
        <section className={styles.memberSection}>
          <div className={styles.label}>{channelInfo?.memberProfileIdList?.length} Members</div>
          <Swiper
            className={styles.recruitList}
            freeMode={true}
            slidesPerView={'auto'}
            onSlideChange={() => {}}
            onSwiper={swiper => {}}
            spaceBetween={8}
          >
            {channelInfo?.memberProfileIdList?.map((profile, index) => {
              return (
                <SwiperSlide>
                  <li className={styles.item}>
                    <div className={styles.circle}>
                      <img className={styles.bg} src="/ui/profile/icon_add_recruit.svg" alt="" />
                      <img className={styles.thumbnail} src={profile.iconImageUrl} alt="" />
                      {/* <span className={cx(styles.grade, styles.original)}>Original</span> */}
                    </div>
                    <div className={styles.label}>{profile.name}</div>
                  </li>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </section>
        <section className={styles.descriptionSection}>
          <div className={styles.label}>Description</div>
          <div className={styles.value}>{channelInfo?.description}</div>
        </section>
      </section>
    );
  }
};
