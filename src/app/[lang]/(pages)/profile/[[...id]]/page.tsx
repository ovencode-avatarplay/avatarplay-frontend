'use client';

import BottomNav from '@/app/view/main/bottom-nav/BottomNav';
import ProfileBase from '@/app/view/profile/ProfileBase';
import useAuthFromUrl from '@/utils/useAuth';
import {notFound} from 'next/navigation';

type Props = {
  params: { id?: string[] };
  searchParams: {token?: string};
};

export default function PostPage({params, searchParams}: Props) {
  const urlLinkKey = params.id?.[0] ?? '0';
  const loading = useAuthFromUrl();
  
  if(loading) return null;
  return (
    <>
      <ProfileBase urlLinkKey={urlLinkKey} isPath/>
      <BottomNav />
    </>
  );
}
