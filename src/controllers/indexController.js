const path = require('path');

exports.getIndex = (req, res) => {

    const id = req.params.id;

    res.sendFile(path.join(__dirname, '../../public/views/chat.html'));

};

exports.signup = (req, res) => {

    res.sendFile(path.join(__dirname, '../../public/views/signup.html'));

};
