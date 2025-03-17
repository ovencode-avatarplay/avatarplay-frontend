import type {Metadata} from 'next';
import Main from '@/app/view/main/Main';

export const metadata: Metadata = {
  title: 'Talkain',
  description: 'AI Chatting',
  icons: '/images/Talkain_icon_256_green.png',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div style={{height: '100dvh'}}>{children}</div>;
}
