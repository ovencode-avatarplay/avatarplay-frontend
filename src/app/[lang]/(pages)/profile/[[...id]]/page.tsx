'use client';

import BottomNav from '@/app/view/main/bottom-nav/BottomNav';
import ProfileBase from '@/app/view/profile/ProfileBase';
import {isLogined} from '@/utils/UrlMove';
import {notFound} from 'next/navigation';

type Props = {
  params: {
    id?: string[];
  };
};

export default function PostPage({params}: Props) {
  return (
    <>
      <ProfileBase profileId={parseInt(params?.id?.[0] || '0')} isPath />
      <BottomNav />
    </>
  );
}
