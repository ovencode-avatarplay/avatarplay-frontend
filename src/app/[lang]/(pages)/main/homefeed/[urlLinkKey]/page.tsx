'use client';

import React, {useState, useEffect} from 'react';
import {useParams} from 'next/navigation';
import ReelsLayout from '@/components/homefeed/ReelsLayout';
import {FeedInfo, sendGetFeed} from '@/app/NetWork/ShortsNetwork';

const HomeFeedWithUrlKey: React.FC = () => {
  const params = useParams();
  const urlLinkKey = Array.isArray(params?.urlLinkKey) ? params?.urlLinkKey[0] : params?.urlLinkKey; // string으로 변환
  console.log('urlkey:', urlLinkKey);

  const [feedData, setFeedData] = useState<FeedInfo>();

  useEffect(() => {
    const fetchFeed = async () => {
      const payload = {
        urlLinkKey: urlLinkKey as string, // 명시적으로 string 타입으로 캐스팅
        languageType: navigator.language || 'en-US',
      };

      const response = await sendGetFeed(payload);

      if (response.resultCode === 0 && response.data) {
        console.log('Feed fetched successfully:', response.data.feedInfo);
        setFeedData(response.data.feedInfo);
      } else {
        console.error('Failed to fetch feed:', response.resultMessage);
      }
    };

    if (urlLinkKey) fetchFeed();
  }, [urlLinkKey]);

  if (!feedData) return <p>Loading...</p>;

  return (
    <main style={{position: 'relative', height: 'var(--body-height)'}}>
      <ReelsLayout initialFeed={feedData}></ReelsLayout>
    </main>
  );
};

export default HomeFeedWithUrlKey;
