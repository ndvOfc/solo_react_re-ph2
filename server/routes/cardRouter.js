const router = require('express').Router();
const cardController = require('../controllers/cardController');

// Роут для создания карточек
router.post('/', cardController.create);

// Роут для получения карточек
router.get('/', cardController.getAll);

// Роут для изменения карточек
router.put('/:id', cardController.update);

// Роут для удаления карточек
router.delete('/:id', cardController.delete);

module.exports = router;
