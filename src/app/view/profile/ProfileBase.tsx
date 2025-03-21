'use client';

import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Backdrop, Box, Button, ClickAwayListener, Drawer, Snackbar} from '@mui/material';
import ProfileTopEditMenu from './ProfileTopEditMenu';
import ProfileInfo from './ProfileInfo';
import profileData from 'data/profile/profile-data.json';
import ProfileTopViewMenu from './ProfileTopViewMenu';
import {
  BoldAltArrowDown,
  BoldArchive,
  BoldArrowLeft,
  BoldCharacter,
  BoldComment,
  BoldContentLists,
  BoldDislike,
  BoldFollowers,
  BoldHeart,
  BoldImage,
  BoldLike,
  BoldLock,
  BoldMenuDots,
  BoldMore,
  BoldPin,
  BoldVideo,
  BoldViewGallery,
  LineArchive,
  LineArrowDown,
  LineCheck,
  LineCopy,
  LineMenu,
  LinePlus,
  LineShare,
} from '@ui/Icons';
import styles from './ProfileBase.module.scss';
import cx from 'classnames';
import Select, {components, SelectInstance, StylesConfig} from 'react-select';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import {redirect, RedirectType, useParams, usePathname, useRouter, useSearchParams} from 'next/navigation';
import {
  CharacterProfileTabType,
  deleteProfile,
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
  SharedItemType,
} from '@/app/NetWork/ProfileNetwork';
import {useDispatch, useSelector} from 'react-redux';
import {setBottomNavColor} from '@/redux-store/slices/MainControl';
import {RootState} from '@/redux-store/ReduxStore';
import {updateProfile} from '@/redux-store/slices/Profile';
import {userDropDownAtom} from '@/components/layout/shared/UserDropdown';
import {useAtom} from 'jotai';
import Link from 'next/link';
import HamburgerBar from '../main/sidebar/HamburgerBar';
import SharePopup from '@/components/layout/shared/SharePopup';
import {deleteFeed, FeedInfo} from '@/app/NetWork/ShortsNetwork';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import {
  CharacterIP,
  GetCharacterInfoReq,
  GetCharacterInfoRes,
  sendDeleteCharacter,
  sendGetCharacterProfileInfo,
} from '@/app/NetWork/CharacterNetwork';
import {CharacterInfo} from '@/redux-store/slices/StoryInfo';
import {copyCurrentUrlToClipboard, getBackUrl} from '@/utils/util-1';
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
import {ContentType, sendDeleteContent} from '@/app/NetWork/ContentNetwork';
import {CharacterProfileDetailComponent} from './ProfileDetail';
import PopupFriends from './PopupFriends';
import {PortfolioListPopup} from '@/app/[lang]/(pages)/profile/update/[[...id]]/page';
import useCustomRouter from '@/utils/useCustomRouter';
import {bookmark, InteractionType, sendDisLike, sendLike} from '@/app/NetWork/CommonNetwork';
import DrawerDonation from '../main/content/create/common/DrawerDonation';
import getLocalizedText from '@/utils/getLocalizedText';
import formatText from '@/utils/formatText';

const mappingStrToGlobalTextKey = {
  Feed: 'common_label_feed',
  Character: 'common_label_character',
  Info: 'common_label_info',
  Channel: 'common_label_channel',
  Shared: 'common_label_shared',
  Contents: 'common_label_contents',
  Game: 'common_label_game',
};

export enum eTabFavoritesType {
  Feed = 1,
  Character = 3,
  Channel = 4,
  Contents = 2,
  Game = 0,
}

export enum eTabPlayListType {
  Feed = 1,
  Character = 2,
  Contents = 3,
  Game = 0,
}

export enum eTabPDType {
  Feed,
  Info = 90,
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
  Info = 90,
  Contents = 1,
  Character = 3,
  Game,
}

export enum eTabChannelOtherType {
  Feed,
  Info = 90,
  Contents = 1,
  Character = 3,
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
  Episode = 3,
}

export enum eSharedFilterType {
  Total,
  Channel = 1,
  Character = 2,
}

export type TabContentMenuType = {
  isSettingOpen: boolean;
  isPin: boolean;
  id: number;
  isSingle?: boolean;
  urlLinkKey?: string;
  isFavorite?: boolean;
  index?: number;
  shareUrl?: string;
  shareTitle?: string;
  contentType?: ContentType;
};

type DataProfileType = {
  urlLinkKey: string;
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
  isOpenPopupFriendsList: boolean;

  gap: number;

  dataGift: {
    isOpen: boolean;
    idProfileTo: number;
  };

  dataToast: {
    isOpen: boolean;
    message: string;
  };

  dataOtherProfileMenu: {
    isOpen: boolean;
  };

  refreshProfileTab: (profileId: number, indexTab: number, isRefreshAll?: boolean) => void;
  getIsEmptyTab: () => boolean;
};

type ProfileBaseProps = {
  // profileId?: string;
  urlLinkKey: string;
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
  const isFavorites = [ProfileType.Favorites].includes(profileType);
  const isPlayList = [ProfileType.PlayList].includes(profileType);
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
    isFavorites,
    isPlayList,
  };
};

// /profile?type=pd?id=123123
const ProfileBase = React.memo(({urlLinkKey = '', onClickBack = () => {}, isPath = false}: ProfileBaseProps) => {
  const {back, changeParams, getParam} = useCustomRouter();
  const searchParams = useSearchParams();
  const isNeedBackBtn = searchParams?.get('from'); // "from" 쿼리 파라미터 값 가져오기
  const [dataUserDropDown, setUserDropDown] = useAtom(userDropDownAtom);
  const router = useRouter();
  const pathname = usePathname();
  const refDescription = useRef<HTMLDivElement | null>(null);
  const refHeader = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<DataProfileType>({
    urlLinkKey: urlLinkKey,
    profileId: 0,
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
      indexSort: ExploreSortType.Newest,
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
    isOpenPopupFriendsList: false,

    gap: 0,

    dataGift: {
      isOpen: false,
      idProfileTo: 0,
    },

    dataToast: {
      isOpen: false,
      message: '',
    },

    dataOtherProfileMenu: {
      isOpen: false,
    },

    refreshProfileTab: (profileId, indexTab, isRefreshAll = false) => {},
    getIsEmptyTab: () => true,
  });
  const dispatch = useDispatch();

  const isMine = data.profileInfo?.isMyProfile || false;
  const profileType = Number(data.profileInfo?.profileInfo?.type);
  const {
    isPD,
    isCharacter,
    isMyPD,
    isMyCharacter,
    isOtherPD,
    isOtherCharacter,
    isChannel,
    isOtherChannel,
    isMyChannel,
  } = getUserType(isMine, profileType);

  useEffect(() => {
    data.refreshProfileTab = refreshProfileTab;
    data.getIsEmptyTab = getIsEmptyTab;
  }, [data]);

  useEffect(() => {
    clearProfileTab();
    if (!isPath) {
      refreshProfileInfo(data.urlLinkKey);
      return;
    } else {
      //컴포넌트로 가져다 쓰는 경우 isPath=fase
      const id = pathname?.split('/').filter(Boolean).pop();
      if (id == undefined) return;
      data.urlLinkKey = id;
      refreshProfileInfo(data.urlLinkKey);
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

  useLayoutEffect(() => {
    data.indexTab = Number(getParam('indexTab')) || 0;
    setData({...data});
  }, []);

  type FilterType = {
    feedMediaType: FeedMediaType;
  };

  const getTabInfo = (
    typeProfile: ProfileType,
  ): ((
    profileUrlLinkKey: string,
    tabIndex: number,
    indexSort: ExploreSortType,
    filterType: {
      sharedTabType: number;
      feedMediaType: number;
      channelTabType: number;
      characterTabType: number;
      contentTabType: number;
    },
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
      return async (profileUrlLinkKey: string, tabType: PdProfileTabType) => {
        return null;
      };
    }
  };
  const getTabContentCount = (indexTab: number, isMine: boolean, profileType: ProfileType) => {
    const {isPD, isCharacter, isMyPD, isMyCharacter, isOtherPD, isOtherCharacter, isChannel, isOtherChannel} =
      getUserType(isMine, profileType);

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
    const isMine = data.profileInfo?.isMyProfile || false;
    const profileType = Number(data.profileInfo?.profileInfo?.type);
    const {isPD, isCharacter, isMyPD, isMyCharacter, isOtherPD, isOtherCharacter, isChannel, isOtherChannel} =
      getUserType(isMine, profileType);

    let indexFilter = 0;

    if (profileType == undefined) return;
    let resProfileTabInfo = null;
    if (isCharacter && indexTab == eTabCharacterOtherType.Info) {
      const reqSendGetCharacterInfo: GetCharacterInfoReq = {
        languageType: getCurrentLanguage(),
        profileId: data.profileInfo?.profileInfo?.id || 0,
      };
      const resGetCharacterInfo = await sendGetCharacterProfileInfo(reqSendGetCharacterInfo);
      if (resGetCharacterInfo.resultCode != 0) {
        console.error('api error : ', resGetCharacterInfo.resultMessage);
        return;
      }
      resProfileTabInfo = resGetCharacterInfo.data;
    } else if ((isPD && indexTab == eTabPDType.Info) || (isOtherPD && indexTab == eTabPDOtherType.Info)) {
      const resPdInfo = await getPdInfo({profileId: profileId});
      if (resPdInfo?.resultCode != 0) {
        console.error('api error : ', resPdInfo?.resultMessage);
        return;
      }
      resProfileTabInfo = {dataResPdInfo: resPdInfo?.data};
    } else if (isChannel && indexTab == eTabChannelOtherType.Info) {
      const resChannelInfo = await getChannelInfo({channelProfileId: profileId});
      if (resChannelInfo?.resultCode != 0) {
        console.error('api error : ', resChannelInfo?.resultMessage);
        return;
      }
      resProfileTabInfo = resChannelInfo?.data;
    } else {
      resProfileTabInfo = await getTabInfo(profileType)(
        data.urlLinkKey,
        indexTab,
        data.filterCluster?.indexSort || 0,
        {
          sharedTabType: data.filterCluster?.indexFilterShared || 0,
          channelTabType: data.filterCluster?.indexFilterChannel || 0,
          characterTabType: data.filterCluster?.indexFilterCharacter || 0,
          contentTabType: data.filterCluster?.indexFilterContent || 0,
          feedMediaType: data.filterCluster?.indexFilterMedia || 0,
        },
        isRefreshAll ? 0 : getTabContentCount(indexTab, isMine, profileType),
        isRefreshAll ? 10 : 10,
      );
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
      characterInfo,
      contentInfoList,
    } = resProfileTabInfo;
    if (!data.profileTabInfo[indexTab]) {
      data.profileTabInfo[indexTab] = resProfileTabInfo;
      return;
    }

    if (!!characterInfo) {
      data.profileTabInfo[indexTab].characterInfo = characterInfo;
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

  const refreshProfileInfo = async (urlLink: string) => {
    const resProfileInfo = await getProfileInfo(urlLink);
    if (!resProfileInfo) return;
    data.profileInfo = resProfileInfo;
    data.profileId = resProfileInfo.profileInfo.id;

    const indexTab = Number(data?.indexTab);
    await refreshProfileTab(resProfileInfo.profileInfo.id, indexTab);

    setData({...data});
  };

  const handleShare = async (url: string = window.location.href, title: string = '') => {
    const shareData = {
      title: title,
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

  const handleFollow = async (profileId: number, value: boolean, urlLinkKey: string = '') => {
    try {
      const response = await followProfile(profileId, value);

      const resProfileInfo = await getProfileInfo(urlLinkKey);
      if (!resProfileInfo) return;
      data.profileInfo = resProfileInfo;
      setData({...data});
    } catch (error) {
      console.error('An error occurred while Following:', error);
    }
  };

  const routerBack = () => {
    back('/main/homefeed');
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
      } else if (data.indexTab == eTabPDOtherType.Info) {
        isEmptyTab = false;
      } else if (data.indexTab == eTabPDType.Shared) {
        isEmptyTab = !data?.profileTabInfo?.[data.indexTab]?.sharedInfoList?.length;
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
        isEmptyTab = false;
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
      return getLocalizedLink(`/update/character/` + data.profileId);
    } else if ([ProfileType.Channel].includes(profileType)) {
      return getLocalizedLink(`/update/channel/` + data.profileId);
    }
    return getLocalizedLink(``);
  };

  const onCopyToClipboard = () => {
    copyCurrentUrlToClipboard(pathname, searchParams);
    data.dataToast.isOpen = true;
    data.dataToast.message = getLocalizedText('common_alert_091');
    setData({...data});
  };

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
            {getLocalizedText('Common', 'common_button_subscribe')}
          </button>
          <button
            className={styles.favorite}
            onClick={() => {
              data.isOpenPopupFavoritesList = true;
              setData({...data});
            }}
          >
            {getLocalizedText('Common', 'common_button_favorites')}
          </button>
          <button
            className={styles.playlist}
            onClick={() => {
              data.isOpenPopupPlayList = true;
              setData({...data});
            }}
          >
            {getLocalizedText('Common', 'common_button_playlist')}
          </button>
        </div>
      )}
      <section ref={refHeader} className={cx(styles.header, !isPath && styles.headerNoPath)}>
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
              {(isCharacter || isChannel) && (
                <div
                  className={cx(
                    styles.originalFan,
                    data.profileInfo?.profileInfo?.characterIP == CharacterIP.Original ? styles.original : styles.fan,
                  )}
                >
                  {data.profileInfo?.profileInfo?.characterIP == CharacterIP.Original
                    ? getLocalizedText('common_button_original')
                    : getLocalizedText('common_button_fan')}
                </div>
              )}
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
              handleShare(window.location.href, data.profileInfo?.profileInfo?.name);
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
            <img
              className={cx(styles.icon, styles.iconNotification)}
              src="/ui/profile/icon_notification.svg"
              alt=""
              onClick={() => {
                alert('DM기능 6월 추가 예정');
              }}
            />
          )}
          {!isMine && (
            <img
              className={cx(styles.icon, styles.iconSetting)}
              src={BoldMenuDots.src}
              alt=""
              onClick={() => {
                data.dataOtherProfileMenu.isOpen = true;
                setData({...data});
              }}
            />
          )}
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
            <div className={styles.count}>{data.profileInfo?.profileInfo.contentsCount}</div>
            <div className={styles.label}>{getLocalizedText('Common', 'common_label_contents')}</div>
          </div>
          <div className={styles.itemStatistic}>
            <div className={styles.count}>{data.profileInfo?.profileInfo.followerCount}</div>
            <div className={styles.label}>{getLocalizedText('Common', 'common_label_followers')}</div>
          </div>
          <div className={styles.itemStatistic}>
            <div className={styles.count}>
              {isPD ? data.profileInfo?.profileInfo?.followingCount : data.profileInfo?.profileInfo?.subscriberCount}
            </div>
            <div className={styles.label}>
              {isPD
                ? getLocalizedText('Common', 'home001_label_002')
                : getLocalizedText('Common', 'common_label_subscribers')}
            </div>
          </div>
        </div>
        <div className={styles.profileDetail}>
          <div
            className={styles.nameWrap}
            onClick={async () => {
              // const url = window.location.origin + pathname;
              // await navigator.clipboard.writeText(url);

              onCopyToClipboard();
            }}
          >
            <div className={styles.name}>{data.profileInfo?.profileInfo?.name}</div>
            <img className={styles.iconCopy} src={LineCopy.src} alt="" />
          </div>
          {isPD && (
            <div className={styles.verify}>
              <span className={styles.label}>Creator</span>
              <img className={styles.icon} src="/ui/profile/icon_verify.svg" alt="" />
            </div>
          )}
          {isCharacter && (
            <div className={cx(styles.verify, styles.decoration)}>
              <Link
                href={getLocalizedLink(`/profile/` + data.profileInfo?.profileInfo.pdProfileUrlLinkKey + '?from=""')}
              >
                <span className={styles.label}>Manager: {data.profileInfo?.profileInfo?.pdEmail}</span>
              </Link>
            </div>
          )}
          {isChannel && (
            <div className={cx(styles.verify, styles.decoration)}>
              <Link
                href={getLocalizedLink(`/profile/` + data.profileInfo?.profileInfo.pdProfileUrlLinkKey + '?from=""')}
              >
                <span className={styles.label}>Owner: {data.profileInfo?.profileInfo?.pdEmail}</span>
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
              {getLocalizedText('Common', 'common_label_showmore')}
            </div>
          )}
          {(isMyPD || isMyChannel) && (
            <div className={styles.buttons}>
              <button
                className={styles.ad}
                onClick={() => {
                  alert('6월에 기능 추가 예정');
                }}
              >
                {getLocalizedText('Common', 'common_button_ad')}
              </button>
              {isMyPD && (
                <button
                  className={styles.friends}
                  onClick={() => {
                    alert('6월에 기능 추가 예정');
                    // data.isOpenPopupFriendsList = true;
                    // setData({...data});
                  }}
                >
                  {getLocalizedText('Common', 'common_button_addfriends')}
                </button>
              )}
            </div>
          )}
          {isMyCharacter && (
            <div className={styles.buttons}>
              <button
                className={styles.ad}
                onClick={() => {
                  alert('6월에 기능 추가 예정');
                }}
              >
                {getLocalizedText('Common', 'common_button_ad')}
              </button>
              <button className={styles.chat}>
                {/* <Link href={getLocalizedLink(`/character/` + data.profileInfo?.profileInfo.typeValueId)}> */}
                <Link href={getLocalizedLink(`/chat/?v=${data.urlLinkKey}` || `?v=`)}>
                  {getLocalizedText('Common', 'common_button_chat')}
                </Link>
              </button>
            </div>
          )}
          {isOtherPD && (
            <div className={styles.buttonsOtherPD}>
              <button
                className={styles.follow}
                onClick={() => {
                  handleFollow(data.profileId, !isFollow, data.urlLinkKey);
                }}
              >
                {isFollow
                  ? getLocalizedText('Common', 'common_button_following')
                  : getLocalizedText('Common', 'common_button_follow')}
              </button>
              <button
                className={styles.gift}
                onClick={() => {
                  data.dataGift.isOpen = true;
                  setData({...data});
                }}
              >
                <img className={styles.icon} src="/ui/profile/icon_gift.svg" alt="" />
              </button>
            </div>
          )}
          {(isOtherChannel || isOtherCharacter) && (
            <div className={styles.buttonsOtherCharacter}>
              <button
                className={styles.subscribe}
                onClick={() => {
                  data.isOpenPopupSubscription = true;
                  setData({...data});
                }}
              >
                {getLocalizedText('Common', 'common_button_subscribe')}
              </button>
              <button
                className={styles.follow}
                onClick={() => {
                  handleFollow(data.profileId, !isFollow, data.urlLinkKey);
                }}
              >
                {isFollow ? getLocalizedText('common_button_following') : getLocalizedText('common_button_follow')}
              </button>
              <button
                className={styles.giftWrap}
                onClick={() => {
                  data.dataGift.isOpen = true;
                  setData({...data});
                }}
              >
                <img className={styles.icon} src="/ui/profile/icon_gift.svg" alt="" />
              </button>
              {isOtherCharacter && (
                <button className={styles.chat}>
                  <Link href={getLocalizedLink(`/chat/?v=${data.urlLinkKey}` || `?v=`)}>
                    {getLocalizedText('common_button_chat')}
                  </Link>
                </button>
              )}
            </div>
          )}
        </div>
        <section className={styles.tabSection}>
          <div className={styles.tabHeaderContainer} style={{top: (refHeader?.current?.clientHeight || 0) - 1}}>
            <TabHeaderWrapComponent
              indexTab={data.indexTab}
              isMine
              profileId={data.profileId}
              profileType={profileType}
              onTabChange={async indexTab => {
                data.indexTab = indexTab;
                changeParams('indexTab', indexTab);
                await refreshProfileTab(data.profileId, data.indexTab);
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
                  await data.refreshProfileTab(data.profileId, data.indexTab, true);
                  setData(v => ({...data}));
                }
                if ((filterCluster?.indexFilterCharacter ?? -1) >= 0) {
                  data.filterCluster.indexFilterCharacter = filterCluster?.indexFilterCharacter ?? -1;
                  await data.refreshProfileTab(data.profileId, data.indexTab, true);
                  setData(v => ({...data}));
                }

                if ((filterCluster?.indexSort ?? -1) >= 0) {
                  data.filterCluster.indexSort = filterCluster?.indexSort ?? -1;
                  await data.refreshProfileTab(data.profileId, data.indexTab, true);
                  setData(v => ({...data}));
                }

                if ((filterCluster?.indexFilterChannel ?? -1) >= 0) {
                  data.filterCluster.indexFilterChannel = filterCluster?.indexFilterChannel ?? -1;
                  await data.refreshProfileTab(data.profileId, data.indexTab, true);
                  setData(v => ({...data}));
                }

                if ((filterCluster?.indexFilterShared ?? -1) >= 0) {
                  data.filterCluster.indexFilterShared = filterCluster?.indexFilterShared ?? -1;
                  await data.refreshProfileTab(data.profileId, data.indexTab, true);
                  setData(v => ({...data}));
                }
                if ((filterCluster?.indexFilterContent ?? -1) >= 0) {
                  data.filterCluster.indexFilterContent = filterCluster?.indexFilterContent ?? -1;
                  await data.refreshProfileTab(data.profileId, data.indexTab, true);
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
                await data.refreshProfileTab(data.profileId, data.indexTab, isRefreshAll);
              }}
              profileTabInfo={data.profileTabInfo}
              filterCluster={data.filterCluster}
              profileUrlLinkKey={data.urlLinkKey}
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
          id={data.profileId}
          onClose={() => {
            data.isOpenPopupSubscription = false;
            setData({...data});
          }}
          onComplete={() => {
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
          profileId={data.profileId}
          profileType={ProfileType.Favorites}
          onClose={() => {
            data.isOpenPopupFavoritesList = false;
            setData({...data});
          }}
        />
      )}

      {data.isOpenPopupPlayList && (
        <PopupPlaylist
          isMine={isMine}
          profileId={data.profileId}
          profileType={ProfileType.PlayList}
          onClose={() => {
            data.isOpenPopupPlayList = false;
            setData({...data});
          }}
        />
      )}

      {data.isOpenPopupFriendsList && (
        <PopupFriends
          onClose={() => {
            data.isOpenPopupFriendsList = false;
            setData({...data});
          }}
        />
      )}

      {data.dataGift.isOpen && (
        <DrawerDonation
          giveToPDId={data.profileId}
          isOpen={data.dataGift.isOpen}
          onClose={() => {
            data.dataGift.isOpen = false;
            setData({...data});
          }}
          sponsoredName={data.profileInfo?.profileInfo?.name || ''}
        />
      )}
      <SelectDrawer
        isOpen={data.dataOtherProfileMenu.isOpen}
        onClose={() => {
          data.dataOtherProfileMenu.isOpen = false;
          setData({...data});
        }}
        items={[
          {
            name: getLocalizedText('common_dropdown_report'),
            onClick: () => {
              alert('신고하기 추가 예정');
            },
          },
        ]}
        selectedIndex={-1}
      />

      <>
        <Backdrop
          open={data.dataToast.isOpen}
          onClick={() => {
            data.dataToast.isOpen = false;
            setData({...data});
          }}
          sx={{
            zIndex: 999,
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // 살짝 어두운 흐림 효과
            // backdropFilter: 'blur(5px)', // 흐림 효과
          }}
        />
        <Snackbar
          open={data.dataToast.isOpen}
          anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
          autoHideDuration={1000}
          message={data.dataToast.message}
          onClose={() => {
            data.dataToast.isOpen = false;
            setData({...data});
          }}
          sx={{
            bottom: '20px',
            width: 'calc(var(--full-width-percent) - 32px)', // 전체 너비
            zIndex: 999,
            '& .MuiPaper-root': {
              height: '47px',
              width: '100%', // 전체 너비

              background: 'rgba(255, 255, 255, 1)', // 배경색
              borderRadius: '12px', // 둥근 모서리

              whiteSpace: 'nowrap', // 한 줄 처리
              overflow: 'hidden', // 넘치는 텍스트 숨김
              textOverflow: 'ellipsis', // 말줄임표 처리
            },
            '& .MuiSnackbarContent-message': {
              width: '100%',
              textAlign: 'center', // 텍스트 중앙 정렬
              fontFamily: 'Lato, sans-serif', // Lato 폰트 적용
              fontSize: '14px',
              fontWeight: 600,
              lineHeight: '20px',
              color: '#000', // 글자 색상
            },
          }}
        />
      </>
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
      name: getLocalizedText('common_dropdown_edit'),
      onClick: () => {
        onEdit();
      },
    },
    // {
    //   name: tabContentMenu.isPin ? 'Unpin' : 'Pin to Top',
    //   onClick: async () => {
    //     const dataUpdatePin: PinFixFeedReq = {
    //       feedId: Number(tabContentMenu.id),
    //       isFix: !tabContentMenu.isPin,
    //     };
    //     await updatePin(dataUpdatePin);
    //     refreshTabAll();
    //   },
    // },
    {
      name: getLocalizedText('common_dropdown_share'),
      onClick: () => {
        onShare();
      },
    },
    {
      name: getLocalizedText('common_dropdown_delete'),
      onClick: () => {
        onDelete();
      },
    },
  ];
  let uploadImageItems: SelectDrawerItem[] = [
    // {
    //   name: tabContentMenu.isPin ? 'Unpin' : 'Pin to Top',
    //   onClick: () => {},
    // },
    // {
    //   name: 'Hide',
    //   onClick: () => {
    //     onHide();
    //   },
    // },
    {
      name: getLocalizedText('common_dropdown_share'),
      onClick: () => {
        onShare();
      },
    },
    {
      name: getLocalizedText('common_dropdown_report'),
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

const SelectBoxProfileFilter = ({
  value,
  options = [],
  onChange = (id: number) => {},
}: {
  value: any;
  options: any[];
  onChange: (id: number) => void;
}) => {
  return (
    <SelectBox
      value={value}
      options={options}
      ArrowComponent={SelectBoxArrowComponent}
      ValueComponent={SelectBoxValueComponent}
      OptionComponent={SelectBoxOptionComponent}
      onChange={onChange}
      customStyles={{
        control: {
          width: '90px',
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
        menu: {
          width: '160px',
          right: '-5px',
          marginTop: '-6px',
        },
      }}
    />
  );
};

export type SelectBoxProps = {
  value: {id: number; [key: string]: any} | null;
  options: {id: number; [key: string]: any}[];
  OptionComponent: (data: {id: number; [key: string]: any}, isSelected: boolean) => JSX.Element;
  ValueComponent: (data: any, isOpen?: boolean) => JSX.Element;
  ArrowComponent: (isOpen?: boolean) => JSX.Element;
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
      padding: 0,
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
  useEffect(() => {
    if (!value) return;
    setSelectedOption(value);
  }, [value]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent) ||
          window.matchMedia('(pointer: coarse)').matches,
      );
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div
      onClick={() => {
        // if (!isOpen) {
        //   setIsOpen(true);
        // }
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
            return ArrowComponent(isOpen);
          }, [isOpen]),
          Option: React.useCallback(
            (props: any) => (
              <components.Option {...props}>{OptionComponent(props.data, props.isSelected)}</components.Option>
            ),
            [],
          ),
          SingleValue: React.useCallback(
            (props: any) => {
              return (
                <components.SingleValue {...props}>
                  <div
                    {...(isMobile
                      ? {
                          onTouchEnd: () => {
                            if (isOpen) {
                              setTimeout(() => {
                                setIsOpen(false);
                              }, 100);
                            }
                          },
                        }
                      : {
                          onClick: () => {
                            if (isOpen) {
                              setIsOpen(false);
                            }
                          },
                        })}
                  >
                    {ValueComponent(props.data, isOpen)}
                  </div>
                </components.SingleValue>
              );
            },
            [isOpen],
          ),
        }}
        getOptionValue={option => option.id.toString()}
      />
    </div>
  );
};

const SelectBoxArrowComponent = (isOpen?: boolean) => (
  <img
    className={styles.icon}
    src={BoldAltArrowDown.src}
    alt="altArrowDown"
    style={{transform: `rotate(${isOpen ? 180 : 0}deg)`}}
  />
);

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
  profileUrlLinkKey: string;

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
  const {
    isPD,
    isCharacter,
    isMyPD,
    isMyCharacter,
    isOtherPD,
    isOtherCharacter,
    isChannel,
    isOtherChannel,
    isFavorites,
    isPlayList,
  } = getUserType(isMine, profileType);
  const sortOptionList = [
    {id: ExploreSortType.Newest, value: getLocalizedText('Common', 'common_sort_newest')},
    {id: ExploreSortType.Popular, value: getLocalizedText('Common', 'common_sort_popular')},
    {id: ExploreSortType.Name, value: getLocalizedText('Common', 'common_sort_Name')},
  ];
  const feedSortOptionList = [
    {id: ExploreSortType.Newest, value: getLocalizedText('Common', 'common_sort_newest')},
    {id: ExploreSortType.Popular, value: getLocalizedText('Common', 'common_sort_popular')},
    {id: ExploreSortType.Name, value: getLocalizedText('Common', 'common_sort_Name')},
  ];

  if (
    (isPD && [eTabPDType.Feed].includes(tabIndex)) ||
    (isCharacter && [eTabCharacterType.Feed].includes(tabIndex)) ||
    (isChannel && [eTabChannelType.Feed].includes(tabIndex)) ||
    (isFavorites && [eTabFavoritesType.Feed].includes(tabIndex)) ||
    (isPlayList && [eTabPlayListType.Feed].includes(tabIndex))
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
              className={cx(
                styles.iconWrap,
                styles.bg,
                filterCluster.indexFilterMedia == FeedMediaType.Total && styles.active,
              )}
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
              <SelectBoxProfileFilter
                value={feedSortOptionList?.find(v => v.id == filterCluster?.indexSort) || feedSortOptionList[0]}
                options={feedSortOptionList}
                onChange={async id => {
                  const indexSort = id;
                  console.log('indexSort : ', indexSort);
                  onChange({indexSort: indexSort});
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
    (isChannel && [eTabChannelType.Contents].includes(tabIndex)) ||
    (isFavorites && [eTabFavoritesType.Contents].includes(tabIndex)) ||
    (isPlayList && [eTabPlayListType.Contents].includes(tabIndex))
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
                styles.bg,
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
              <div className={styles.text}>{getLocalizedText('common_filter_series')}</div>
            </div>
            <div
              className={cx(
                styles.textWrap,
                filterCluster.indexFilterContent == eContentFilterType.Single && styles.active,
              )}
              data-filter={eContentFilterType.Single}
            >
              <div className={styles.text}>{getLocalizedText('common_filter_single')}</div>
            </div>
            {isFavorites && (
              <div
                className={cx(
                  styles.textWrap,
                  filterCluster.indexFilterContent == eContentFilterType.Episode && styles.active,
                )}
                data-filter={eContentFilterType.Episode}
              >
                <div className={styles.text}>{getLocalizedText('common_filter_episode')}</div>
              </div>
            )}
          </div>
          <div className={styles.right}>
            <div className={styles.filterTypeWrap}>
              <SelectBoxProfileFilter
                value={sortOptionList?.find(v => v.id == filterCluster?.indexSort) || sortOptionList[0]}
                options={sortOptionList}
                onChange={async id => {
                  const indexSort = id;
                  onChange({indexSort: indexSort});
                }}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (
    (isPD && [eTabPDType.Character].includes(tabIndex)) ||
    (isCharacter && [eTabCharacterType.Character].includes(tabIndex)) ||
    (isChannel && [eTabChannelType.Character].includes(tabIndex)) ||
    (isFavorites && [eTabFavoritesType.Character].includes(tabIndex)) ||
    (isPlayList && [eTabPlayListType.Character].includes(tabIndex))
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
                onChange({indexFilterCharacter: indexFilter});
              }
            }}
          >
            <div
              className={cx(
                styles.iconWrap,
                styles.bg,
                filterCluster.indexFilterCharacter == eCharacterFilterType.Total && styles.active,
              )}
              data-filter={eCharacterFilterType.Total}
            >
              <img src={BoldViewGallery.src} alt="" />
            </div>
            <div
              className={cx(
                styles.textWrap,
                filterCluster.indexFilterCharacter == eCharacterFilterType.Original && styles.active,
              )}
              data-filter={eCharacterFilterType.Original}
            >
              <div className={styles.text}>{getLocalizedText('common_button_original')}</div>
            </div>
            <div
              className={cx(
                styles.textWrap,
                filterCluster.indexFilterCharacter == eCharacterFilterType.Fan && styles.active,
              )}
              data-filter={eCharacterFilterType.Fan}
            >
              <div className={styles.text}>{getLocalizedText('common_button_fan')}</div>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.filterTypeWrap}>
              <SelectBoxProfileFilter
                value={sortOptionList?.find(v => v.id == filterCluster?.indexSort) || sortOptionList[0]}
                options={sortOptionList}
                onChange={async id => {
                  const indexSort = id;
                  onChange({indexSort: indexSort});
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
    (isCharacter && [eTabCharacterType.Channel].includes(tabIndex)) ||
    (isFavorites && [eTabFavoritesType.Channel].includes(tabIndex))
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
                styles.bg,
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
              <div className={styles.text}>{getLocalizedText('common_button_original')}</div>
            </div>
            <div
              className={cx(
                styles.textWrap,

                filterCluster.indexFilterChannel == eCharacterFilterType.Fan && styles.active,
              )}
              data-filter={eCharacterFilterType.Fan}
            >
              <div className={styles.text}>{getLocalizedText('common_button_fan')}</div>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.filterTypeWrap}>
              <SelectBoxProfileFilter
                value={sortOptionList?.find(v => v.id == filterCluster?.indexSort) || sortOptionList[0]}
                options={sortOptionList}
                onChange={async id => {
                  const indexSort = id;
                  onChange({indexSort: indexSort});
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
                styles.bg,
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
              <div className={styles.text}>{getLocalizedText('common_button_channel')}</div>
            </div>
            <div
              className={cx(
                styles.textWrap,
                filterCluster.indexFilterShared == eSharedFilterType.Character && styles.active,
              )}
              data-filter={eSharedFilterType.Character}
            >
              <div className={styles.text}>{getLocalizedText('common_button_character')}</div>
            </div>
          </div>
          <div className={styles.right}>
            <div className={styles.filterTypeWrap}>
              <SelectBoxProfileFilter
                value={sortOptionList?.find(v => v.id == filterCluster?.indexSort) || sortOptionList[0]}
                options={sortOptionList}
                onChange={async id => {
                  const indexSort = id;
                  onChange({indexSort: indexSort});
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
export const TabHeaderWrapPlayListComponent = ({
  indexTab,
  profileId,
  profileType,
  isMine,
  onTabChange,
}: TabHeaderComponentType) => {
  const getTabHeaderList = () => {
    return Object.values(eTabPlayListType)
      .filter(value => typeof value === 'number') // 숫자 타입만 필터링
      .map(type => ({type, label: eTabPlayListType[type]}));
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

export const TabHeaderWrapFavoritesComponent = ({
  indexTab,
  profileId,
  profileType,
  isMine,
  onTabChange,
}: TabHeaderComponentType) => {
  const getTabHeaderList = () => {
    return Object.values(eTabFavoritesType)
      .filter(value => typeof value === 'number') // 숫자 타입만 필터링
      .map(type => ({type, label: eTabFavoritesType[type]}));
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
    | eTabFavoritesType
    | eTabPlayListType;
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
      | eTabFavoritesType
      | eTabPlayListType;
  }>({indexTab: indexTab});
  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onResize = () => {
      setData({...data});
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize);
    };
  }, [data]);

  useEffect(() => {
    data.indexTab = indexTab;
    setData({...data});
  }, [indexTab, tabHeaderList]);

  const calculateGap = () => {
    if (containerRef.current) {
      const containerWidth = (containerRef.current?.clientWidth || 0) - 32;
      // const containerWidth = Math.min(document.documentElement.clientWidth, document.body.clientWidth) - 32;
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

            const textHeader = tab?.label as keyof typeof mappingStrToGlobalTextKey;
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
                  {getLocalizedText(mappingStrToGlobalTextKey[textHeader])}
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
  profileUrlLinkKey,
}: TabContentProps) => {
  const {isPD, isCharacter, isMyPD, isMyCharacter, isOtherPD, isOtherCharacter, isChannel, isOtherChannel} =
    getUserType(isMine, profileType);
  const router = useRouter();
  const [data, setData] = useState<{
    tabContentMenu: TabContentMenuType;
    isShareOpened: boolean;

    isOpenPreview: boolean;
  }>({
    tabContentMenu: {
      id: 0,
      isPin: false,
      isSettingOpen: false,
      isSingle: false,
    },
    isShareOpened: false,

    isOpenPreview: false,
  });
  const handleShare = async (url: string = window.location.href, title: string = '') => {
    const shareData = {
      title: title,
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
        profileUrlLinkKey={profileUrlLinkKey}
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
          const url = data.tabContentMenu.shareUrl;
          const title = data.tabContentMenu.shareTitle;
          handleShare(url, title);
        }}
        onDelete={async () => {
          if (
            (isPD && tabIndex == eTabPDType.Character) ||
            (isCharacter && tabIndex == eTabCharacterType.Character) ||
            (isChannel && tabIndex == eTabChannelType.Character)
          ) {
            await deleteProfile({profileId: Number(data.tabContentMenu.id)});
          }

          if (
            (isPD && tabIndex == eTabPDType.Feed) ||
            (isCharacter && tabIndex == eTabCharacterType.Feed) ||
            (isChannel && tabIndex == eTabChannelType.Feed)
          ) {
            await deleteFeed({feedId: Number(data.tabContentMenu.id)});
          }

          if (
            (isCharacter && tabIndex == eTabCharacterType.Contents) ||
            (isChannel && tabIndex == eTabChannelType.Contents)
          ) {
            await sendDeleteContent({contentId: Number(data.tabContentMenu.id)});
          }

          if ((isPD && tabIndex == eTabPDOtherType.Channel) || (isCharacter && tabIndex == eTabCharacterType.Channel)) {
            await deleteProfile({profileId: Number(data.tabContentMenu.id)});
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
            router.push(getLocalizedLink(`/update/post/` + data.tabContentMenu.urlLinkKey));
          }

          if (
            (isCharacter && tabIndex == eTabCharacterType.Contents) ||
            (isChannel && tabIndex == eTabChannelType.Contents)
          ) {
            if (data.tabContentMenu.isSingle) {
              router.push(getLocalizedLink(`/update/content/single/` + data.tabContentMenu.urlLinkKey));
            } else {
              router.push(getLocalizedLink(`/update/content/series/` + data.tabContentMenu.urlLinkKey));
            }
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
      <SharePopup
        open={data.isShareOpened}
        title={data?.tabContentMenu?.shareTitle || '공유하기'}
        url={data.tabContentMenu?.shareUrl || window.location.href}
        onClose={() => {
          setData(v => ({...v, isShareOpened: false}));
        }}
      ></SharePopup>
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
  profileUrlLinkKey,
}: TabContentProps) => {
  const {ref: observerRef, inView} = useInView();
  const {isPD, isCharacter, isMyPD, isMyCharacter, isOtherPD, isOtherCharacter, isChannel, isOtherChannel} =
    getUserType(isMine, profileType);
  const [data, setData] = useState<{
    isOpenPreview: boolean;
  }>({
    isOpenPreview: false,
  });
  useEffect(() => {
    if (!inView) return;

    if (isEmptyTab) return;

    refreshTab();
  }, [inView]);

  const refreshTab = async () => {
    onRefreshTab(false);
  };

  if (isEmptyTab) {
    return (
      <>
        <div className={styles.emptyWrap}>
          <img src="/ui/profile/image_empty.svg" alt="" />
          <div className={styles.text}>{formatText(getLocalizedText('Common', 'common_sample_091'))}</div>
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
              <FeedComponent
                feedInfo={one}
                index={index}
                isMine={isMine}
                onOpenContentMenu={onOpenContentMenu}
                urlLinkThumbnail={
                  getLocalizedLink(`/profile/feed/` + profileUrlLinkKey) +
                  `?type=${profileType}&idContent=${one.id}&feedMediaType=${filterCluster.indexFilterMedia}&feedSortType=${filterCluster.indexSort}`
                }
              />
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
            <CharacterComponent
              isMine={isMine}
              index={index}
              itemInfo={one}
              urlLinkThumbnail={getLocalizedLink(`/profile/` + one?.urlLinkKey + '?from=""')}
              onOpenContentMenu={onOpenContentMenu}
            />
          );
        })}
        <div ref={observerRef}></div>
      </ul>
    );
  }

  if (isPD && tabIndex == eTabPDType.Shared) {
    return (
      <ul className={styles.itemWrap}>
        {profileTabInfo?.[tabIndex]?.sharedInfoList.map((one, index: number) => {
          if (one.sharedItemType == SharedItemType.Channel) {
            return (
              <CharacterComponent
                isMine={isMine}
                index={index}
                itemInfo={one}
                urlLinkThumbnail={getLocalizedLink(`/profile/` + one?.urlLinkKey + '?from=""')}
                onOpenContentMenu={onOpenContentMenu}
              />
            );
          } else if (one.sharedItemType == SharedItemType.Character) {
            return (
              <ChannelComponent
                index={index}
                isMine={isMine}
                itemInfo={one}
                urlLinkThumbnail={getLocalizedLink(`/profile/` + one?.urlLinkKey + '?from=""')}
                onOpenContentMenu={onOpenContentMenu}
              />
            );
          } else {
            return (
              <CharacterComponent
                isMine={isMine}
                index={index}
                itemInfo={one}
                urlLinkThumbnail={getLocalizedLink(`/profile/` + one?.urlLinkKey + '?from=""')}
                onOpenContentMenu={onOpenContentMenu}
              />
            );
          }
        })}
        <div ref={observerRef}></div>
      </ul>
    );
  }

  if ((isCharacter && tabIndex == eTabCharacterType.Contents) || (isChannel && tabIndex == eTabChannelType.Contents)) {
    return (
      <ul className={styles.itemWrap}>
        {profileTabInfo?.[tabIndex]?.contentInfoList.map((one, index: number) => {
          const isSingle = one.contentType == ContentType.Single;
          const urlLink = isSingle ? '/content/single/' : '/content/series/';
          return (
            <ContentComponent
              isMine={isMine}
              index={index}
              itemInfo={one}
              urlLinkThumbnail={getLocalizedLink(urlLink + one?.urlLinkKey + '?from=""')}
              onOpenContentMenu={onOpenContentMenu}
            />
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
            <ChannelComponent
              index={index}
              isMine={isMine}
              itemInfo={one}
              urlLinkThumbnail={getLocalizedLink(`/profile/` + one?.urlLinkKey + '?from=""')}
              onOpenContentMenu={onOpenContentMenu}
            />
          );
        })}
        <div ref={observerRef}></div>
      </ul>
    );
  }

  if ((isPD && tabIndex == eTabPDType.Info) || (isOtherPD && tabIndex == eTabPDOtherType.Info)) {
    const pdInfo = profileTabInfo?.[tabIndex]?.dataResPdInfo;
    return (
      <>
        <section className={styles.pdInfoSection}>
          {!!pdInfo?.introduce && <div className={styles.label}>{getLocalizedText('profile007_label_001')}</div>}
          {!!pdInfo?.introduce && <div className={styles.value}>{pdInfo?.introduce}</div>}
          {pdInfo?.interests.length != 0 && (
            <div className={styles.label}>{getLocalizedText('profile007_label_002')}</div>
          )}
          {pdInfo?.interests.length != 0 && (
            <ul className={styles.tags}>
              {pdInfo?.interests.map((one, index) => {
                if (one == '') return;
                return (
                  <li key={index} className={styles.tag}>
                    {one}
                  </li>
                );
              })}
            </ul>
          )}

          {pdInfo?.skills.length != 0 && <div className={styles.label}>{getLocalizedText('common_alert_056')}</div>}
          {pdInfo?.skills.length != 0 && (
            <ul className={styles.tags}>
              {pdInfo?.skills.map((one, index) => {
                return (
                  <li key={index} className={styles.tag}>
                    {one}
                  </li>
                );
              })}
            </ul>
          )}
          {!!pdInfo?.personalHistory && (
            <div className={cx(styles.label, styles.labelPersonalHistory)}>
              {getLocalizedText('profile007_label_003')}
            </div>
          )}
          {!!pdInfo?.personalHistory && <div className={styles.value}>{pdInfo?.personalHistory}</div>}
          {!!pdInfo?.honorAwards && (
            <div className={cx(styles.label, styles.honorAwards)}>{getLocalizedText('profile007_label_004')}</div>
          )}
          {!!pdInfo?.honorAwards && <div className={styles.value}>{pdInfo?.honorAwards}</div>}
          {!!pdInfo?.url && <div className={styles.label}>URL</div>}
          {!!pdInfo?.url && <div className={styles.value}>{pdInfo?.url}</div>}
          {pdInfo?.pdPortfolioInfoList.length != 0 && (
            <div className={cx(styles.label, styles.labelPortfolio)}>{getLocalizedText('profile007_label_005')}</div>
          )}
          {pdInfo?.pdPortfolioInfoList.length != 0 && (
            <div className={styles.value}>
              <Swiper
                className={styles.uploadArea}
                freeMode={true}
                slidesPerView={'auto'}
                onSlideChange={() => {}}
                onSwiper={swiper => {}}
                spaceBetween={8}
              >
                {pdInfo?.pdPortfolioInfoList.map((one, index) => {
                  return (
                    <SwiperSlide
                      key={index}
                      onClick={() => {
                        data.isOpenPreview = true;
                        setData({...data});
                        // data.dataPortfolio.isOpenDrawer = true;
                        // data.dataPortfolio.idSelected = index;
                        // setData({...data});
                      }}
                    >
                      <div className={styles.thumbnailWrap}>
                        <img src={one.imageUrl} alt="" />
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          )}
        </section>
        {data.isOpenPreview && (
          <PortfolioListPopup
            onChange={() => {}}
            onClose={() => {
              data.isOpenPreview = false;
              setData({...data});
            }}
            dataList={pdInfo.pdPortfolioInfoList}
          />
        )}
      </>
    );
  }
  if (isCharacter && tabIndex == eTabCharacterOtherType.Info) {
    console.log('profileTabInfo?.[tabIndex].characterInfo : ', profileTabInfo?.[tabIndex].characterInfo);
    return (
      <>
        <section className={styles.characterInfoSection}>
          <CharacterProfileDetailComponent
            profileId={profileId}
            characterInfo={profileTabInfo?.[tabIndex].characterInfo}
            urlLinkKey={profileTabInfo?.[tabIndex].urlLinkKey}
            onRefresh={() => {
              onRefreshTab(false);
            }}
          />
        </section>
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
          {/* <div className={styles.bgGradient}></div> */}
        </section>

        <div className={styles.infoWrap}>
          <div className={styles.left}>
            <Link href={getLocalizedLink(`/profile/` + channelInfo?.pdProfileSimpleInfo?.urlLinkKey + '?from=""')}>
              <img src={channelInfo?.pdProfileSimpleInfo?.iconImageUrl} alt="" className={styles.profileMaker} />
              <div className={styles.name}>{channelInfo?.pdProfileSimpleInfo.name}</div>
            </Link>
          </div>

          <div className={styles.right}>
            <div
              className={styles.likeWrap}
              onClick={async () => {
                const isLike = !channelInfo?.isLike;
                await sendLike(InteractionType.Channel, profileId, !channelInfo?.isLike);
                if (isLike && channelInfo?.isDisLike) {
                  await sendDisLike(InteractionType.Channel, profileId, false);
                }

                onRefreshTab(false);
              }}
            >
              <img src={BoldLike.src} alt="" className={cx(styles.like, channelInfo?.isLike && styles.active)} />
              <div className={styles.count}>{channelInfo?.likeCount}</div>
            </div>
            <img
              src={BoldDislike.src}
              alt=""
              className={cx(styles.dislike, channelInfo?.isDisLike && styles.active)}
              onClick={async () => {
                const isDisLike = !channelInfo?.isDisLike;
                await sendDisLike(InteractionType.Channel, profileId, isDisLike);
                if (isDisLike && channelInfo?.isLike) {
                  await sendLike(InteractionType.Channel, profileId, false);
                }

                onRefreshTab(false);
              }}
            />
            {!channelInfo?.isBookmark && (
              <img
                src={LineArchive.src}
                alt=""
                className={styles.bookmark}
                onClick={async () => {
                  await bookmark({interactionType: InteractionType.Channel, isBookMark: true, typeValueId: profileId});
                  onRefreshTab(false);
                }}
              />
            )}
            {channelInfo?.isBookmark && (
              <img
                src={BoldArchive.src}
                alt=""
                className={cx(styles.bookmark, styles.active)}
                onClick={async () => {
                  await bookmark({interactionType: InteractionType.Channel, isBookMark: false, typeValueId: profileId});
                  onRefreshTab(false);
                }}
              />
            )}
          </div>
        </div>

        {tagList?.length != 0 && (
          <section className={styles.tagSection}>
            <ul className={styles.metatags}>
              {tagList.map((tag, index) => {
                return <li className={styles.item}>{tag}</li>;
              })}
            </ul>
          </section>
        )}
        {channelInfo?.memberProfileIdList?.length != 0 && (
          <section className={styles.memberSection}>
            <div className={styles.label}>
              {channelInfo?.memberProfileIdList?.length} {getLocalizedText('CreateChannel002_label_001')}
            </div>
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
        )}
        {!!channelInfo?.description && (
          <section className={styles.descriptionSection}>
            <div className={styles.label}>{getLocalizedText('CreateChannel001_label_007')}</div>
            <div className={styles.value}>{channelInfo?.description}</div>
          </section>
        )}
      </section>
    );
  }
};

export type ChannelComponentType = {
  isMine: boolean;
  index: number;
  urlLinkThumbnail: string;
  itemInfo: ProfileTabItemInfo;
  onOpenContentMenu?: (data: TabContentMenuType) => void;
};

export const ChannelComponent = ({
  isMine,
  index,
  urlLinkThumbnail,
  itemInfo,
  onOpenContentMenu,
}: ChannelComponentType) => {
  const isPD = itemInfo.characterIP == CharacterIP.None;
  const isOriginal = itemInfo.characterIP == CharacterIP.Original;
  const characterIPStr = isOriginal ? 'Original' : 'Fan';
  return (
    <Link href={urlLinkThumbnail}>
      <li className={styles.itemTab} key={itemInfo?.id}>
        {itemInfo.mediaState == MediaState.Image && (
          <img className={styles.imgThumbnail} src={itemInfo?.mediaUrl} alt="" />
        )}
        {itemInfo.mediaState == MediaState.Video && (
          <video autoPlay={true} muted={true} loop={true} className={styles.imgThumbnail} src={itemInfo?.mediaUrl} />
        )}
        {itemInfo?.isPinFix && (
          <div className={styles.pin}>
            <img src={BoldPin.src} alt="" />
          </div>
        )}
        <div className={styles.bgGradientWrap}>
          <div className={styles.bgGradient}></div>
        </div>
        <div className={styles.info}>
          <div className={styles.likeWrap}>
            <img src={BoldContentLists.src} alt="" />
            <div className={styles.value}>{itemInfo?.mediaCount}</div>
          </div>
          <div className={styles.likeWrap}>
            <img src={BoldCharacter.src} alt="" />
            <div className={styles.value}>{itemInfo?.memberCount}</div>
          </div>
        </div>
        <div className={styles.titleWrap}>
          <div className={styles.left}>
            <div className={styles.name}>{itemInfo?.name}</div>
            {!isPD && (
              <span className={cx(styles.grade, isOriginal ? styles.original : styles.fan)}>{characterIPStr}</span>
            )}
          </div>
          <div
            className={styles.right}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              const dataContextMenu = {
                id: itemInfo.id,
                index: index,
                isPin: itemInfo?.isPinFix || false,
                isSettingOpen: true,
                shareUrl: window.location.origin + urlLinkThumbnail,
                shareName: itemInfo?.name,
              };
              if (onOpenContentMenu) onOpenContentMenu(dataContextMenu);
            }}
          >
            <img src={BoldMenuDots.src} alt="" className={styles.iconSetting} />
          </div>
        </div>
      </li>
    </Link>
  );
};

export type ContentComponentType = {
  isMine: boolean;
  index: number;
  urlLinkThumbnail: string;
  itemInfo: ProfileTabItemInfo;
  onOpenContentMenu?: (data: TabContentMenuType) => void;
};

export const ContentComponent = ({
  isMine,
  index,
  urlLinkThumbnail,
  itemInfo,
  onOpenContentMenu,
}: ContentComponentType) => {
  return (
    <Link href={urlLinkThumbnail}>
      <li className={styles.itemTab} key={itemInfo?.id}>
        {itemInfo.mediaState == MediaState.Image && (
          <img className={styles.imgThumbnail} src={itemInfo?.mediaUrl} alt="" />
        )}
        {itemInfo.mediaState == MediaState.Video && (
          <video autoPlay={true} muted={true} loop={true} className={styles.imgThumbnail} src={itemInfo?.mediaUrl} />
        )}
        <div className={styles.bgGradientWrap}>
          <div className={styles.bgGradient}></div>
        </div>
        <div className={styles.leftTop}>
          {itemInfo?.isPinFix && (
            <div className={styles.pin}>
              <img src={BoldPin.src} alt="" />
            </div>
          )}
          {!itemInfo?.isContentFree && (
            <div className={styles.pin}>
              <img src={BoldLock.src} alt="" />
            </div>
          )}
        </div>

        <div className={styles.info}>
          <div className={styles.likeWrap}>
            <img src={BoldLike.src} alt="" />
            <div className={styles.value}>{itemInfo?.likeCount}</div>
          </div>
          {isMine && (
            <div className={styles.likeWrap}>
              <img src={BoldDislike.src} alt="" />
              <div className={styles.value}>{itemInfo?.dislikeCount}</div>
            </div>
          )}
          <div className={styles.viewWrap}>
            <img src={BoldVideo.src} alt="" />
            <div className={styles.value}>{itemInfo?.mediaCount}</div>
          </div>
        </div>
        <div className={styles.titleWrap}>
          <div className={styles.left}>
            <div className={styles.title}>{itemInfo?.name}</div>
          </div>
          <div
            className={styles.right}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();

              const isSingle = itemInfo?.contentType == ContentType.Single;

              const dataContextMenu = {
                id: itemInfo.id,
                index: index,
                urlLinkKey: itemInfo.urlLinkKey,
                isPin: itemInfo?.isPinFix || false,
                isSettingOpen: true,
                isSingle: isSingle,
                shareUrl: window.location.origin + urlLinkThumbnail,
                shareName: itemInfo?.name,
                contentType: itemInfo?.contentType,
              };
              if (onOpenContentMenu) onOpenContentMenu(dataContextMenu);
            }}
          >
            <img src={BoldMenuDots.src} alt="" className={styles.iconSetting} />
          </div>
        </div>
      </li>
    </Link>
  );
};

export type CharacterComponentType = {
  isMine: boolean;
  index: number;
  urlLinkThumbnail: string;
  itemInfo: ProfileTabItemInfo;
  onOpenContentMenu?: (data: TabContentMenuType) => void;
};

export const CharacterComponent = ({
  isMine,
  index,
  urlLinkThumbnail,
  itemInfo,
  onOpenContentMenu,
}: CharacterComponentType) => {
  const isPD = itemInfo.characterIP == CharacterIP.None;
  const isOriginal = itemInfo.characterIP == CharacterIP.Original;
  const characterIPStr = isOriginal ? 'Original' : 'Fan';
  return (
    <Link href={urlLinkThumbnail}>
      <li className={styles.itemTab} key={itemInfo?.id}>
        {itemInfo.mediaState == MediaState.Image && (
          <img className={styles.imgThumbnail} src={itemInfo?.mediaUrl} alt="" />
        )}
        {itemInfo.mediaState == MediaState.Video && (
          <video autoPlay={true} muted={true} loop={true} className={styles.imgThumbnail} src={itemInfo?.mediaUrl} />
        )}
        <div className={styles.bgGradientWrap}>
          <div className={styles.bgGradient}></div>
        </div>
        {itemInfo?.isPinFix && (
          <div className={styles.pin}>
            <img src={BoldPin.src} alt="" />
          </div>
        )}
        <div className={styles.info}>
          <div className={styles.likeWrap}>
            <img src={BoldLike.src} alt="" />
            <div className={styles.value}>{itemInfo?.likeCount}</div>
          </div>
          {isMine && (
            <div className={styles.likeWrap}>
              <img src={BoldDislike.src} alt="" />
              <div className={styles.value}>{itemInfo?.dislikeCount}</div>
            </div>
          )}
          <div className={styles.viewWrap}>
            <img src={BoldVideo.src} alt="" />
            <div className={styles.value}>{itemInfo?.mediaCount}</div>
          </div>
        </div>
        <div className={styles.titleWrap}>
          <div className={styles.left}>
            <div className={styles.name}>{itemInfo?.name}</div>
            {!isPD && (
              <span className={cx(styles.grade, isOriginal ? styles.original : styles.fan)}>{characterIPStr}</span>
            )}
          </div>
          <div
            className={styles.right}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();

              const dataContextMenu = {
                id: itemInfo.id,
                index: index,
                isPin: itemInfo?.isPinFix || false,
                isSettingOpen: true,
                shareUrl: window.location.origin + urlLinkThumbnail,
                shareName: itemInfo?.name,
              };
              if (onOpenContentMenu) onOpenContentMenu(dataContextMenu);
            }}
          >
            <img src={BoldMenuDots.src} alt="" className={styles.iconSetting} />
          </div>
        </div>
      </li>
    </Link>
  );
};

export type FeedComponentType = {
  isMine: boolean;
  index: number;
  urlLinkThumbnail: string;
  feedInfo: FeedInfo;
  onOpenContentMenu?: (data: TabContentMenuType) => void;
};

export const FeedComponent = ({isMine, index, urlLinkThumbnail, feedInfo, onOpenContentMenu}: FeedComponentType) => {
  return (
    <Link href={urlLinkThumbnail}>
      <li className={styles.itemTab} key={feedInfo?.id}>
        {feedInfo.mediaState == MediaState.Image && (
          <img className={styles.imgThumbnail} src={feedInfo?.mediaUrlList?.[0]} alt="" />
        )}
        {feedInfo.mediaState == MediaState.Video && (
          <video
            autoPlay={true}
            muted={true}
            loop={true}
            className={styles.imgThumbnail}
            src={feedInfo?.mediaUrlList?.[0]}
          />
        )}
        <div className={styles.bgGradientWrap}>
          <div className={styles.bgGradient}></div>
        </div>
        {feedInfo?.isPinFix && (
          <div className={styles.pin}>
            <img src={BoldPin.src} alt="" />
          </div>
        )}
        <div className={styles.info}>
          <div className={styles.likeWrap}>
            <img src={BoldLike.src} alt="" />
            <div className={styles.value}>{feedInfo?.likeCount}</div>
          </div>
          {isMine && (
            <div className={styles.likeWrap}>
              <img src={BoldDislike.src} alt="" />
              <div className={styles.value}>{feedInfo?.disLikeCount}</div>
            </div>
          )}
          <div className={styles.viewWrap}>
            <img src={BoldVideo.src} alt="" />
            <div className={styles.value}>{feedInfo?.mediaUrlList?.length}</div>
          </div>
        </div>
        <div className={styles.titleWrap}>
          <div className={styles.left}>
            <div className={styles.name}>{feedInfo?.title}</div>
            <div className={(!!feedInfo?.title || '') && styles.name}>{feedInfo?.description}</div>
          </div>
          <div
            className={styles.right}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              const dataContextMenu = {
                id: feedInfo.id,
                index: index,
                urlLinkKey: feedInfo.urlLinkKey,
                isPin: feedInfo?.isPinFix || false,
                isSettingOpen: true,
                shareUrl: window.location.origin + urlLinkThumbnail,
                shareName: feedInfo?.title,
              };
              if (onOpenContentMenu) onOpenContentMenu(dataContextMenu);
            }}
          >
            <img src={BoldMenuDots.src} alt="" className={styles.iconSetting} />
          </div>
        </div>
      </li>
    </Link>
  );
};
