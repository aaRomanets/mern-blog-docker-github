import React from "react";
import {Link} from "react-router-dom"
import Button from "@mui/material/Button";

import styles from "./Header.module.scss";
import { Container } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectIsAuth } from "../../redux/slices/auth";

//заглавная страница проекта
export const Header = () => {
  const dispatch = useDispatch();
  //вытаскиваем флаг авторизации пользователя
  const isAuth = useSelector(selectIsAuth);

  const onClickLogout = () => {
    if (window.confirm('Do you really want to get out?'))
    {
      //делаем запрос на удаление данных из хранилища store по авторизованному пользователю
      dispatch(logout());
      //удаляем токен авторизованного пользователя
      window.localStorage.removeItem('token');
    }
  }

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          {/*Ссылка перехода на главную страницу*/}
          <Link className={styles.logo} to="/">
            <div>ROMANETS BLOG</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
              	{/*Действия, которые уместны при существовании авторизированного пользователя*/}
              	{/*Ссылка на написание статьи авторизованным пользователем*/}
                <Link to="/add-article">
                  {/*Кнопка написания статьи авторизованным пользователем*/}
                  <Button variant="contained">Write paper</Button>
                </Link>
                {/*Кнопка очистки данных авторизируемого пользователя и удаления его токена*/}
                <Button onClick={onClickLogout} variant="contained" color="error">
                  Escape
                </Button>
              </>
            ) : (
              <>
                {/*Действия, которые уместны если нет авторизированного пользователя*/}
                {/*Ссылка на авторизацию пользователя */}
                <Link to ="/login">
                  {/*Кнопка авторизации пользователя*/}
                  <Button variant="outlined">Enter</Button>
                </Link>
                {/*Ссылка на регистрацию пользователя*/}
                <Link to ="/register">
                  {/*Кнопка регистрации пользователя*/}
                  <Button variant="contained">Create account</Button>
                </Link>
              </>
            )}

          </div>
        </div>
      </Container>
    </div>
  );
};
