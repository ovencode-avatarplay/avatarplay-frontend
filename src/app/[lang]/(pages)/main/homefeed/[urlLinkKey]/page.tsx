'use client';

import React, {useState, useEffect} from 'react';
import {useParams, useRouter} from 'next/navigation';
import ReelsLayout from '@/components/homefeed/ReelsLayout';
import {FeedInfo, sendGetFeed} from '@/app/NetWork/ShortsNetwork';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {getCurrentLanguage, pushLocalizedRoute} from '@/utils/UrlMove';

const HomeFeedWithUrlKey: React.FC = () => {
  const params = useParams();
  const urlLinkKey = Array.isArray(params?.urlLinkKey) ? params?.urlLinkKey[0] : params?.urlLinkKey; // string으로 변환

  const [feedData, setFeedData] = useState<FeedInfo>();

  const router = useRouter();

  const recommendState = useSelector((state: RootState) => state.mainControl.homeFeedRecommendState);
  useEffect(() => {
    const fetchFeed = async () => {
      const payload = {
        urlLinkKey: urlLinkKey as string, // 명시적으로 string 타입으로 캐스팅
        languageType: getCurrentLanguage(),
      };

      const response = await sendGetFeed(payload);

      if (response.resultCode === 0 && response.data) {
        console.log('Feed fetched successfully:', response.data.feedInfo);
        setFeedData(response.data.feedInfo);
      } else {
        pushLocalizedRoute('/main/homefeed', router);
        console.error('Failed to fetch feed:', response.resultMessage);
        return;
      }
    };

    if (urlLinkKey) fetchFeed();
  }, [urlLinkKey]);

  if (!feedData) return <p>Loading...</p>;

  return (
    <main style={{position: 'relative', height: '100%'}}>
      <ReelsLayout initialFeed={feedData} recommendState={recommendState}></ReelsLayout>
    </main>
  );
};

export default HomeFeedWithUrlKey;
