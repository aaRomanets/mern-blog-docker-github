import {configureStore} from "@reduxjs/toolkit";
import { articlesReducer } from "./slices/articles";
import { authReducer } from "./slices/auth";

//составляем хранилище
const store = configureStore({
    reducer: {
        //собираем результаты с запросов по операциям со статьями
        articles: articlesReducer,
        //собираем результаты с запросов по операциям с пользовательскими данными
        auth: authReducer
    }
})

export default store;