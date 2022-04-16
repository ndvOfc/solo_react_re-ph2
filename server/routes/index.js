//! ГЛАВНЫЙ API РОУТЕР
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
