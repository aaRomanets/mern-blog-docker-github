import express from "express";
import multer from 'multer';
import bodyParser from "body-parser";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

import { 
    //функция проверки данных по регистрации пользователя
    registerValidation, 
    //функция проверки данных по авторизации пользователя
    loginValidation, 
    //функция проверки данных для созданию статьи авторизованным пользователем
    articleCreateValidation 
} from './validations.js';

import {
	handleValidationErrors, 
 	//функция проверки существования токена авторизованного пользователя
	checkAuth
} from './utils/index.js';

import {
	//контроллер который отвечает за операции с пользовательскими данными
	UserController, 
	//котроллер который отвечает за операции со статьями
	ArticleController
} from './controllers/index.js';

//external imports
import mongoose from "mongoose";

//подключаем базу данных Mongo DB
mongoose.connect(process.env.MONGODB_URI != undefined ? process.env.MONGODB_URI : "mongodb://127.0.0.1:27017" , {
  dbName: process.env.DB_NAME != undefined ? process.env.DB_NAME : "mern-blog",
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
.then(() => {
  console.log('Mongodb connected....');
})
.catch(err => console.log(err.message));

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to db...');
});

mongoose.connection.on('error', err => {
  console.log(err.message);
});

const app = express();
app.use(bodyParser.json())
//определяем компонент cors с помощью которого будем отправлять необходимые запросы с клиент-приложения
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send({
        db : process.env.DB_NAME
    });
})

//механизм сохранения изображения в статье в отдельной папке
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({storage});
app.use('/uploads',express.static('uploads'));

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
});

//маршрутизатор авторизации пользователя
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
//маршрутизатор регистрации пользователя
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
//маршрутизатор получения данных по авторизованному пользователю, если зафиксирован токен авторизованного пользователя
app.get('/auth/me', checkAuth, UserController.getMe);

//маршрутизатор получения последних тэгов из базы данных ArticleModel по последним пяти статьям
app.get('/tags',  ArticleController.getLastTags);
//маршрутизатор получения всех статей из базы данных ArticleModel
app.get('/articles', ArticleController.getAll);

//маршрутизатор получения одной статьи с идентификатором articleId
app.get('/articles/:id', ArticleController.getOne);
//маршрутизатор получения одной статьи с идентификатором articleId
app.post('/articles', checkAuth, articleCreateValidation, handleValidationErrors, ArticleController.create);
//маршрутизатор удаления статьи
app.delete('/articles/:id', checkAuth, ArticleController.remove);
//маршрутизатор редактирования статьи
app.patch('/articles/:id',checkAuth, articleCreateValidation, handleValidationErrors, ArticleController.update);

//функция подключения к базе данных postgress и запуска сервера
const port = process.env.PORT || 3002;
const start =  () => {
    try 
    {
        //прослушиваем сервер
        app.listen(port, () => console.log(`Server started on port ${port}`));
    }
    catch (e) 
    {
        console.log(e);
    }
} 

//активируем функцию подключения к базе данных postgress и запуска сервера
start();