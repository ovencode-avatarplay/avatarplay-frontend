import type {Metadata} from 'next';
import Profile from '@/app/view/profile/Profile';

export const metadata: Metadata = {
  title: 'Talkain',
  description: 'Profile',
  icons: '/images/Talkain_icon_256_green.png',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return <Profile>{children}</Profile>;
}
