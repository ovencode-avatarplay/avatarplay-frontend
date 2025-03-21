import {Dialog} from '@mui/material';
import React, {useEffect, useState} from 'react';
import styles from './PopupFavoriteList.module.scss';
import {BoldAltArrowDown, BoldArrowLeft, BoldMenuDots, LineCheck} from '@ui/Icons';
import cx from 'classnames';
import {
  cancelSubscribe,
  ExploreSortType,
  FeedMediaType,
  getBookmarkList,
  GetCharacterTabInfoeRes,
  GetPdInfoRes,
  GetPdTabInfoeRes,
  getSubscriptionList,
  GetSubscriptionListRes,
  MembershipSubscribe,
  ProfileTabItemInfo,
  ProfileType,
} from '@/app/NetWork/ProfileNetwork';
import {
  ChannelComponent,
  CharacterComponent,
  ContentComponent,
  eTabChannelOtherType,
  eTabChannelType,
  eTabCharacterOtherType,
  eTabCharacterType,
  eTabFavoritesType,
  eTabPDOtherType,
  eTabPDType,
  FeedComponent,
  FilterClusterType,
  SelectBox,
  TabContentComponentWrap,
  TabContentMenuType,
  TabFilterComponent,
  TabHeaderComponent,
  TabHeaderWrapFavoritesComponent,
  TabHeaderWrapComponent,
} from './ProfileBase';
import PopupSubscription, {getUnit} from '../main/content/create/common/PopupSubscription';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import BottomNav from '../main/bottom-nav/BottomNav';
import {GetCharacterInfoRes} from '@/app/NetWork/CharacterNetwork';
import {GetChannelRes} from '@/app/NetWork/ChannelNetwork';
import {getCurrentLanguage, getLocalizedLink} from '@/utils/UrlMove';
import {useInView} from 'react-intersection-observer';
import {bookmark, InteractionType, pinFix, PinFixReq, PinTabType, RecordType} from '@/app/NetWork/CommonNetwork';
import SharePopup from '@/components/layout/shared/SharePopup';
import getLocalizedText from '@/utils/getLocalizedText';

type Props = {
  onClose: () => void;
  profileId: number;
  profileType: ProfileType;
  isMine: boolean;
};

const PopupFavoriteList = ({profileId, profileType, isMine = true, onClose}: Props) => {
  const [data, setData] = useState<{
    indexTab: eTabFavoritesType;
    indexFilterMedia: FeedMediaType;
    indexFilterCharacter: number;
    indexSort: ExploreSortType;
    profileTabInfo: {
      [key: number]: ProfileTabItemInfo[];
    };
    filterCluster: FilterClusterType;
    tabContentMenu: TabContentMenuType;

    isShareOpened: boolean;
  }>({
    indexTab: eTabFavoritesType.Feed,
    indexFilterMedia: FeedMediaType.Total,
    indexFilterCharacter: 0,
    indexSort: ExploreSortType.Newest,
    profileTabInfo: {},
    filterCluster: {
      indexFilterChannel: 0,
      indexFilterCharacter: 0,
      indexFilterContent: 0,
      indexFilterMedia: 0,
      indexFilterShared: 0,
      indexSort: 0,
    },
    tabContentMenu: {
      id: 0,
      isPin: false,
      isSettingOpen: false,
    },

    isShareOpened: false,
  });

  const refreshAll = async (isRefreshAll: boolean = false) => {
    await refreshList(isRefreshAll);
  };

  const refreshList = async (isRefreshAll: boolean = false) => {
    if (isRefreshAll) {
      data.profileTabInfo[data.indexTab] = [];
    }

    const resBookmarkList = await getBookmarkList({
      interactionType: Number(data.indexTab),
      languageType: getCurrentLanguage(),
      channelTabType: data?.filterCluster?.indexFilterChannel || 0,
      characterTabType: data?.filterCluster?.indexFilterCharacter || 0,
      contentTabType: data?.filterCluster?.indexFilterContent || 0,
      feedMediaType: data?.filterCluster?.indexFilterMedia || 0,
      sortType: data?.filterCluster?.indexSort || 0,
      page: {
        offset: data.profileTabInfo?.[data.indexTab]?.length || 0,
        limit: 30,
      },
    });

    if (!data.profileTabInfo[data.indexTab]) {
      data.profileTabInfo[data.indexTab] = [];
    }
    data.profileTabInfo[data.indexTab].push(...(resBookmarkList?.data?.bookMarkInfoList || []));
    sortData();
    setData({...data});
  };

  const refreshProfileTab = async (profileId: number, indexTab: number, isRefreshAll?: boolean) => {
    refreshList(isRefreshAll);
  };

  const isEmptyTab = false;

  const onRefreshTab = (isRefreshAll: boolean) => {
    refreshAll(isRefreshAll);
  };

  const onOpenContentMenu = (dataContentMenu: TabContentMenuType) => {
    console.log('dataContentMenu : ', dataContentMenu);
    data.tabContentMenu = dataContentMenu;
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

  const sortData = () => {
    data.profileTabInfo?.[data.indexTab].sort((a, b) => {
      if (a.isPinFix === b.isPinFix) {
        if (data.indexSort == ExploreSortType.Newest) {
          return new Date(b.createAt).getTime() - new Date(a.createAt).getTime();
        } else if (data.indexSort == ExploreSortType.Name) {
          return a.name.localeCompare(b.name);
        } else if (data.indexSort == ExploreSortType.Popular) {
          return b.likeCount - a.likeCount;
        } else {
          return b.id - a.id;
        }
      }
      return Number(b.isPinFix) - Number(a.isPinFix); // true가 먼저 오도록 정렬
    });
    setData({...data});
  };

  return (
    <>
      <Dialog open={true} onClose={onClose} fullScreen>
        <div className={styles.popup}>
          <header className={styles.header}>
            <img
              src={BoldArrowLeft.src}
              alt=""
              className={styles.iconBack}
              onClick={() => {
                onClose();
              }}
            />
            <h1 className={styles.title}>Favorites</h1>
          </header>
          <main className={styles.main}>
            <section className={styles.tabSection}>
              <div className={styles.tabHeaderContainer}>
                <TabHeaderWrapFavoritesComponent
                  indexTab={data.indexTab}
                  isMine
                  profileId={profileId}
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
                      await refreshProfileTab(profileId, data.indexTab, true);
                      setData(v => ({...data}));
                    }
                    if ((filterCluster?.indexFilterCharacter ?? -1) >= 0) {
                      data.filterCluster.indexFilterCharacter = filterCluster?.indexFilterCharacter ?? -1;
                      await refreshProfileTab(profileId, data.indexTab, true);
                      setData(v => ({...data}));
                    }

                    if ((filterCluster?.indexSort ?? -1) >= 0) {
                      data.filterCluster.indexSort = filterCluster?.indexSort ?? -1;
                      await refreshProfileTab(profileId, data.indexTab, true);
                      setData(v => ({...data}));
                    }

                    if ((filterCluster?.indexFilterChannel ?? -1) >= 0) {
                      data.filterCluster.indexFilterChannel = filterCluster?.indexFilterChannel ?? -1;
                      await refreshProfileTab(profileId, data.indexTab, true);
                      setData(v => ({...data}));
                    }

                    if ((filterCluster?.indexFilterShared ?? -1) >= 0) {
                      data.filterCluster.indexFilterShared = filterCluster?.indexFilterShared ?? -1;
                      await refreshProfileTab(profileId, data.indexTab, true);
                      setData(v => ({...data}));
                    }
                    if ((filterCluster?.indexFilterContent ?? -1) >= 0) {
                      data.filterCluster.indexFilterContent = filterCluster?.indexFilterContent ?? -1;
                      await refreshProfileTab(profileId, data.indexTab, true);
                      setData(v => ({...data}));
                    }
                  }}
                />
              </div>

              <div className={styles.tabContent}>
                <TabContentComponent
                  filterCluster={data.filterCluster}
                  profileType={profileType}
                  isMine={true}
                  isEmptyTab={data.profileTabInfo?.[data.indexTab]?.length == 0}
                  profileId={profileId}
                  tabIndex={data?.indexTab || 0}
                  profileTabInfo={data.profileTabInfo}
                  onRefreshTab={isRefreshAll => {
                    onRefreshTab(isRefreshAll);
                  }}
                  onOpenContentMenu={onOpenContentMenu}
                />
              </div>
            </section>
            <button className={styles.btnSubscription}>Subscribe Now</button>
          </main>
          <footer>
            <BottomNav />
          </footer>
        </div>
      </Dialog>
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
        onUnFavorite={async () => {
          let interactionType = Number(data.indexTab);
          if (data.indexTab == eTabFavoritesType.Contents) {
            interactionType = data.tabContentMenu.isSingle ? InteractionType.Episode : InteractionType.Contents;
          }
          const resBookmark = await bookmark({
            interactionType: interactionType,
            isBookMark: false,
            typeValueId: data.tabContentMenu.id,
          });
          console.log('resBookmark : ', resBookmark);

          const indexRemove = data?.tabContentMenu?.index || 0;
          data.profileTabInfo?.[data.indexTab].splice(indexRemove, 1);
          setData({...data});
          // onRefreshTab(true);
        }}
        onShare={async () => {
          const url = data.tabContentMenu.shareUrl;
          const name = data.tabContentMenu.shareTitle;
          handleShare(url, name);
        }}
        onReport={async () => {
          alert('신고 추가 예정');
        }}
        onPin={async (isPin: boolean, id: number, index: number) => {
          let pinTabType: PinTabType = PinTabType.None;

          if (data.indexTab == eTabFavoritesType.Feed) {
            pinTabType = PinTabType.FavoritesFeed;
          } else if (data.indexTab == eTabFavoritesType.Character) {
            pinTabType = PinTabType.FavoritesCharacter;
          } else if (data.indexTab == eTabFavoritesType.Contents) {
            pinTabType = PinTabType.FavoritesContents;
          } else if (data.indexTab == eTabFavoritesType.Channel) {
            pinTabType = PinTabType.FavoritesChannel;
          } else if (data.indexTab == eTabFavoritesType.Game) {
            pinTabType = PinTabType.FavoritesGame;
          }

          const dataUpdatePin: PinFixReq = {
            type: pinTabType,
            typeValueId: id,
            isFix: isPin,
          };
          await pinFix(dataUpdatePin);

          const itemPined = data.profileTabInfo?.[data.indexTab][index];
          itemPined.isPinFix = isPin;

          sortData();
          // onRefreshTab(true);
        }}
      />

      <SharePopup
        open={data.isShareOpened}
        title={data?.tabContentMenu?.shareTitle || '공유하기'}
        url={data?.tabContentMenu?.shareUrl || window.location.href}
        onClose={() => {
          setData(v => ({...v, isShareOpened: false}));
        }}
      ></SharePopup>
    </>
  );
};

export default PopupFavoriteList;

type TabContentProps = {
  profileId: number;
  profileType: ProfileType;
  isMine: boolean;
  tabIndex: number;
  isEmptyTab: boolean;
  profileTabInfo: {
    [key: number]: ProfileTabItemInfo[];
  };

  filterCluster: FilterClusterType;
  onRefreshTab: (isRefreshAll: boolean) => void;
  onOpenContentMenu?: (data: TabContentMenuType) => void;
};

const TabContentComponent = ({
  isMine,
  tabIndex,
  isEmptyTab,
  profileTabInfo,
  filterCluster,
  onRefreshTab,
  onOpenContentMenu,
}: TabContentProps) => {
  const {ref: observerRef, inView} = useInView();
  // const {isPD, isCharacter, isMyPD, isMyCharacter, isOtherPD, isOtherCharacter, isChannel, isOtherChannel} =
  //   getUserType(isMine, profileType);

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
          <div className={styles.text}>
            Its pretty lonely out here.
            <br />
            Make a Post
          </div>
        </div>
      </>
    );
  }
  if (tabIndex == eTabFavoritesType.Feed) {
    return (
      <>
        <ul className={styles.itemWrap}>
          {profileTabInfo?.[tabIndex]?.map((one, index: number) => {
            return (
              <FeedComponent
                isMine={isMine}
                index={index}
                feedInfo={{
                  commentCount: 0,
                  description: one.description,
                  disLikeCount: 0,
                  hashTag: '',
                  isBookmark: false,
                  isDisLike: false,
                  isFollowing: false,
                  isLike: false,
                  mediaUrlList: [one.mediaUrl].concat(Array(length).fill(one.mediaCount - 1)),
                  profileIconUrl: '',
                  profileId: 0,
                  profileName: '',
                  profileUrlLinkKey: '',
                  title: one?.name || ' ',
                  id: one.id,
                  isPinFix: one.isPinFix,
                  likeCount: one.likeCount,
                  mediaState: one.mediaState,
                  playTime: '',
                  urlLinkKey: one.urlLinkKey,
                  isMyFeed: false,
                }}
                onOpenContentMenu={onOpenContentMenu}
                urlLinkThumbnail={getLocalizedLink(`/main/homefeed/` + one.urlLinkKey)}
              />
            );
          })}
          <div ref={observerRef}></div>
        </ul>
      </>
    );
  }
  if (tabIndex == eTabFavoritesType.Character) {
    return (
      <ul className={styles.itemWrap}>
        {profileTabInfo?.[tabIndex]?.map((one, index: number) => {
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
  if (tabIndex == eTabFavoritesType.Contents) {
    return (
      <ul className={styles.itemWrap}>
        {profileTabInfo?.[tabIndex]?.map((one, index: number) => {
          return (
            <ContentComponent
              isMine={isMine}
              index={index}
              itemInfo={one}
              urlLinkThumbnail={getLocalizedLink(`/content/series/` + one?.urlLinkKey + '?from=""')}
              onOpenContentMenu={onOpenContentMenu}
            />
          );
        })}
        <div ref={observerRef}></div>
      </ul>
    );
  }
  if (tabIndex == eTabFavoritesType.Channel) {
    return (
      <ul className={styles.itemWrap}>
        {profileTabInfo?.[tabIndex]?.map((one, index: number) => {
          return (
            <ChannelComponent
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
};

type ContentSettingType = {
  isMine: boolean;
  onClose: () => void;
  tabContentMenu: TabContentMenuType;
  refreshTabAll: () => void;
  onReport: () => void;
  onShare: () => void;
  onUnFavorite: () => void;
  onPin: (isPin: boolean, id: number, index: number) => void;
};
const ContentSetting = ({
  isMine = false,
  onClose = () => {},
  tabContentMenu = {id: 0, isPin: false, isSettingOpen: false},
  refreshTabAll = () => {},
  onReport = () => {},
  onUnFavorite = () => {},
  onShare = () => {},
  onPin = (isPin: boolean, id: number, index: number) => {},
}: ContentSettingType) => {
  // const {isCharacter, isMyCharacter, isMyPD, isOtherCharacter, isOtherPD, isPD} = getUserType(isMine, profileType);
  let uploadImageItems: SelectDrawerItem[] = [
    {
      name: getLocalizedText('common_dropdown_unfavorites'),
      onClick: () => {
        onUnFavorite();
      },
    },
    {
      name: tabContentMenu.isPin ? getLocalizedText('common_dropdown_unpin') : getLocalizedText('common_dropdown_pin'),
      onClick: async () => {
        const isPin = !tabContentMenu.isPin;
        onPin(isPin, tabContentMenu.id, tabContentMenu?.index || 0);
      },
    },
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
  return (
    <SelectDrawer isOpen={tabContentMenu.isSettingOpen} onClose={onClose} items={uploadImageItems} selectedIndex={-1} />
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
