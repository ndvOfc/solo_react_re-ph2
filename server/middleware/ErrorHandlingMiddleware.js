// Middleware без next() так как на нем прекращается выполнение скрипта
const ApiError = require('../exceptions/ApiError');

// eslint-disable-next-line no-unused-vars
module.exports = function (err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: 'Непредвиденная ошибка' });
};
