const router = require('express').Router();
const tagController = require('../controllers/tagController');

// Роут для создания тэгов
router.post('/', tagController.create);

// Роут для получения тэгов
router.get('/', tagController.getAll);

// Роут для изменения тэгов
router.put('/');

// Роут для удаления тэгов
router.delete('/:id');

module.exports = router;
