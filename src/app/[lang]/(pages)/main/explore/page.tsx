"use client"

import Explore from "@/app/view/main/content/searchboard/SearchBoard";
import { Provider } from "react-redux";
import { store } from "@/redux-store/ReduxStore";
import DrawerContentDesc from "@/app/view/main/content/DrawerContentDesc";

export default function ExplorePage() {
    return (
        <Provider store={store}>
            <Explore />
            <DrawerContentDesc />
        </Provider>
    );
}
