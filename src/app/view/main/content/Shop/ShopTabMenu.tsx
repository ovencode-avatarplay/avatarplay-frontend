import React, {useState} from 'react';
import styles from './ShopTabMenu.module.css';

export enum ShopTabType {
  SinglePlan = 'Single Plan',
  SubscriptionPlan = 'Subscription Plan',
}

interface Props {
  onTabChange?: (tab: ShopTabType) => void;
}

const ShopTabMenu: React.FC<Props> = ({onTabChange}) => {
  const [activeTab, setActiveTab] = useState<ShopTabType>(ShopTabType.SinglePlan);

  const handleTabClick = (tab: ShopTabType) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab); // 외부에서 상태를 알 수 있도록 콜백 실행
    }
  };

  return (
    <div className={styles.container}>
      {/* 탭 메뉴 */}
      <div className={styles.tabs}>
        {Object.values(ShopTabType).map(tab => (
          <div
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
            <div className={styles.underline} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopTabMenu;
