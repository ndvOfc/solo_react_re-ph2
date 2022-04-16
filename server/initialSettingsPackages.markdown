# SERVER
- Express
- Postgres
- JW Token
- Cors
- .env

## Initialize project
```
npm init -y
```
## Install initial packages
```
npm i express pg pg-hstore sequelize cors dotenv cookie-parser

```
## Install dev Dependencies & gitignore
```
npm i -D eslint nodemon

npx eslint --init

npx create-gitignore node

```
## Create environment .env
```
PORT=3000
DB_NAME=project_database
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
```
## Create main app.js
```
// Обязательно подключаем конфигурацию окружения в самом начале!
require('dotenv').config();
const express = require('express');

const app = express();

serverConfig(app)

const PORT = process.env.PORT ?? 5000;

// Функция запуска сервера с обработчиком ошибки
const startServer = () => {
  try {
    app.listen(PORT, () => console.log(`>>>> Server started at ${PORT} port <<<<`));
  } catch (e) {
    console.log(e);
  }
};

startServer();
```
## Create server config file and connect it to main app.js
```
require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const serverConfig = (app) => {
  app.set('view engine', 'hbs');

  // Подключаем статику
  app.use(express.static('public'));

  // Подключаем cors для получения запросов с клиента
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

```


## Create database connect file (db/db.js)
```
require('dotenv').config();
const { Sequelize } = require('sequelize');

module.exports = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  },
);
```
## Create DB models (db/models/models.js)
- Create all table models and relations among theirs
- Exports all models
- add sequelize.sync() in start function for creat db

### DB controller

- for run commands package json, need to install make-runnable
```
npm i make-runnable
```
- for simply seeding install falso (if you need)
```
 npm i @ngneat/falso
```
- for falso pull necessary methods
```
const { randPassword, randEmail, randFullName } = require('@ngneat/falso');
```
- create db controller 
```
require('dotenv').config();

// connect necessary methods from falso for seeding
const { randPassword, randEmail, randFullName } = require('@ngneat/falso');
const sequelize = require('../db');
const {
  User, Favorite, FavoriteItem, Item, Card, Tag, Rating, CardTag, ItemInfo,
} = require('../models/models');

module.exports = {
  // sync database
  syncDb: async () => await sequelize.sync(),

  // force sync database (! destroy all data in tables)
  syncDbForce: async () => await sequelize.sync({ force: true }),

  // no comments)))
  dropDb: async () => await sequelize.drop(),

  // seeder (you can choose quantity in script)
  seedDb: async (amount) => {
    while (amount--) {
      await User.create({
        name: randFullName(),
        email: randEmail(),
        password: randPassword(),
      });
    }
  },
};
// !necessary for running functions separately 
require('make-runnable');
```
## Create scripts for dbController in package.json
```
    "db-sync": "node db/db_controllers/dbController.js syncDb",
    "db-sync-f": "node db/db_controllers/dbController.js syncDbForce",
    "db-seed": "node db/db_controllers/dbController.js seedDb 10",
    "db-drop": "node db/db_controllers/dbController.js dropDb"
```


## Connect cors and json to main app (for requests from browser)
```
 const cors = require('cors')

 app.use(cors());
 app.use(express.json());
```

# CREATE STRUCTURE
### Routing
- Create routes
- Structure must be:
  - /routes
    - index.js route as main route
      - on every handle create router (ex. userRouter, itemRouter etc.)

### Main route example:
```
//! ГЛАВНЫЙ РОУТЕР
const router = require('express').Router();
const cardRouter = require('./cardRouter');
const itemRouter = require('./itemRouter');
const tagRouter = require('./tagRouter');
const userRouter = require('./userRouter');

router.use('/user', userRouter);
router.use('/card', cardRouter);
router.use('/tag', tagRouter);
router.use('/item', itemRouter);

module.exports = router;
```
### Route example:
```
const router = require('express').Router();

// Роут для создания карточек
router.post('/');

// Роут для получения карточек
router.get('/');

// Роут для изменения карточек
router.put('/');

// Роут для удаления карточек
router.delete('/');

module.exports = router;
```
## CREATE CONTROLLERS (for separate logic)
- create controllers folder
- create controllers using classes, export controllers to respectively routes and using them in methods
###example user controller:
```
class UserController {
  async registration(req, res) {

  }

  async login(req, res) {

  }

  async check(req, res) {

  }
}

module.exports = new UserController();
```
###example user routes using user controller:
```
const router = require('express').Router();
const userController = require('../controllers/userController');

// Роут для регистрации
router.post('/registration', userController.registration);

// Роут для логина
router.post('/login', userController.login);

// Роут для проверки авторизации пользователя
router.get('/auth', userController.check);

module.exports = router;
```
### CREATE Middleware and api for error handling
- exception folder > ApiError.js :
```
class ApiError extends Error {
  constructor(status, message, errors = []) {
    super();
    // eslint-disable-next-line no-unused-expressions
    this.status = status;
    this.message = message;
    this.errors = errors;
  }

  static unAuthorized(message) {
    return new ApiError(401, message);
  }

  static badRequest(message, errors = []) {
    return new ApiError(404, message, errors);
  }

  static internal(message) {
    return new ApiError(500, message);
  }

  static forbidden(message) {
    return new ApiError(403, message);
  }
}

module.exports = ApiError;
```
- Middleware for errors:
```
const ApiError = require('../error/apiError');

module.exports = function (err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({ message: 'Непредвиденная ошибка' });
};

```
- After create error exception and middleware, use next in controller

## CONNECT Controllers to routes
- example - usage controllers in route:
```
const router = require('express').Router();
const cardController = require('../controllers/cardController');

// Роут для создания карточек
router.post('/', cardController.create);

// Роут для получения карточек
router.get('/', cardController.getAll);

// Роут для изменения карточек
router.put('/');

// Роут для удаления карточек
router.delete('/');

module.exports = router;

```
### UPLOAD files from req.files
- install express-fileupload
- install uuid for uniq files names
```
npm i express-fileupload uuid
```
- code example:
```
const { image } = req.files;
const fileName = `${uuid.v4()}.jpg`;
  // Перемещаем файл в нужную папку
image.mv(path.resolve(process.env.PWD, 'public', 'img', fileName));
```
#### Connect file-upload to main app.js
```
const fileUpload = require('express-fileupload')

app.use(fileUpload({}))
```
#### Connect uuid to controller where use

# JWT Authorization



















Install consolidate and swig to your directory.

 npm install consolidate
 npm install swig
add following lines to your app.js file

var cons = require('consolidate');

// view engine setup
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
add your view templates as .html inside “views” folder. Restart you node server and start the app in the browser.
