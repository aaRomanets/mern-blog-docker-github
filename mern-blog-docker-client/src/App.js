import React from 'react';
import {Routes, Route} from "react-router-dom";
import {useDispatch} from 'react-redux';
import Container from "@mui/material/Container";

import { Header } from "./components/Header/index.jsx";
import { Home } from "./pages/Home.jsx";
import { FullArticle } from "./pages/FullArticle";
import { Registration } from "./pages/Registration/index.jsx";
import { AddArticle } from "./pages/AddArticle/index.jsx";
import { Login } from "./pages/Login/index.jsx";
import { fetchAuthMe} from "./redux/slices/auth.js";

function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    //делаем запрос на получение данных по авторизованному пользователю, если такой пользователь существует
    if (localStorage.getItem('token') !== null) 
    {
      dispatch(fetchAuthMe());
    }  
  }, [dispatch]);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
        {/*Ссылка на центральную страницу */}
        < Route path="/"               element={<Home />} />
	      {/*Ссылка на страницу полной информации по статье */}
        < Route path="/articles/:id"      element={<FullArticle />} />
	      {/*Ссылка на страницу редактирования статьи */}
        < Route path="/articles/:id/edit" element={<AddArticle />} />
 	      {/*Ссылка на страницу добавления статьи*/}
        < Route path="/add-article"       element={<AddArticle />} />
 	      {/*Ссылка на страницу авторизации зарегистрированного пользователя */} 
        < Route path="/login"          element={<Login />} />
	      {/*Cсылка на страницу регистрации пользователя */} 
        < Route path="/register"       element={<Registration />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;