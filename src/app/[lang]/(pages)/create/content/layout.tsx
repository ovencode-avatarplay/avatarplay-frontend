import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Talkain',
  description: 'Create Content',
  icons: '/images/Talkain_icon_256_green.png',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return <>{children}</>;
}
