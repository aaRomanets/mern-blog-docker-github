import React from "react";
import { useDispatch } from "react-redux";
import {Link} from "react-router-dom"
import clsx from "clsx";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Clear';

import EyeIcon from "@mui/icons-material/RemoveRedEyeOutlined";

import styles from "./Article.module.scss";
import { UserInfo } from "../UserInfo";
import {ArticleSkeleton} from './Skeleton';
import { fetchRemoveArticle } from "../../redux/slices/articles";

export const Article = ({
  //идентификатор статьи
  id,
  //название статьи  
  title,
  //Время создания статьи 
  createdAt,
  //Изображение статьи
  imageUrl,
  //информация о пользователе, который создал статью
  user,
  //Количество просмотров статьи
  viewsCount,
  //Тэги статьи
  tags,
  //Флаг просмотра полной информации о статье
  isFullArticle,
  //флаг процесса загрузки статьи 
  isLoading,
  //Флаг редактирования статьи
  isEditable
}) => {

  const dispatch = useDispatch();

  //загружаем шаблон статьи ArticleSkeleton, если флаг загрузки статьи isLoading равен true
  if (isLoading) {
    return <ArticleSkeleton/>
  }

  //кнопка удаления статьи
  const onClickRemove = () => {
    if (window.confirm('Do you really want to delete the article?'))
    {
      //активируем запрос на удаление статьи в случае подтверждения удаления
      dispatch(fetchRemoveArticle(id));
    }
  }

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullArticle })}>
      {/*Флаг редактирования статьи isEditable == true, если статья создана авторизованным пользователем */}
      {isEditable && (
        <div className={styles.editButtons}>
          {/*Кнопка редактирования статьи */}
          <Link to={`/articles/${id}/edit`}>
            <IconButton color="primary">
              <EditIcon/>
            </IconButton>
          </Link>
          {/*Кнопка удаления статьи */}
          <IconButton onClick={onClickRemove} color = "secondary">
            <DeleteIcon/>
          </IconButton>
        </div>
      )}
      {/*Показываем изображение статьи*/}
      {imageUrl && ( 
        <img
          className={clsx(styles.image, { [styles.imageFull]: isFullArticle })}
          src={imageUrl}
          alt={title}
        />
      )}
      <div className={styles.wrapper}>
        {/*Выводим информацию о пользователе, который создал статью и время создания статьи пользователем*/}
        <UserInfo {...user} additionalText={createdAt} />
        <div className={styles.indention}>
          {/*Выводим информацию о пользователе, который создал статью*/}
          <h2 className={clsx(styles.title, { [styles.titleFull]: isFullArticle })}>
            {/*Пишем название статьи, или помимо этого изображаем ссылку на демонстрацию полной информации о статье*/}
            {isFullArticle ? title : <Link to={`/articles/${id}`}>{title}</Link>}
          </h2>
          {/*Показываем тэги статьи*/}
          <ul className={styles.tags}>
            {tags.map((name) => (
              <li key={name}>
                <Link to={`/tag/${name}`}>#{name}</Link>
              </li>
            ))}
          </ul>
	        {/*Счетчик просмотра статьи */}
          <ul className={styles.articleDetails}>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};