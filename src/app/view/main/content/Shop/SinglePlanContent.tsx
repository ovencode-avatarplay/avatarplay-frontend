import React from 'react';
import styles from './SinglePlanContent.module.css';
import {BoldRuby, BoldStar} from '@ui/Icons';

interface SinglePlanContentProps {
  onBuy: (itemId: number, amount: number) => void;

  rubyItems: {amount: number; bonus: number; price: number}[];
  starItems: {amount: number; bonus: number; price: number}[];
}

const SinglePlanContent: React.FC<SinglePlanContentProps> = ({onBuy, rubyItems, starItems}) => {
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
      {/* Ruby Section */}
      <div className={styles.section}>
        <div className={styles.header}>
          <img src={BoldRuby.src} alt="Ruby" className={`${styles.icon} ${styles.ruby}`} />
          <h3 className={styles.title}>Ruby</h3>
        </div>
        <div className={styles.grid}>
          {rubyItems.map((item, index) => (
            <div key={index} className={styles.card}>
              <h4 className={styles.amount}>{item.amount}</h4>
              <div className={styles.itemInfo}>
                <img src={BoldRuby.src} alt="Ruby" className={`${styles.icon} ${styles.ruby}`} />
                <span className={styles.bonus}>+{item.bonus}</span>
              </div>
              <button className={styles.redPriceButton} onClick={() => onBuy(index, item.price)}>
                <div>${item.price}</div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Star Section */}
      <div className={styles.section}>
        <div className={styles.header}>
          <img src={BoldStar.src} alt="Star" className={`${styles.icon} ${styles.star}`} />
          <h3 className={styles.title}>Star</h3>
        </div>
        <div className={styles.grid}>
          {starItems.map((item, index) => (
            <div key={index} className={styles.card}>
              <h4 className={styles.amount}>{item.amount}</h4>
              <div className={styles.itemInfo}>
                <img src={BoldStar.src} alt="Star" className={`${styles.icon} ${styles.star}`} />
                <span className={styles.bonus}>+{item.bonus}</span>
              </div>
              <button className={styles.yellowPriceButton}>
                <div>${item.price}</div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SinglePlanContent;
