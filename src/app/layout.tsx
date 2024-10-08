import type { Metadata } from "next";
import "@/app/globals.css";
import Main from "@/app/view/main/Main";
import { Provider } from "react-redux";
import { store } from "@/redux-store/ReduxStore";
import Root from "./Root";
export const metadata: Metadata = {
  title: "Talkain",
  description: "AI Chatting",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Root>
          {children}
        </Root>
      </body>
    </html>
  );
}
