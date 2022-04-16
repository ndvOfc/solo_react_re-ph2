const router = require('express').Router();

router.get('/', (req, res) => res.render('index', { title: 'Project', instruction: 'USE POSTMAN FOR USING THIS SUPER SITE' }));

module.exports = router;
