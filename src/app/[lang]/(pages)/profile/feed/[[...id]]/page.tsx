'use client';
import {ExploreSortType, FeedMediaType} from '@/app/NetWork/ProfileNetwork';
import ReelsLayout from '@/components/homefeed/ReelsLayout';
import {useParams, useRouter} from 'next/navigation';
import React, {useState} from 'react';
import cx from 'classnames';
import styles from './profileFeed.module.scss';
import {BoldArrowLeft, BoldMenuDots, LineMenu, LineShare} from '@ui/Icons';
import {getBackUrl} from '@/utils/util-1';
import {getLocalizedLink} from '@/utils/UrlMove';
import BottomNav from '@/app/view/main/bottom-nav/BottomNav';
import useCustomRouter from '@/utils/useCustomRouter';

type Props = {
  searchParams: {feedMediaType?: string; feedSortType?: string; idContent: string; type: string};
};

const PageFeedView = ({searchParams}: Props) => {
  const {back} = useCustomRouter();
  const router = useRouter();
  const query = useParams();
  const id = query?.id?.[0] || '0';
  const [data, setData] = useState(() => ({
    id: id,
  }));
  const feedMediaType = parseInt(searchParams?.feedMediaType || '0');
  const feedSortType = parseInt(searchParams?.feedSortType || '0');
  const idContent = parseInt(searchParams?.idContent || '0');
  const profileType = parseInt(searchParams?.type || '0');
  const routerBack = () => {
    back(`/profile/${id}`);
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
        profileUrlLinkKey={id}
        profileType={profileType}
        feedMediaType={feedMediaType}
        feedSortType={feedSortType}
        idContent={idContent}
      />
      <BottomNav />
    </>
  );
};

export default PageFeedView;
