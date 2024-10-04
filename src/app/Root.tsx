"use client"

import { store } from "@/redux-store/ReduxStore"
import { Provider } from "react-redux"


 const Root = ({children})=>{
    return (
    <Provider store={store}>
        {children}
    </Provider>
    )
}

export default Root;