"use client"

import Chat from "@/app/view/main/content/ChatPage";
import { Provider } from "react-redux";
import { store } from "@/redux-store/ReduxStore";

export default function ChatPage() {
    return (
            <Chat />
    );
}
