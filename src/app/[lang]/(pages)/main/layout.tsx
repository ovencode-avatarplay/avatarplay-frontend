import type {Metadata} from 'next';
import '@/app/globals.css';
import Main from '@/app/view/main/Main';

export const metadata: Metadata = {
  title: 'Talkain',
  description: 'AI Chatting',
  icons: '/Images/Talkain_icon_256_green.png',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Main>{children}</Main>;
}
