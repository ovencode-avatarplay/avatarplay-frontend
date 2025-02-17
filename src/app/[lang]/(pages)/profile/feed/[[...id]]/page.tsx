'use client';
import {ExploreSortType, FeedMediaType} from '@/app/NetWork/ProfileNetwork';
import ReelsLayout from '@/components/homefeed/ReelsLayout';
import {useParams, useRouter, useSearchParams} from 'next/navigation';
import React, {useState} from 'react';
import cx from 'classnames';
import styles from './profileFeed.module.scss';
import {BoldArrowLeft, BoldMenuDots, LineMenu, LineShare} from '@ui/Icons';
import {getBackUrl} from '@/app/layout';
import {getLocalizedLink} from '@/utils/UrlMove';
import BottomNav from '@/app/view/main/bottom-nav/BottomNav';

type Props = {};

const pageFeedView = (props: Props) => {
  const router = useRouter();
  const query = useParams();
  const params = useSearchParams();
  const id = parseInt(query.id?.[0] || '0');
  const [data, setData] = useState(() => ({
    id: id,
  }));
  const feedMediaType = parseInt(params?.get('feedMediaType') || '0');
  const feedSortType = parseInt(params?.get('feedSortType') || '0');
  const index = parseInt(params?.get('index') || '0');
  const profileType = parseInt(params?.get('type') || '0');
  const routerBack = () => {
    router.replace(getLocalizedLink(`/profile/${id}`));
  };
  return (
    <>
      <section className={cx(styles.header)}>
        <div className={styles.left}>
          <div
            className={styles.backBtn}
            onClick={() => {
              routerBack();
            }}
          >
            <img src={BoldArrowLeft.src} alt="" />
          </div>
        </div>
      </section>
      <ReelsLayout
        profileId={id}
        profileType={profileType}
        feedMediaType={feedMediaType}
        feedSortType={feedSortType}
        indexContent={index}
      />
      <BottomNav />
    </>
  );
};

export default pageFeedView;
