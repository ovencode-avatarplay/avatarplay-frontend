"use client"

import HomeFeed from "@/app/view/main/content/HomeFeed";
import { Provider } from "react-redux";
import { store } from "@/redux-store/ReduxStore";

export default function HomeFeedPage() {
    return (
        <Provider store={store}>
            <HomeFeed />
        </Provider>
    );
}
