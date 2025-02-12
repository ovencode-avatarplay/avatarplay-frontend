import React, {useEffect} from 'react';
import ReelsLayout from '@/components/homefeed/ReelsLayout';
import './HomeFeed.css';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
const HomeFeed: React.FC = () => {
  const recommendState = useSelector((state: RootState) => state.mainControl.homeFeedRecommendState);

  return (
    <main className="Home-Feed">
      <ReelsLayout recommendState={recommendState}></ReelsLayout>
    </main>
  );
};

export default HomeFeed;
