const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

router.get('/chat/:id', indexController.getIndex);

module.exports = router;
