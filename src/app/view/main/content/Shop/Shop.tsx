import React, {useState} from 'react';
import styles from './Shop.module.css';
import ExploreFeaturedHeader from '../searchboard/searchboard-header/ExploreFeaturedHeader';
import {BannerUrlList} from '@/app/NetWork/ExploreNetwork';
import CustomArrowHeader from '@/components/layout/shared/CustomArrowHeader';
import {BoldAlert, BoldRuby, BoldStar} from '@ui/Icons';
import SinglePlanContent from './SinglePlanContent';
import ShopTabMenu, {ShopTabType} from './ShopTabMenu';
import SubscriptionPlan from './SubscriptionPlan';

export const dummyBannerList: BannerUrlList[] = [
  {
    id: 1,
    title: '이벤트 배너 1',
    content: '지금 진행 중인 특별 이벤트를 확인하세요!',
    imageUrl: '/lora/absoluteReality.png',
    imageLinkUrl: 'https://example.com/event1',
  },
  {
    id: 2,
    title: '신규 업데이트',
    content: '새로운 기능이 추가되었습니다! 지금 확인해보세요.',
    imageUrl: '/lora/majicmix.jpeg',
    imageLinkUrl: 'https://example.com/update',
  },
  {
    id: 3,
    title: '한정 할인 이벤트',
    content: '특정 상품 최대 50% 할인! 기간 한정 혜택을 놓치지 마세요.',
    imageUrl: '/lora/anylora.png',
    imageLinkUrl: 'https://example.com/discount',
  },
  {
    id: 4,
    title: '커뮤니티 가입 이벤트',
    content: '공식 커뮤니티 가입하고 특별 보상을 받아보세요!',
    imageUrl: '/lora/meina_hentai.png',
    imageLinkUrl: 'https://example.com/community',
  },
  {
    id: 5,
    title: '출석 체크 보상 지급',
    content: '매일 출석 체크하고 다양한 보상을 획득하세요!',
    imageUrl: '/lora/testxl.png',
    imageLinkUrl: 'https://example.com/attendance',
  },
];

const Shop: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<ShopTabType>(ShopTabType.SinglePlan);

  return (
    <>
      <CustomArrowHeader
        title="Shop"
        backLink="/main/game"
        children={
          <div className={styles.rightArea}>
            <div className={styles.currencyArea}>
              <div className={styles.currencyItem}>
                <img className={styles.currencyIcon} src={BoldRuby.src} />
                <div className={styles.currencyText}>{999}</div>
              </div>
              <div className={styles.currencyItem}>
                <img className={styles.currencyIcon} src={BoldStar.src} />
                <div className={styles.currencyText}>{999}</div>
              </div>
            </div>
            <button className={styles.notification} onClick={() => {}}>
              <img className={styles.notificationIcon} src={BoldAlert.src} />
              <div className={styles.redDot}></div>
            </button>
            {/* <UserDropdown /> */}
          </div>
        }
      />

      <div className={styles.scrollArea}>
        <ExploreFeaturedHeader items={dummyBannerList} />
        <ShopTabMenu onTabChange={setSelectedTab}></ShopTabMenu>
        <div className={styles.content}>
          {selectedTab == ShopTabType.SinglePlan && (
            <>
              <SinglePlanContent></SinglePlanContent>
            </>
          )}
          {selectedTab == ShopTabType.SubscriptionPlan && (
            <>
              <SubscriptionPlan></SubscriptionPlan>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Shop;
