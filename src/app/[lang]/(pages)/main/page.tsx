"use client"

import { Provider } from "react-redux";
import { store } from "@/redux-store/ReduxStore";

export default function Home() {
  return (
    <Provider store={store}>
      <div>
        hi
      </div>
    </Provider>
  );
}
