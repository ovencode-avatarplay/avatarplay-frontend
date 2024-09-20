import React from 'react'
import Header from './header/Header'
import SearchBoard from './content/SearchBoard'
import Footer from './footer/Footer'
import HomeFeed from './content/HomeFeed'
import ChatPage from './content/ChatPage'

import './Main.css';

const Main: React.FC = () => {
  return (
    <div className="main">
      <Header />
      {/* <HomeFeed /> */}
      {/* <SearchBoard /> */}
      {/* <ChatPage /> */} {/* 채팅 페이지는 Modal로 작업 */}
      <Footer />
    </div>
  )
}

export default Main
