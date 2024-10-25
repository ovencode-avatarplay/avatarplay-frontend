import type {Metadata} from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Talkain',
  description: 'Create Content',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return <>{children}</>;
}
