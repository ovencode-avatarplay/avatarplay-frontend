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
  getRecordList,
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
  TabHeaderWrapAllComponent,
  TabHeaderWrapComponent,
} from './ProfileBase';
import PopupSubscription, {getUnit} from '../main/content/create/common/PopupSubscription';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import BottomNav from '../main/bottom-nav/BottomNav';
import {GetCharacterInfoRes} from '@/app/NetWork/CharacterNetwork';
import {GetChannelRes} from '@/app/NetWork/ChannelNetwork';
import {getCurrentLanguage, getLocalizedLink} from '@/utils/UrlMove';
import {useInView} from 'react-intersection-observer';
import {InteractionType} from '@/app/NetWork/CommonNetwork';
import {PinFixFeedReq, updatePin} from '@/app/NetWork/ShortsNetwork';

type Props = {
  onClose: () => void;
  profileId: number;
  profileType: ProfileType;
  isMine: boolean;
};

const PopupPlayList = ({profileId, profileType, isMine = true, onClose}: Props) => {
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
  }>({
    indexTab: eTabFavoritesType.Feed,
    indexFilterMedia: FeedMediaType.Total,
    indexFilterCharacter: 0,
    indexSort: ExploreSortType.MostPopular,
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
  });

  useEffect(() => {
    refreshAll();
  }, []);

  const refreshAll = async () => {
    await refreshList();
  };

  const refreshList = async () => {
    const resBookmarkList = await getRecordList({
      interactionType: Number(data.indexTab),
      languageType: getCurrentLanguage(),
    });
    data.profileTabInfo[data.indexTab] = resBookmarkList?.data?.recordInfoList || [];
    setData({...data});
  };

  const refreshProfileTab = async (profileId: number, indexTab: number, isRefreshAll?: boolean) => {
    refreshList();
  };

  const isEmptyTab = false;

  const onRefreshTab = (isRefreshAll: boolean) => {};

  const onOpenContentMenu = (dataContentMenu: TabContentMenuType) => {
    data.tabContentMenu = dataContentMenu;
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
            <h1 className={styles.title}>Record</h1>
          </header>
          <main className={styles.main}>
            <section className={styles.tabSection}>
              <div className={styles.tabHeaderContainer}>
                <TabHeaderWrapAllComponent
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
                      await refreshProfileTab(profileId, data.indexTab);
                      setData(v => ({...data}));
                    }
                    if ((filterCluster?.indexFilterCharacter ?? -1) >= 0) {
                      data.filterCluster.indexFilterCharacter = filterCluster?.indexFilterCharacter ?? -1;
                      await refreshProfileTab(profileId, data.indexTab);
                      setData(v => ({...data}));
                    }

                    if ((filterCluster?.indexSort ?? -1) >= 0) {
                      data.filterCluster.indexSort = filterCluster?.indexSort ?? -1;
                      await refreshProfileTab(profileId, data.indexTab);
                      setData(v => ({...data}));
                    }

                    if ((filterCluster?.indexFilterChannel ?? -1) >= 0) {
                      data.filterCluster.indexFilterChannel = filterCluster?.indexFilterChannel ?? -1;
                      await refreshProfileTab(profileId, data.indexTab);
                      setData(v => ({...data}));
                    }

                    if ((filterCluster?.indexFilterShared ?? -1) >= 0) {
                      data.filterCluster.indexFilterShared = filterCluster?.indexFilterShared ?? -1;
                      await refreshProfileTab(profileId, data.indexTab);
                      setData(v => ({...data}));
                    }
                    if ((filterCluster?.indexFilterContent ?? -1) >= 0) {
                      data.filterCluster.indexFilterContent = filterCluster?.indexFilterContent ?? -1;
                      await refreshProfileTab(profileId, data.indexTab);
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
                  onRefreshTab={onRefreshTab}
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
        onDelete={async () => {
          alert('삭제 추가 예정');

          onRefreshTab(true);
        }}
        onReport={async () => {
          alert('신고 추가 예정');
        }}
        onShare={async () => {
          alert('공유 추가 예정');
        }}
      />
    </>
  );
};

export default PopupPlayList;

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
    onRefreshTab(true);
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
  if (tabIndex == InteractionType.Feed) {
    return (
      <>
        <ul className={styles.itemWrap}>
          {profileTabInfo?.[tabIndex]?.map((one, index: number) => {
            return (
              <FeedComponent
                isMine={isMine}
                feedInfo={{
                  commentCount: 0,
                  description: 'description',
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
                  isPinFix: false,
                  likeCount: one.likeCount,
                  mediaState: one.mediaState,
                  playTime: '',
                  urlLinkKey: one.urlLinkKey,
                }}
                onOpenContentMenu={onOpenContentMenu}
                urlLinkThumbnail={getLocalizedLink(`/main/homefeed/`)}
              />
            );
          })}
          <div ref={observerRef}></div>
        </ul>
      </>
    );
  }
  if (tabIndex == InteractionType.Character) {
    return (
      <ul className={styles.itemWrap}>
        {profileTabInfo?.[tabIndex]?.map((one, index: number) => {
          return (
            <CharacterComponent
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
  if (tabIndex == InteractionType.Contents) {
    return (
      <ul className={styles.itemWrap}>
        {profileTabInfo?.[tabIndex]?.map((one, index: number) => {
          return (
            <ContentComponent
              isMine={isMine}
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
  if (tabIndex == InteractionType.Channel) {
    return (
      <ul className={styles.itemWrap}>
        {profileTabInfo?.[tabIndex]?.map((one, index: number) => {
          return (
            <ChannelComponent
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
};

type ContentSettingType = {
  isMine: boolean;
  onClose: () => void;
  tabContentMenu: TabContentMenuType;
  refreshTabAll: () => void;
  onReport: () => void;
  onShare: () => void;
  onDelete: () => void;
};
const ContentSetting = ({
  isMine = false,
  onClose = () => {},
  tabContentMenu = {id: 0, isPin: false, isSettingOpen: false},
  refreshTabAll = () => {},
  onReport = () => {},
  onShare = () => {},
  onDelete = () => {},
}: ContentSettingType) => {
  // const {isCharacter, isMyCharacter, isMyPD, isOtherCharacter, isOtherPD, isPD} = getUserType(isMine, profileType);
  let uploadImageItems: SelectDrawerItem[] = [
    {
      name: tabContentMenu.isFavorite ? 'Unfavorite' : 'Favorite',
      onClick: async () => {
        // onUnFavorite();
        alert('북마크 처리 예정');
      },
    },
    {
      name: tabContentMenu.isPin ? 'Unpin' : 'Pin to Top',
      onClick: async () => {
        const dataUpdatePin: PinFixFeedReq = {
          feedId: Number(tabContentMenu.id),
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
      name: 'Report',
      onClick: () => {
        onReport();
      },
    },
    {
      name: 'Delete',
      onClick: () => {
        onDelete();
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
