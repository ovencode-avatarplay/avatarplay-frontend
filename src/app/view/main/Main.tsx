import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './header/Header'
import SearchBoard from './content/searchboard/SearchBoard'
import Footer from './footer/Footer'
import HomeFeed from './content/HomeFeed'
import ChatPage from './content/ChatPage'
import BottomNav from './bottom-nav/bottom-nav'
import DrawerContentDesc from './content/DrawerContentDesc';

import './Main.css';
import { Container } from '@mui/material'
import DrawerCreate from './content/create/DrawerCreate';

const Main: React.FC = () => {
  const location = useLocation();

  // /chat 경로에서는 BottomNav 숨기기
  const hideAtChat = location.pathname === '/chat';

  return (
    <div id='main' className="main">
      {!hideAtChat && <Header />}
      <Routes>
        <Route path='/' element={<HomeFeed />} />
        <Route path='/explore' element={<SearchBoard />} />
        <Route path='/chat' element={<ChatPage />} />
      </Routes>
      {/*<SideBar /> */}  {/* SideBar는 기획쪽에서 논의할 내용이 있어서 일단 보류*/}
      {/* <Footer /> */}
      {!hideAtChat && <DrawerContentDesc />}
      {!hideAtChat && <BottomNav />}
    </div>
  )
}

export default Main
