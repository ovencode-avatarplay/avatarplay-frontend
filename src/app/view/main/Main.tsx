import React from 'react'
import Header from './header/Header'
import SearchBoard from './content/searchboard/SearchBoard'
import Footer from './footer/Footer'
import HomeFeed from './content/HomeFeed'
import ChatPage from './content/ChatPage'

import './Main.css';
import { Container } from '@mui/material'

const Main: React.FC = () => {  
  return (
    <div id='main' className="main">
      <Header />
      <HomeFeed />
      {/* <SearchBoard /> */}
      {/* <ChatPage /> */} {/* 채팅 페이지는 Modal로 작업 */}
      {/*<SideBar /> */}  {/* SideBar는 기획쪽에서 논의할 내용이 있어서 일단 보류*/}
      <Footer />
    </div>
  )
}

export default Main
