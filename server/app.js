/* eslint-disable */
// Обязательно подключаем конфигурацию окружения в самом начале!
// noinspection JSIgnoredPromiseFromCall

require('dotenv').config();
const express = require('express');
const sequelize = require('./db/db');
const routerApi = require('./routes/index');
const routerViews = require('./routes/viewRouting')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const serverConfig = require('./server_config/serverConfig')

const PORT = process.env.PORT ?? 5000;

const app = express();

serverConfig(app)

// Подключаем основные роуты через
app.use('/api', routerApi)
app.use('/', routerViews)

// Middleware для обработки ошибок обязательно должен быть в самом конце
app.use(errorHandler)

// Функция запуска сервера с обработчиком ошибки
const startServer = async () => {
  try {
    await sequelize.authenticate(); // Проверяем подключение к БД
    app.listen(PORT, () => console.log(`>>>> Server started at ${PORT} port <<<<`));
  } catch (e) {
    console.log(e);
  }
};

startServer()
