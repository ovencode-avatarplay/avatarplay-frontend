import React from 'react';
import styles from './SubscriptionPlan.module.css';
import {BoldRuby, BoldStar} from '@ui/Icons';
import CustomButton from '@/components/layout/shared/CustomButton';

const rubyItems = new Array(6).fill({amount: 5, bonus: 5, price: 3, icon: BoldRuby});
const starItems = new Array(6).fill({amount: 5, bonus: 5, price: 3, icon: BoldStar});

const SubscriptionPlan: React.FC = () => {
  // 내부 데이터 정의 (Props 없이 직접 사용)
  const planData = {
    title: 'Plan 1',
    price: 5,
    ruby: 86,
    bonus: 60,
    increaseRate: 70,
  };

  return (
    <div className={styles.shopContainer}>
      {/* Plan Card */}
      <div className={styles.planGroup}>
        <div className={styles.planCard}>
          <div className={styles.title}>{planData.title}</div>
          <div className={styles.price}>
            <span className={styles.dollar}>${planData.price}</span>
            <span className={styles.perMonth}>per month</span>
          </div>
          <div className={styles.details}>
            <div className={styles.detailItem}>루비 {planData.ruby}개</div>
            <div className={styles.detailItem}>보너스 {planData.bonus}개</div>
            <div className={styles.detailItem}>{planData.increaseRate}% UP</div>
          </div>
        </div>
        <div className={styles.planCard}>
          <div className={styles.title}>{planData.title}</div>
          <div className={styles.price}>
            <span className={styles.dollar}>${planData.price}</span>
            <span className={styles.perMonth}>per month</span>
          </div>
          <div className={styles.details}>
            <div className={styles.detailItem}>루비 {planData.ruby}개</div>
            <div className={styles.detailItem}>보너스 {planData.bonus}개</div>
            <div className={styles.detailItem}>{planData.increaseRate}% UP</div>
          </div>
        </div>
        <div className={styles.planCard}>
          <div className={styles.title}>{planData.title}</div>
          <div className={styles.price}>
            <span className={styles.dollar}>${planData.price}</span>
            <span className={styles.perMonth}>per month</span>
          </div>
          <div className={styles.details}>
            <div className={styles.detailItem}>루비 {planData.ruby}개</div>
            <div className={styles.detailItem}>보너스 {planData.bonus}개</div>
            <div className={styles.detailItem}>{planData.increaseRate}% UP</div>
          </div>
        </div>
      </div>
      <CustomButton
        size="Small"
        type="Primary"
        state="Normal"
        customClassName={[styles.addButton]}
        style={{width: '375px', position: 'absolute', bottom: 'calc(48px + 30px)'}}
      >
        Create
      </CustomButton>
    </div>
  );
};

export default SubscriptionPlan;
