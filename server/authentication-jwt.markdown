# JWT Authorization

### Consistent

- Header - simply string with data
- Payload - main information about user(email, password, etc.)
- Signature - secret key for 

### Access token

- Expires 15-20 min
- Usage for access to service
- Storage in localstorage

### Refresh token

- Expires 15-60 days
- Usage for update access token
- Storage in httpOnly cookie !!!

### Create services folder

## Start
- install web token and bcrypt
```
npm i jsonwebtoken bcrypt
```
## Create routes endpoints
```
const router = require('express').Router();
const userController = require('../controllers/userController');

// Роут для регистрации
router.post('/registration', userController.registration);

// Роут для логина
router.post('/login', userController.login);

// Роут для лога аута
router.post('/logout', userController.login);

// Роут для хранения ссылки на активацию
router.get('/activate/:link', userController.activate);

// Роут для обновления токена
router.get('/refresh', userController.refresh);

// Роут для проверки получения пользователя если пользователь авторизован
router.get('/users', userController.getUsers);

module.exports = router;
```

## Create services (for separately logic)
- /services
  - /userService
  - /tokenService
  - /mailService
## Create dtos (data transfer object service) ??
  - In dtos we storage user common data available for cookie(and doesnt storage any confidential info - password etc.)
  - user DTO file example:
```
// в класс dto передаем ту информацию которую будем хранить в payload
module.exports = class UserDto {
  id;

  name;

  email;

  isActivated;

  // принимает модель и достает необходимую информацию
  constructor(model) {
    this.id = model.id;
    this.name = model.name;
    this.email = model.email;
    this.isActivated = model.isActivated;
  }
};
```
## *Option, send mail with link for activation 

- Install nodemailer
```
npm i nodemailer
```
- ### Config mail service class (/services/mailService.js)
```
// Сервис для отправки писем
const nodemailer = require('nodemailer');

class MailService {
  // в конструкторе создаем функцию отправки писем и прописываем конфигурацию
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Ссылка на активацию аккаунта на ${process.env.API_URL}`,
      text: '',
      html:
          `
          <div>
                <h1>Активируйте Ваш аккаунт</h1>
                <a href="${link}">${link}</a>
          </div>>
          `,
    });
  }
}

module.exports = new MailService();
```
## CREATE USER SERVICE class
- userService will separate logic from userController
- example consistent:
  - registration
  - login
  - logout
  - ...
```
### !
### ! insert when it's done
```


## Create user controller ()
```
### !
### ! insert when it's done
```

## Validation data
- install express validator
```
npm i express-validator
```
- connect validator in usage rout
```
const { body } = require('express-validator');

// Роут для регистрации
router.post(
  '/registration',

  // валидация почты
  body('email').isEmail(),

  // валидация пароля
  body('password').isLength({ min: 3, max: 20 }),
  userController.registration,
);
```
- connect validation errors result in controller
- use api errors for describing errors
```
const { validationResult } = require('express-validator');

// errors will contain array with errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.badRequest('Недопустимый логин или пароль', errors.array()));
      }
```
## Middleware for auth checking
- create auth check middleware
