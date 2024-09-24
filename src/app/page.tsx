"use client"

import Main from "./view/main/Main"
import { Provider } from "react-redux";
import { store } from "@/redux-store/ReduxStore";
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';  // 임시로 BrowserRouter 대신 HashRouter 사용. (프론트 개발 편의)

export default function Home() {
  return (
    <Provider store={store}>
      <div>
        <Router>
          <Main>

          </Main>
        </Router>
      </div>
    </Provider>
  );
}
