import React, {useEffect, useRef, useState} from 'react';
import styles from './PopupSubscription.module.scss';
import {BoldArrowLeft} from '@ui/Icons';
import cx from 'classnames';
import {Dialog, Modal} from '@mui/material';
import {
  getPaymentAmountMenu,
  GetSubscribePaymentRes,
  getSubscriptionList,
  PaymentType,
  subscribeProfile,
  SubscriptionType,
} from '@/app/NetWork/ProfileNetwork';

type Props = {
  id: number;
  onClose: () => void;
  onComplete: () => void;
};

export const getUnit = (paymentType: PaymentType = PaymentType.USD) => {
  switch (paymentType) {
    case PaymentType.USD:
      return '$';
    case PaymentType.KRW:
      return '₩';
    case PaymentType.EUR:
      return '€';
    case PaymentType.JPY:
      return '¥';
    case PaymentType.GBP:
      return '£';
    default:
      return ''; // 기본값 설정 (예: 지원하지 않는 결제 타입일 경우)
  }
};

const PopupSubscription = ({id, onClose, onComplete}: Props) => {
  const [data, setData] = useState<{
    indexTab: number;
    subscriptionInfo: GetSubscribePaymentRes | null;
  }>({
    indexTab: 0,
    subscriptionInfo: {benefit: '', paymentAmount: 0, paymentType: PaymentType.USD},
  });
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    refreshInfo();
  }, []);

  const refreshInfo = async () => {
    const reqSubscriptionInfo = {
      type: SubscriptionType.Contents,
      paymentProfileId: id,
    };
    const resInfo = await getPaymentAmountMenu(reqSubscriptionInfo);
    console.log('resInfo : ', resInfo);
    data.subscriptionInfo = resInfo?.data || null;
  };

  const onSubscribe = async () => {
    await subscribeProfile({profileId: id});
    onComplete();
  };

  const unit = getUnit(data.subscriptionInfo?.paymentType);
  const amount = data.subscriptionInfo?.paymentAmount;
  const benefit = data.subscriptionInfo?.benefit;
  const isFree = amount == 0;
  const priceStr = isFree ? 'free' : `${unit}${amount} / month`;

  return (
    <Dialog open={true} onClose={onClose} fullScreen>
      <div ref={popupRef} className={styles.popup}>
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
            <div className={styles.title}>{priceStr}</div>
            {benefit != '' && <div className={styles.description}>{benefit}</div>}
          </section>
          <button className={styles.btnSubscription} onClick={onSubscribe}>
            Subscribe Now
          </button>
        </main>
      </div>
    </Dialog>
  );
};

export default PopupSubscription;
