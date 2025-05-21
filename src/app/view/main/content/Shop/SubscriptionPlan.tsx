import React from 'react';
import styles from './SubscriptionPlan.module.css';
import CustomButton from '@/components/layout/shared/CustomButton';
import getLocalizedText from '@/utils/getLocalizedText';

interface SubscriptionPlanData {
  title: string;
  price: number;
  ruby: number;
  bonus: number;
  increaseRate: number;
}
interface SubscriptionPlanProps {
  planData: SubscriptionPlanData[];
}

const SubscriptionPlan: React.FC<SubscriptionPlanProps> = ({planData}) => {
  // 내부 데이터 정의 (Props 없이 직접 사용)

  return (
    <div className={styles.shopContainer}>
      {/* Plan Card */}
      <div className={styles.planGroup}>
        {planData.map(plan => (
          <div className={styles.planCard}>
            <div className={styles.title}>{plan.title}</div>
            <div className={styles.price}>
              <span className={styles.dollar}>${plan.price}</span>
              <span className={styles.perMonth}>per month</span>
            </div>
            <div className={styles.details}>
              <div className={styles.detailItem}>
                {getLocalizedText('TODO : Ruby')} {plan.ruby}개
              </div>
              <div className={styles.detailItem}>
                {getLocalizedText('TODO : Bonus')} {plan.bonus}개
              </div>
              <div className={styles.detailItem}>
                {getLocalizedText('TODO : Increase Rate')} {plan.increaseRate}% UP
              </div>
            </div>
          </div>
        ))}
      </div>
      <CustomButton
        size="Small"
        type="Primary"
        state="Normal"
        customClassName={[styles.addButton]}
        // style={{width: '375px', position: 'absolute', bottom: 'calc(48px + 30px)'}}
      >
        {getLocalizedText('Todo : Subscribe')}
      </CustomButton>
    </div>
  );
};

export default SubscriptionPlan;
