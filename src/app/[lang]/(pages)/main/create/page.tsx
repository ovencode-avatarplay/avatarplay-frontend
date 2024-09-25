"use client"

import Create from "@/app/view/main/content/create/content-main/ContentMain";
import { Provider } from "react-redux";
import { store } from "@/redux-store/ReduxStore";

export default function CreatePage() {
    return (
        <Provider store={store}>
            <Create />
        </Provider>
    );
}
