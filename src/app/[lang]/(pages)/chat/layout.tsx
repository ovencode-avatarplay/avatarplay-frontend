import type {Metadata} from 'next';
import '@/app/globals.css';
export const metadata: Metadata = {
  title: 'Talkain',
  description: 'Chatting',
  icons: '/images/Talkain_icon_256_green.png',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return <>{children}</>;
}
