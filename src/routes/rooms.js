const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

router.get('/rooms', roomController.getRoomsPage);
router.get('/fetch/rooms', roomController.fetchRooms);
router.get('/api/getMessages', roomController.getMessages)

module.exports = router;
