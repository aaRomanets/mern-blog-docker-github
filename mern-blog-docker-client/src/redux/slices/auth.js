import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from '../../axios';

//запрос на авторизацию пользователя
export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (params) => {
    const { data } = await axios.post('/auth/login', params);
    return data;
})

//запрос на регистрацию пользователя
export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
    const { data } = await axios.post('/auth/register', params);
    return data;
})

//запрос на получение данных по авторизованному пользователю, если такой пользователь существует
export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
    const { data } = await axios.get('/auth/me');
    return data;
})

//начальное состояние
const initialState = {
    data: null,
    status: 'loading'
};

const authSlice = createSlice ({
    name: 'auth',
    initialState,
    reducers: {
        //стираем данные по авторизованному пользователю
        logout : (state) => {
            state.data = null;
        }
    },
    extraReducers: {
        //отправляем полученные данные по авторизированному пользователю в store 
        [fetchAuth.pending] : (state) => {
            state.status = 'loading';
            state.data = null;
        },
        [fetchAuth.fulfilled] : (state, action) => {
            state.status = 'loaded';
            state.data = action.payload;
        },
        [fetchAuth.rejected] : (state) => {
            state.status = 'error';
            state.data = null;
        },
        //отправляем полученные данные по авторизированному пользователю в store если такой пользователь существует
        [fetchAuthMe.pending] : (state) => {
            state.status = 'loading';
            state.data = null;
        },
        [fetchAuthMe.fulfilled] : (state, action) => {
            state.status = 'loaded';
            state.data = action.payload;
        },
        [fetchAuthMe.rejected] : (state) => {
            state.status = 'error';
            state.data = null;
        },
        //отправляем полученные данные по зарегистрированному пользователю в store 
        [fetchRegister.pending] : (state) => {
            state.status = 'loading';
            state.data = null;
        },
        [fetchRegister.fulfilled] : (state, action) => {
            state.status = 'loaded';
            state.data = action.payload;
        },
        [fetchRegister.rejected] : (state) => {
            state.status = 'error';
            state.data = null;
        }             
    }
})

//экспортируем флаг авторизации пользователя
export const selectIsAuth = state => Boolean(state.auth.data);
//этот редюсер экспортируется в store
export const authReducer = authSlice.reducer;
//экспортируем функцию очищения данных по авторизованному пользователю
export const { logout } = authSlice.actions;