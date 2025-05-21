import React, {useEffect, useState} from 'react';
import styles from './Shop.module.css';
import ExploreFeaturedHeader from '../searchboard/searchboard-header/ExploreFeaturedHeader';
import {BannerUrlList} from '@/app/NetWork/ExploreNetwork';
import CustomArrowHeader from '@/components/layout/shared/CustomArrowHeader';
import {BoldNotification, BoldRuby, BoldStar} from '@ui/Icons';
import SinglePlanContent from './SinglePlanContent';
import ShopTabMenu, {ShopTabType} from './ShopTabMenu';
import SubscriptionPlan from './SubscriptionPlan';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {formatCurrency} from '@/utils/util-1';
import {setSelectedIndex} from '@/redux-store/slices/MainControl';
import {sendCreateLinkReq} from '@/app/NetWork/PaymentNetwork';
import {Session, UserMetadata} from '@supabase/supabase-js';
import {supabase} from '@/utils/supabaseClient';

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

const rubyItems = [
  {id: 1, amount: 5, bonus: 5, price: 3},
  {id: 2, amount: 10, bonus: 10, price: 5},
  {id: 3, amount: 20, bonus: 20, price: 10},
  {id: 4, amount: 50, bonus: 50, price: 20},
  {id: 5, amount: 100, bonus: 100, price: 30},
  {id: 6, amount: 200, bonus: 200, price: 50},
  {id: 7, amount: 500, bonus: 500, price: 100},
  {id: 8, amount: 1000, bonus: 1000, price: 200},
  {id: 9, amount: 2000, bonus: 2000, price: 400},
  {id: 10, amount: 5000, bonus: 5000, price: 1000},
  {id: 11, amount: 10000, bonus: 10000, price: 2000},
  {id: 12, amount: 20000, bonus: 20000, price: 4000},
  {id: 13, amount: 50000, bonus: 50000, price: 10000},
  {id: 14, amount: 100000, bonus: 100000, price: 20000},
  {id: 15, amount: 200000, bonus: 200000, price: 40000},
];

const starItems = [
  {id: 1, amount: 5, bonus: 5, price: 3},
  {id: 2, amount: 10, bonus: 10, price: 5},
  {id: 3, amount: 20, bonus: 20, price: 10},
  {id: 4, amount: 50, bonus: 50, price: 20},
  {id: 5, amount: 100, bonus: 100, price: 30},
  {id: 6, amount: 200, bonus: 200, price: 50},
  {id: 7, amount: 500, bonus: 500, price: 100},
  {id: 8, amount: 1000, bonus: 1000, price: 200},
  {id: 9, amount: 2000, bonus: 2000, price: 400},
  {id: 10, amount: 5000, bonus: 5000, price: 1000},
  {id: 11, amount: 10000, bonus: 10000, price: 2000},
  {id: 12, amount: 20000, bonus: 20000, price: 4000},
  {id: 13, amount: 50000, bonus: 50000, price: 10000},
  {id: 14, amount: 100000, bonus: 100000, price: 20000},
  {id: 15, amount: 200000, bonus: 200000, price: 40000},
];

const planData = [
  {
    id: 1,
    title: 'Plan 1',
    price: 5,
    ruby: 86,
    bonus: 60,
    increaseRate: 70,
  },
  {
    id: 2,
    title: 'Plan 2',
    price: 10,
    ruby: 172,
    bonus: 120,
    increaseRate: 140,
  },
  {
    id: 3,
    title: 'Plan 3',
    price: 20,
    ruby: 344,
    bonus: 240,
    increaseRate: 280,
  },
];

const Shop: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<ShopTabType>(ShopTabType.SinglePlan);
  const [userMetaData, setUserMetaData] = useState<UserMetadata | null>();

  const dataCurrencyInfo = useSelector((state: RootState) => state.currencyInfo);

  const [itemIdList, setItemIdList] = useState<number[]>([]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSelectedIndex(2));
  }, []);

  useEffect(() => {
    // 현재 계정 가져오기
    getSessionData();
  }, []);

  const getSessionData = async () => {
    const session = await supabase.auth.getSession();
    setUserMetaData(session.data.session?.user.user_metadata || null);
  };

  const handleOnClickBuy = async (itemId: number, amount: number) => {
    const res = await sendCreateLinkReq({
      userid: userMetaData?.id,
      userName: userMetaData?.name,
      email: userMetaData?.email,
      itemName: 'Item' + itemId.toString(),
      amount: amount,
    });
    if (res) {
      console.log(res);
    }
  };

  return (
    <div className={styles.shopContainer}>
      <CustomArrowHeader
        title="Shop"
        backLink="/main/game"
        children={
          <div className={styles.rightArea}>
            <div className={styles.currencyArea}>
              <div className={styles.currencyItem}>
                <img className={styles.currencyIcon} src={BoldRuby.src} />
                <div className={styles.currencyText}>{formatCurrency(dataCurrencyInfo.ruby)}</div>
              </div>
              <div className={styles.currencyItem}>
                <img className={styles.currencyIcon} src={BoldStar.src} />
                <div className={styles.currencyText}>{formatCurrency(dataCurrencyInfo.star)}</div>
              </div>
            </div>
            <button className={styles.notification} onClick={() => {}}>
              <img className={styles.notificationIcon} src={BoldNotification.src} />
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
              <SinglePlanContent
                onBuy={handleOnClickBuy}
                rubyItems={rubyItems}
                starItems={starItems}
              ></SinglePlanContent>
            </>
          )}
          {selectedTab == ShopTabType.SubscriptionPlan && (
            <>
              <SubscriptionPlan planData={planData}></SubscriptionPlan>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}
