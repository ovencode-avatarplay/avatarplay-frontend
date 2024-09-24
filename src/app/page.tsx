"use client"

import Main from "./view/main/Main"
import { Provider } from "react-redux";
import { store } from "@/redux-store/ReduxStore";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

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
