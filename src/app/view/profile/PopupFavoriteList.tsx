import {Dialog} from '@mui/material';
import React, {useEffect, useState} from 'react';
import styles from './PopupFavoriteList.module.scss';
import {BoldAltArrowDown, BoldArrowLeft, BoldMenuDots, LineCheck} from '@ui/Icons';
import cx from 'classnames';
import {
  cancelSubscribe,
  ExploreSortType,
  FeedMediaType,
  getSubscriptionList,
  GetSubscriptionListRes,
  MembershipSubscribe,
  ProfileType,
} from '@/app/NetWork/ProfileNetwork';
import {
  eTabChannelOtherType,
  eTabChannelType,
  eTabCharacterOtherType,
  eTabCharacterType,
  eTabPDOtherType,
  eTabPDType,
  FilterClusterType,
  SelectBox,
  TabFilterComponent,
  TabHeaderComponent,
  TabHeaderWrapAllComponent,
  TabHeaderWrapComponent,
} from './ProfileBase';
import PopupSubscription, {getUnit} from '../main/content/create/common/PopupSubscription';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import BottomNav from '../main/bottom-nav/BottomNav';

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
  }>({
    indexTab: 0,
    indexFilterMedia: FeedMediaType.Total,
    indexFilterCharacter: 0,
    indexSort: ExploreSortType.MostPopular,
  });

  useEffect(() => {
    refreshAll();
  }, []);

  const refreshAll = async () => {
    await refreshList();
  };

  const refreshList = async () => {};

  const refreshProfileTab = async (profileId: number, indexTab: number) => {};

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

              <div className={styles.tabContent}></div>
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
