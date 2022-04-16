require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const serverConfig = (app) => {
  // Подключаем шаблонизатор
  app.set('views', path.join(process.env.PWD, 'views'));
  app.set('view engine', 'ejs');

  // Подключаем статику
  app.use(express.static('public'));

  // Подключаем cors для получения запросов с клиента,
  // будет необходим в дальнейшем при создании фронта на реакт
  app.use(cors());

  // Подключаем json для работы с json форматом
  app.use(express.json());

  // Подключаем cookie-parser
  app.use(cookieParser());

  // Подключаем urlencoded
  app.use(express.urlencoded({ extended: true }));

  // Подключаем file upload
  app.use(fileUpload({}));
};

module.exports = serverConfig;
