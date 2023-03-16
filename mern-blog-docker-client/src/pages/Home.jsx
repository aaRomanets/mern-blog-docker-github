import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Grid from '@mui/material/Grid';

import { Article } from '../components/Article';
import { TagsBlock } from '../components/TagsBlock';
import {
    //вытаскиваем функцию запроса на получение всех статей
    fetchArticles, 
    //вытаскиваем функцию запроса на получение тэгов по последним пяти статьям
    fetchTags    
} from '../redux/slices/articles';

//центральная страница проекта
export const Home = () => {
    const dispatch = useDispatch();

    //используя хук useSelector вытаскиваем данные по автоизованному пользователю если такой пользователь существует
    const userData = useSelector((state) => state.auth.data);

    //вытаскиваем статьи и тэги из store с помощью хука useSelector
    const {articles, tags} = useSelector(state => state.articles);

    //Флаг загрузки статей
    const isArticlesLoading = articles.status === 'loading';

    //Флаг загрузки тэгов
    const isTagsLoading  = tags.status  === 'loading';

    React.useEffect(() => {
        //активируем функцию запроса на получение всех статей
        dispatch(fetchArticles()); 
        
        //активируем функцию запроса на получение тэгов по последним пяти статьям
        dispatch(fetchTags());   
    }, [dispatch]);

    return (
        <Grid container spacing={4}>
            <Grid xs={8} item>
                { (isArticlesLoading ? [...Array(5)] : articles.items).map((obj,index) => (
                isArticlesLoading  ? (
                //статьи грузятся
                    <Article
                        key ={index} 
                        isLoading={true}
                    />
                ) : (
                //все статьи загружены каждую изображаем
                    <Article
                        //идентификатор статьи
                        id={obj._id}           
                        //название статьи                                            
                        title={obj.title}                                                     
                        //изображение статьи
                        imageUrl={obj.imageUrl ? `http://localhost:4002${obj.imageUrl}`: ''}  
                        //данные пользователя, который статью написал
                        user={obj.user}                                                       
                        //время создания статьи
                        createdAt={obj.createdAt}                                              
                        //количество просмотров статьи
                        viewsCount={obj.viewsCount}   
                        //тэги статьи                                      
                        tags={obj.tags ? obj.tags : []}                                        
                        //флаг редактирования статьи, статью редактируем тогда, если ее составил авторизованный пользователь
                        isEditable = {userData?._id === obj.user._id}
                    />
                )
                ))}
            </Grid>
            <Grid xs={4} item>
                {/*Блок иллюстрации загруженных тэгов */}
                <TagsBlock items={tags.items ? tags.items : []} isLoading={isTagsLoading} />
            </Grid>
        </Grid>
    );
};