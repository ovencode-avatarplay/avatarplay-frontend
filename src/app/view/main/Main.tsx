'use client'

import React, { ReactNode } from 'react'


import HeaderNavBar from "@/app/view/main/header/header-nav-bar/HeaderNavBar";
import BottomNav from "@/app/view/main/bottom-nav/BottomNav";
import DrawerContentDesc from "@/app/view/main/content/DrawerContentDesc";
import { Provider } from 'react-redux';
import { store } from '@/redux-store/ReduxStore';




const Main = ({ children }: { children: ReactNode }) => {

  return (
    <html lang="en">
      <Provider store={store}>
        <HeaderNavBar />
        {children}
        <BottomNav />
        <DrawerContentDesc />
      </Provider>
    </html>
  )
}

export default Main
