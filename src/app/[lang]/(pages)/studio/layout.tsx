import type {Metadata} from 'next';
import '@/app/globals.css';
import Studio from '@/app/view/studio/Studio';

export const metadata: Metadata = {
  title: 'Talkain',
  description: 'Studio',
  icons: '/images/Talkain_icon_256_green.png',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return <Studio>{children}</Studio>;
}
