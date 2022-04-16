const router = require('express').Router();
const itemController = require('../controllers/itemController');

// Отправка айтема
router.post('/', itemController.create);

// Получение всех айтемов
router.get('/', itemController.getAll);

// Получение одного айтема
router.get('/:id', itemController.getOne);

// Изменение айтема
router.put('/:id', itemController.update);

// Удаление айтема
router.delete('/:id', itemController.delete);

module.exports = router;
