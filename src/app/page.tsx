"use client"

import Main from "./view/main/Main"
import { Provider } from "react-redux";
import { store } from "@/redux-store/ReduxStore";

export default function Home() {
  return (
    <Provider store={store}>
      <div>
        <Main>

        </Main>
      </div>
    </Provider>
  );
}
