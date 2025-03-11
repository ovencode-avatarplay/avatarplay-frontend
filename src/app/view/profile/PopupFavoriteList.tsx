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
  InteractionType,
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
  eTabPDOtherType,
  eTabPDType,
  FeedComponent,
  FilterClusterType,
  SelectBox,
  TabContentComponentWrap,
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

type Props = {
  onClose: () => void;
  profileId: number;
  profileType: ProfileType;
  isMine: boolean;
};

const PopupFavoriteList = ({profileId, profileType, isMine = true, onClose}: Props) => {
  const [data, setData] = useState<{
    indexTab:
      | eTabPDType
      | eTabCharacterType
      | eTabPDOtherType
      | eTabCharacterOtherType
      | eTabChannelType
      | eTabChannelOtherType;
    indexFilterMedia: FeedMediaType;
    indexFilterCharacter: number;
    indexSort: ExploreSortType;
    profileTabInfo: {
      [key: number]: ProfileTabItemInfo[];
    };
  }>({
    indexTab: 0,
    indexFilterMedia: FeedMediaType.Total,
    indexFilterCharacter: 0,
    indexSort: ExploreSortType.MostPopular,
    profileTabInfo: {},
  });

  useEffect(() => {
    refreshAll();
  }, []);

  const refreshAll = async () => {
    await refreshList();
  };

  const refreshList = async () => {
    const resBookmarkList = await getBookmarkList({
      interactionType: Number(data.indexTab),
      languageType: getCurrentLanguage(),
    });
    data.profileTabInfo[InteractionType.Feed] = resBookmarkList?.data?.bookMarkInfoList || [];

    // console.log(bookmarkList?.data.);
  };

  const refreshProfileTab = async (profileId: number, indexTab: number, isRefreshAll?: boolean) => {};

  const isEmptyTab = false;
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
                  filterCluster={data}
                  onChange={async (filterCluster: FilterClusterType) => {
                    if ((filterCluster?.indexFilterMedia ?? -1) >= 0) {
                      data.indexFilterMedia = filterCluster?.indexFilterMedia ?? -1;
                      await refreshProfileTab(profileId, data.indexTab);
                      setData(v => ({...data}));
                    }
                    if ((filterCluster?.indexFilterCharacter ?? -1) >= 0) {
                      data.indexFilterCharacter = filterCluster?.indexFilterCharacter ?? -1;
                      await refreshProfileTab(profileId, data.indexTab);
                      setData(v => ({...data}));
                    }

                    if ((filterCluster?.indexSort ?? -1) >= 0) {
                      data.indexSort = filterCluster?.indexSort ?? -1;
                      await refreshProfileTab(profileId, data.indexTab);
                      setData(v => ({...data}));
                    }
                  }}
                />
              </div>

              <div className={styles.tabContent}>{/* <TabContentComponent  /> */}</div>
            </section>
            <button className={styles.btnSubscription}>Subscribe Now</button>
          </main>
          <footer>
            <BottomNav />
          </footer>
        </div>
      </Dialog>
    </>
  );
};

export default PopupFavoriteList;

type TabContentMenuType = {
  isSettingOpen: boolean;
  isPin: boolean;
  id: number | string;
};

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
              <CharacterComponent
                isMine={isMine}
                itemInfo={one}
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
              urlLinkThumbnail={getLocalizedLink(`/profile/` + one?.id + '?from=""')}
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
