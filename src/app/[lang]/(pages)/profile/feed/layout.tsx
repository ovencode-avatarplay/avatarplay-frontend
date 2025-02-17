import type {Metadata} from 'next';
import ServiceMain from '@/app/view/service/Service';

export const metadata: Metadata = {
  title: 'Talkain',
  description: 'Studio',
  icons: '/images/Talkain_icon_256_green.png',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return <>{children}</>;
}
