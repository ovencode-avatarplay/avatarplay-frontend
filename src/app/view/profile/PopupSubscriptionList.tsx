import {Dialog} from '@mui/material';
import React, {useEffect, useState} from 'react';
import styles from 'PopupSubscriptionList.module.scss';
import {BoldArrowLeft} from '@ui/Icons';
import cx from 'classnames';
import {getSubscriptionList} from '@/app/NetWork/ProfileNetwork';

type Props = {
  onClose: () => void;
};

const SubscriptionListPopup = ({onClose}: Props) => {
  const [data, setData] = useState({
    indexTab: 0,
  });

  useEffect(() => {
    refreshList();
  }, []);

  const refreshList = async () => {
    const resSubscriptionList = await getSubscriptionList({});
    console.log('resSubScriptionList : ', resSubscriptionList);
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
            <h1 className={styles.title}>Subscription</h1>
          </header>
          <main className={styles.main}>
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
                Charactder Contents
              </div>
              <div className={cx(styles.tab, data.indexTab == 1 && styles.active)} data-tab={1}>
                Character IP
              </div>
              <div className={styles.shop}>Shop</div>
            </div>

            <section className={styles.contentSection}>
              <div className={styles.title}>$00 / month</div>
              <div className={styles.description}>
                Text Here
                <br />
                Text Here
                <br />
                Text Here
                <br />
              </div>
            </section>
            <button className={styles.btnSubscription}>Subscribe Now</button>
          </main>
        </div>
      </Dialog>
    </>
  );
};

export default SubscriptionListPopup;
