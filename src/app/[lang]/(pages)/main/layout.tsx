import type { Metadata } from "next";
import "@/app/globals.css";
import Main from "@/app/view/main/Main";

export const metadata: Metadata = {
  title: "Talkain",
  description: "AI Chatting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Main>
        {children}
      </Main>
    </html>
  );
}
