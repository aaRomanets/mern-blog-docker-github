import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from '../../axios.js';

//запрос на получение статей
export const fetchArticles = createAsyncThunk('/articles/fetchArticles', async () => {
    const {data} = await axios.get('/articles');
    return data;
})

//запрос на получение тэгов
export const fetchTags = createAsyncThunk('/articles/fetchTags', async () => {
    const {data} = await axios.get('/tags');
    return data;
})

//запрос на удаление статьи по заданному идентификатору id
export const fetchRemoveArticle = createAsyncThunk('/articles/fetchRemoveArticle', async (id) => {
    await axios.delete(`/articles/${id}`);
})

//начальное состояние
const initialState = {
    articles: {
        items: [],
        status: 'loading'
    },
    tags: {
        items: [],
        status: 'loading'
    }
};

const articlesSlice = createSlice({
    name: 'articles',
    initialState,
    reducer: {},
    extraReducers: {
        //Получение статей
        [fetchArticles.pending] : (state) => {
            state.articles.items = [];
            state.articles.status = 'loading';
        },
        [fetchArticles.fulfilled] : (state, action) => {
            state.articles.items = action.payload;
            state.articles.status = 'loaded';
        },
        [fetchArticles.rejected] : (state) => {
            state.articles.items = [];
            state.articles.status = 'error';
        },
        //Получение тэгов
        [fetchTags.pending] : (state) => {
            state.tags.items = [];
            state.tags.status = 'loading';
        },
        [fetchTags.fulfilled] : (state, action) => {
            state.tags.items = action.payload;
            state.tags.status = 'loaded';
        },
        [fetchTags.rejected] : (state) => {
            state.tags.items = [];
            state.tags.status = 'error';
        },
        //Удаление статьи
        [fetchRemoveArticle.pending] : (state, action) => {
            state.articles.items = state.articles.items.filter(obj => obj._id !== action.meta.arg);
        }
    }
})

//этот редюсер экспортируем в store
export const articlesReducer = articlesSlice.reducer;