import React from "react";
import {useDispatch, useSelector} from 'react-redux';
import { Navigate } from "react-router-dom";
import {useForm} from 'react-hook-form'

import { Avatar, Button, Paper, TextField, Typography } from "@mui/material";

import styles from "./Registration.module.scss";

import { fetchRegister, selectIsAuth } from "../../redux/slices/auth";

export const Registration = () => {
  //с помощью хука useSelector вытаскиваем флаг регистрации пользователя 
  const isRegister = useSelector(selectIsAuth);

  const dispatch = useDispatch();
  const {
    register, 
    handleSubmit, 
    formState: {errors}
  } = useForm({
    //данные по умолчанию в форму
    defaultValues: {
      fullname: '',
      email:    '',
      password: ''
    },
    mode: 'onChange'
  })

  const onSubmit = async (values) => {
    //активируем запрос на регистрацию пользователя
    const data = await dispatch(fetchRegister(values));

    //регистрация пользователя не прошла
    if (!data.payload) {
      return alert('Failed to register!')
    }

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token);
    } 
  }

  //Переходим на страницу авторизации пользователя, если регистрация пользователя прошла успешно
  if (isRegister) {
    return <Navigate to="/login" />
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
      	Create account
      </Typography>
      {/*Аватарка регистрации пользователя */}
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/*Поле задания полного имени регистрируемого пользователя*/}
        <TextField 
          className={styles.field} 
          error={Boolean(errors.fullname?.message)}
          helperText={errors.fullname?.message}
          type="fullname"
          {...register('fullname', {required: 'Enter the full name'})}
          label="Full name"
          fullWidth 
        />
        {/*Поле задания электронной почты регистрируемого пользователя*/}
        <TextField 
          className={styles.field} 
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type="email" 
          {...register('email', {required: 'Укажите почту'})}
          label="E-Mail"
          fullWidth 
        />
        {/*Поле задания пароля регистрируемого пользователя*/}
        <TextField
          className={styles.field}  
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          type="password" 
          {...register('password', {required: 'Enter password'})}
          label="Password"
          fullWidth 
        />
	{/*Кнопка активации запроса на регистрацию пользователя */}
        <Button type="submit" size="large" variant="contained" fullWidth>
          Register
        </Button>
      </form>
    </Paper>
  );
};