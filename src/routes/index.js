const express = require('express');
const path = require('path'); // Importa o módulo 'path'
const router = express.Router();

// Define routes here
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/index.html'));
});

module.exports = router;
