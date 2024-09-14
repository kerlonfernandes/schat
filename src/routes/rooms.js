const express = require('express');
const router = express.Router();
const userController = require('../controllers/roomController');

router.get('/rooms', userController.fetchRooms);

module.exports = router;
