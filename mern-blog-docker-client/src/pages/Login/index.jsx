import React from "react";
import {useDispatch, useSelector} from 'react-redux';
import { Navigate } from "react-router-dom";
import {useForm} from 'react-hook-form'

import { Button, Paper, TextField, Typography } from "@mui/material";

import styles from "./Login.module.scss";
import { fetchAuth, selectIsAuth } from "../../redux/slices/auth";

export const Login = () => {
  //используя хук useSelector вытаскиваем флаг авторизации пользователя 
  const isAuth = useSelector(selectIsAuth);

  const dispatch = useDispatch();

  const {
    register, 
    handleSubmit, 
    formState: {errors}
  } = useForm({
    //данные по умолчанию в форму
    defaultValues: {
      email :   '',
      password: ''
    },
    mode: 'onChange'
  })

  const onSubmit = async (values) => {
    //активация запроса авторизации пользователя
    const data = await dispatch(fetchAuth(values));

    //случай, когда авторизация не прошла
    if (!data.payload) {
      return alert('Failed to log in!')
    }

    //фиксируем токен авторизованного пользователя
    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    } else {
      alert('Failed to log in!');
    }
  }

  //возврат на домашнюю страницу, если авторизация прошла успешно
  if (isAuth) {
    return <Navigate to="/" />
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Log in to your account
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/*Поле задания почты авторизируемого пользователя*/}
        <TextField 
          className={styles.field} 
          label="E-Mail"
          type="email" 
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', {required: 'Specify email'})}
          fullWidth 
        />
        {/*Поле задания пароля авторизируемого пользователя*/}
        <TextField 
          className={styles.field} 
          label="Пароль"
          type="password" 
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register('password', {required: 'Укажите пароль'})}
          fullWidth 
        />
        {/*Кнопка активации запроса на авторизацию пользователя */}
        <Button type="submit" size="large" variant="contained" fullWidth>
          Enter
        </Button>
      </form>
    </Paper>
  );
};
