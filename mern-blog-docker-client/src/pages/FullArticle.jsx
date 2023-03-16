import React from "react";
import {useParams} from "react-router-dom";
import ReactMarkdown from "react-markdown";
import axios from '../axios';

import { Article } from "../components/Article";

//страница вывода полной информации о статье
export const FullArticle = () => {
  //состояние данных о статье
  const [data, setData] = React.useState();
  //флаг загрузки данных о статье   
  const [isLoading, setLoading] = React.useState(true);
  //идентификатор статьи
  const {id} = useParams();

  React.useEffect(() => {
    //делаем запрос на получение полной информации о статье с идентификатором id
    axios.get(`/articles/${id}`).then(res => {
      setData(res.data);
      //требуемая информация получена
      setLoading(false);
    })
    .catch((err) => {
      console.warn(err);
      alert('Error when receiving the article.')
    })
  }, [id])

  //во время загрузки мы показываем ее шаблон
  if (isLoading) {
    return <Article isLoading={isLoading} isFullArticle />
  }

  return (
    <>
      <Article
        //идентификатор статьи
        id={data._id}
        //название статьи
        title={data.title}
        //изображение статьи
        imageUrl={data.imageUrl ? `http://localhost:4002${data.imageUrl}` : ''}
        //информация о пользователе, который создал статью
        user={data.user}
        //время создания статьи
        createdAt={data.createdAt}
        //количество просмотров статьи
        viewsCount={data.viewsCount}
        //тэги статьи
        tags={data.tags}
        //флаг показа полной информации о статьи
        isFullArticle
      >
        {/*Показываем само текстовое содержимое в статье*/}
        <ReactMarkdown children={data.text} />
      </Article>
    </>
  );
};