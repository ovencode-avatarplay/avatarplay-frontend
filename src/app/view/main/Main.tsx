'use client'

import React, { ReactNode } from 'react'

import HeaderNavBar from "@/app/view/main/header/header-nav-bar/HeaderNavBar";
import BottomNav from "@/app/view/main/bottom-nav/BottomNav";
import DrawerContentDesc from "@/app/view/main/content/DrawerContentDesc";
import { Provider } from 'react-redux';
import { store } from '@/redux-store/ReduxStore';
import Style from './Main.module.css'

const Main = ({ children }: { children: ReactNode }) => {

  return (
    <Provider store={store}>
      <div className={Style.body}>
        <HeaderNavBar />
        {children}
        <BottomNav />
        <DrawerContentDesc />
      </div>
    </Provider>
  )
}

export default Main
