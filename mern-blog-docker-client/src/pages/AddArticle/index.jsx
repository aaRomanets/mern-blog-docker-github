import React from "react";
import { Button, Paper, TextField } from "@mui/material";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import axios from '../../axios';
import styles from "./AddArticle.module.scss";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import { useNavigate, Navigate, useParams } from "react-router-dom";

export const AddArticle = () => {
  //идентификатор статьи (если статья создается то идентификатор пустой, а если она редактируется тогда идентификатор имеется)
  const {id} = useParams();
  //хук навигации
  const navigate = useNavigate();
  //флаг авторизации пользователя (существует ли авторизованный пользователь)
  const isAuth = useSelector(selectIsAuth);
  //состояние текста статьи 
  const [text, setText] = React.useState("");
  //состояние заголовка статьи
  const [title, setTitle] = React.useState("");
  //состояние тэгов статьи
  const [tags, setTags] = React.useState("");
  //состояние изображения статьи
  const [imageUrl, setImageUrl] = React.useState("");
  const inputFileRef = React.useRef(null);

  //флаг редактирования статьи
  const isEditing = Boolean(id);

  const handleChangeFile = async (event) => {
    try
    {
      //формируем изображение для статьи
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file);
      //Загружаем отдельное изображение для статьи в отдельную папку на диске через сервер
      const {data} = await axios.post('/upload', formData);
      //фиксируем изображение статьи
      setImageUrl(data.url);
    }
    catch (err)
    {
      console.warn(err);
      alert('Ошибка при загрузке файла!');
    }
  };

  //функция удаления изображения из статьи
  const onClickRemoveImage = () => {
    setImageUrl('');  
  };

  //изменяем текстовое содержимое статьи
  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try
    {
      //поле данных для созданной или отредактированной статье
      const fields = {title, imageUrl, tags, text}
      const {data} = isEditing 
        ? await axios.patch(`/articles/${id}`, fields) 
        : await axios.post('/articles', fields);

      const _id = isEditing ? id : data._id;
      //навигация на страницу полной информации по созданной или отредактированной статье
      navigate(`/articles/${_id}`);
    }
    catch (err)
    {
      console.warn(err);
      alert('Error when creating an article!')
    }
  }

  React.useEffect(() => {
    if (id) {
      axios.get(`/articles/${id}`).then(({data}) => {
        //вытаскиваем название статьи с идентификатором id
        setTitle(data.title);
        //вытаскиваем текстовое содержимое статьи с идентификатором id
        setText(data.text);
        //вытаскиваем название изображения в статье с идентификатором id
        setImageUrl(data.imageUrl);
        //вытаскиваем массив тэгов в статье с идентификатором id 
        setTags(data.tags.join(','));
      }).catch(err => {
        console.warn(err);
        alert('Error when receiving the article!')
      })
    }
  }, [id])

  //шаблон options для компонента SimpleMD
  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  //Переходим на исходную страницу если нет авторизованного пользователя
  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />
  }

  return (
    <Paper style={{ padding: 30 }}>
      {/*Загружаем изображение для статьи */}
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Download preview
      </Button>
      <input 
        ref={inputFileRef} 
        type="file" 
        onChange={handleChangeFile} 
        hidden 
      />
      {imageUrl && (
        <>
          {/*Кнопка удаления изображения для статьи */}
          <Button variant="contained" color="error" onClick={onClickRemoveImage} >
            Remove
          </Button>
          {/*Изображение для статьи */}
          <img 
            className={styles.image} 
            src={`http://localhost:4002${imageUrl}`} 
            alt="Uploaded" 
          />
        </>
      )}
      <br />
      <br />
      {/*Поле задания названия статьи */}
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      {/*Поле задания тэгов статьи */}
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      {/*Редактор создания содержания статьи*/}
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        {/*В случае isEditing == true отредактированную статью сохраняем, иначе созданная статья публикуется */}
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Save' : 'Public'} 
        </Button>
        <a href="/">
          <Button size="large">Cancel</Button>
        </a>
      </div>
    </Paper>
  );
};
