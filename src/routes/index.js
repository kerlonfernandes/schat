const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

router.get('/chat/:id', indexController.getIndex);
router.get('/signup', indexController.signup);



module.exports = router;
