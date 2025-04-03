import React, {useEffect, useState} from 'react';
import styles from './Gamification.module.css';
import RewardTabMenu from './RewardTabMenu';
import ExploreFeaturedHeader from '../searchboard/searchboard-header/ExploreFeaturedHeader';
import RewardGoods from './RewardGoods'; // 새로 만든 컴포넌트 불러오기
import {BannerUrlList} from '@/app/NetWork/ExploreNetwork';
import RewardContent from './RewardContent';
import HeaderNavBarWhite from '../../header/header-nav-bar/HeaderNavBarWhite';
import {setSelectedIndex} from '@/redux-store/slices/MainControl';
import {useDispatch} from 'react-redux';
import CustomArrowHeader from '@/components/layout/shared/CustomArrowHeader';

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

const Gamification: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'Reward' | 'Event'>('Reward');

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSelectedIndex(2));
  }, []);
  return (
    <>
      {' '}
      <CustomArrowHeader title="Reward" backLink="/main" />
      <RewardTabMenu onTabChange={setSelectedTab} />
      <div className={styles.scrollArea}>
        {selectedTab == 'Reward' && (
          <>
            <ExploreFeaturedHeader items={dummyBannerList} />
            <RewardGoods />
            <RewardContent />
          </>
        )}
      </div>
    </>
  );
};

export default Gamification;
