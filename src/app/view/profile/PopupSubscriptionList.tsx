import {Dialog} from '@mui/material';
import React, {useEffect, useState} from 'react';
import styles from './PopupSubscriptionList.module.scss';
import {BoldAltArrowDown, BoldArrowLeft, BoldMenuDots, LineCheck} from '@ui/Icons';
import cx from 'classnames';
import {
  cancelSubscribe,
  getSubscriptionList,
  GetSubscriptionListRes,
  MembershipSubscribe,
} from '@/app/NetWork/ProfileNetwork';
import {SelectBox} from './ProfileBase';
import PopupSubscription, {getUnit} from '../main/content/create/common/PopupSubscription';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import BottomNav from '../main/bottom-nav/BottomNav';
import Link from 'next/link';
import {getLocalizedLink} from '@/utils/UrlMove';

type Props = {
  onClose: () => void;
};

const PopupSubscriptionList = ({onClose}: Props) => {
  const [data, setData] = useState<{
    indexTab: number;
    indexSort: number;
    subscriptionList: MembershipSubscribe[];
    subscriptionInactiveList: MembershipSubscribe[];

    dataSubScriptionSetting: {
      id: number;
      isOpen: boolean;
    };
    dataRenewal: {
      id: number;
      isOpen: boolean;
    };
  }>({
    indexTab: 0,
    indexSort: 0,
    subscriptionList: [],
    subscriptionInactiveList: [],
    dataSubScriptionSetting: {
      id: 0,
      isOpen: false,
    },
    dataRenewal: {
      id: 0,
      isOpen: false,
    },
  });

  useEffect(() => {
    refreshAll();
  }, []);

  const refreshAll = async () => {
    await refreshList(true);
    await refreshList(false);
  };

  const refreshList = async (isValidSubscription: boolean = true) => {
    const resSubscriptionList = await getSubscriptionList({isValidSubscription});
    console.log('resSubScriptionList : ', resSubscriptionList);
    if (isValidSubscription) {
      data.subscriptionList = resSubscriptionList?.data?.subscriptionList || [];
    } else {
      data.subscriptionInactiveList = resSubscriptionList?.data?.subscriptionList || [];
    }
    setData({...data});
  };

  const sortOptionList = [
    {id: 0, value: 'All'},
    {id: 1, value: 'Character'},
    {id: 2, value: 'Channel'},
  ];

  const SelectBoxArrowComponent = (isOpen?: boolean) => (
    <img
      className={styles.icon}
      src={BoldAltArrowDown.src}
      alt="altArrowDown"
      style={{transform: `rotate(${isOpen ? 180 : 0}deg)`}}
    />
  );

  const SelectBoxValueComponent = (data: any, isOpen?: boolean) => {
    return (
      <div key={data.id} className={styles.label}>
        {data.value}
      </div>
    );
  };
  const SelectBoxOptionComponent = (data: any, isSelected: boolean) => (
    <>
      <div className={styles.optionWrap}>
        <div key={data.id} className={styles.label}>
          {data.value}
        </div>
        {isSelected && <img className={styles.iconCheck} src={LineCheck.src} alt="altArrowDown" />}
      </div>
    </>
  );

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
            <h1 className={styles.title}>Subscription</h1>
          </header>
          <main className={styles.main}>
            <div className={styles.tabHeaderWrap}>
              <div className={styles.line}></div>
              <div
                className={styles.tabHeader}
                onClick={async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                  const target = e.target as HTMLElement;
                  const category = target.closest('[data-tab]')?.getAttribute('data-tab');
                  if (category == '1') {
                    alert('추후 제공');
                    return;
                  }
                  if (category) {
                    data.indexTab = parseInt(category);
                  }
                  setData({...data});
                }}
              >
                <div className={cx(styles.tab, data.indexTab == 0 && styles.active)} data-tab={0}>
                  Contents
                </div>
                <div className={cx(styles.tab, data.indexTab == 1 && styles.active)} data-tab={1}>
                  IP
                </div>
              </div>
            </div>
            <section className={styles.filtersection}>
              <SelectBox
                value={sortOptionList[data.indexSort]}
                options={sortOptionList}
                ArrowComponent={SelectBoxArrowComponent}
                ValueComponent={SelectBoxValueComponent}
                OptionComponent={SelectBoxOptionComponent}
                onChange={async id => {
                  data.indexSort = id;
                  setData({...data});
                }}
                customStyles={{
                  control: {
                    width: '132px',
                    display: 'flex',
                    gap: '10px',
                    minHeight: '52px',
                  },
                  menuList: {
                    borderRadius: '10px',
                    // borderbottomLeftRadius: '10px',
                    // borderbottomRightRadius: '10px',
                    boxShadow: '0px 0px 30px 0 rgba(0, 0, 0, 0.10)',
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
            </section>
            <section className={styles.contentSection}>
              <ul className={styles.subscriptionList}>
                {data.subscriptionList.map((one, index) => {
                  const unit = getUnit(one?.paymentType);
                  const amount = one?.paymentAmount;
                  const expireAt = formatDate(one?.expireAt);
                  const isFree = amount == 0;
                  const priceStr = isFree ? 'free' : `${unit}${amount} Monthly Price`;

                  function formatDate(dateString: string) {
                    const date = new Date(dateString);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 필요
                    const day = String(date.getDate()).padStart(2, '0');

                    return `${year}.${month}.${day}`;
                  }

                  return (
                    <li className={styles.item}>
                      <div className={styles.left}>
                        <Link href={getLocalizedLink(`/profile/` + one.profileUrlLink + '?from=""')}>
                          <img src={one.iconUrl} alt="" className={styles.thumbnail} />
                        </Link>
                        <div className={styles.infoWrap}>
                          <div className={styles.name}>{one.name}</div>
                          <div className={styles.price}>{priceStr} </div>
                          <div className={styles.dateExpired}>Next Billing Date {expireAt}</div>
                        </div>
                      </div>
                      <div className={styles.right}>
                        <img
                          src={BoldMenuDots.src}
                          alt=""
                          onClick={() => {
                            data.dataSubScriptionSetting.id = one?.id;
                            data.dataSubScriptionSetting.isOpen = true;
                            setData({...data});
                          }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>

              {data.subscriptionInactiveList.length > 0 && <div className={styles.label}>Inactive Subscription</div>}
              <ul className={styles.subscriptionList}>
                {data.subscriptionInactiveList.map((one, index) => {
                  const unit = getUnit(one?.paymentType);
                  const amount = one?.paymentAmount;
                  const expireAt = formatDate(one?.expireAt);
                  const isFree = amount == 0;
                  const priceStr = isFree ? 'free' : `${unit}${amount} Monthly Price`;

                  function formatDate(dateString: string) {
                    const date = new Date(dateString);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 필요
                    const day = String(date.getDate()).padStart(2, '0');

                    return `${year}.${month}.${day}`;
                  }
                  return (
                    <li className={styles.item}>
                      <div className={styles.left}>
                        <Link href={getLocalizedLink(`/profile/` + one.profileUrlLink + '?from=""')}>
                          <img src={one.iconUrl} alt="" className={styles.thumbnail} />
                        </Link>
                        <div className={styles.infoWrap}>
                          <div className={styles.name}>{one.name}</div>
                          <div className={styles.price}>{priceStr} </div>
                          <div className={styles.dateExpired}>Next Billing Date {expireAt}</div>
                        </div>
                      </div>
                      <div className={cx(styles.right, styles.renewalWrap)}>
                        <div
                          className={styles.renewal}
                          onClick={() => {
                            data.dataRenewal.isOpen = true;
                            data.dataRenewal.id = one.profileId;
                            setData({...data});
                          }}
                        >
                          Renewal
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
            <button className={styles.btnSubscription}>Subscribe Now</button>
          </main>
          <footer>
            <BottomNav />
          </footer>
        </div>
      </Dialog>
      <ContentSetting
        dataSubScriptionSetting={data.dataSubScriptionSetting}
        onClose={() => {
          data.dataSubScriptionSetting.isOpen = false;
          setData({...data});
        }}
        onCancel={async () => {
          const id = data.dataSubScriptionSetting.id;
          await cancelSubscribe({subscribeId: id});
          await refreshAll();
        }}
      />
      {data.dataRenewal.isOpen && (
        <PopupSubscription
          id={data.dataRenewal.id}
          onClose={async () => {
            data.dataRenewal.isOpen = false;
            setData({...data});
          }}
          onComplete={async () => {
            await refreshAll();
            data.dataRenewal.isOpen = false;
            setData({...data});
          }}
        />
      )}
    </>
  );
};

export default PopupSubscriptionList;

type SubscriptionSettingType = {
  dataSubScriptionSetting: {
    isOpen: boolean;
  };
  onClose: () => void;
  onCancel: () => void;
};
const ContentSetting = ({
  dataSubScriptionSetting: {isOpen},
  onClose = () => {},
  onCancel = () => {},
}: SubscriptionSettingType) => {
  let itemList: SelectDrawerItem[] = [
    {
      name: 'Subscription Cancel',
      onClick: () => {
        onCancel();
      },
    },
  ];

  return <SelectDrawer isOpen={isOpen} onClose={onClose} items={itemList} selectedIndex={-1} />;
};
