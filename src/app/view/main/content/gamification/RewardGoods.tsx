import React from 'react';
import styles from './RewardGoods.module.css';
import {BoldCoin, BoldRuby, BoldStar, OrangeCoin} from '@ui/Icons';

const RewardGoods: React.FC = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.resourceContainer}>
          {/* 루비 */}
          <div className={styles.resource}>
            <img src={BoldRuby.src} alt="Ruby" className={`${styles.icon} ${styles.ruby}`} />
            <span className={styles.value}>10.5K</span>
          </div>

          {/* 구분선 */}
          <div className={styles.divider} />

          {/* 별 */}
          <div className={styles.resource}>
            <img src={BoldStar.src} alt="Star" className={`${styles.icon} ${styles.star}`} />
            <span className={styles.value}>10.5K</span>
          </div>

          {/* 구분선 */}
          <div className={styles.divider} />

          {/* 코인 */}
          <div className={styles.resource}>
            <img src={OrangeCoin.src} alt="Coin" className={`${styles.icon} ${styles.coin}`} />
            <span className={styles.value}>10.5K</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default RewardGoods;
