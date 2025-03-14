import React, {useState} from 'react';
import styles from './RewardTabMenu.module.css';
import Link from 'next/link';
import {getLocalizedLink} from '@/utils/UrlMove';

interface RewardTabMenuProps {
  onTabChange?: (tab: 'Reward' | 'Event') => void;
}

const RewardTabMenu: React.FC<RewardTabMenuProps> = ({onTabChange}) => {
  const [activeTab, setActiveTab] = useState<'Reward' | 'Event'>('Reward');

  const handleTabClick = (tab: 'Reward' | 'Event') => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab); // 외부에서 상태를 알 수 있도록 콜백 실행
    }
  };

  return (
    <div className={styles.container}>
      {/* 탭 메뉴 */}
      <div className={styles.tabs}>
        <div
          className={`${styles.tab} ${activeTab === 'Reward' ? styles.active : ''}`}
          onClick={() => handleTabClick('Reward')}
        >
          Reward
          <div className={styles.underline} />
        </div>
        <div
          className={`${styles.tab} ${activeTab === 'Event' ? styles.active : ''}`}
          onClick={() => handleTabClick('Event')}
        >
          Event
          <div className={styles.underline} />
        </div>
      </div>
      <Link href={getLocalizedLink(`/main/game/shop`)}>
        {/* Shop 버튼 */}
        <button className={styles.shopButton}>Shop</button>
      </Link>
    </div>
  );
};

export default RewardTabMenu;
