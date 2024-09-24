const path = require('path');
const UserModel = require('../models/userModel'); 

exports.getLogin = (req, res) => {
    UserModel.getUserById(1, (err, user) => {
        if (err) {
            console.error('Erro:', err);
        } else {
            console.log('Usuário encontrado:', user);
        }
    });

    // res.sendFile(path.join(__dirname, '../../public/views/login.html'));
};

exports.getSignup = (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/views/signup.html'));
};

exports.postLogin = (req, res) => {
    const { username, password } = req.body;
    console.log('Usuário tentou logar:', username);
    res.redirect('/dashboard');
};

exports.postSignup = async (req, res) => {
    const { username, email, password } = req.body;
    try {

        let userModel = new UserModel();

        console.log('Dados recebidos:', req.body);

        // const existingUserResult = await userModel.select('SELECT * FROM users WHERE email = ?', [email]);

        // if (existingUserResult.results.length > 0) {
        //     console.log('Usuário já existe:', email);
        //     await userModel.disconnect(); 
        //     return res.status(400).send('Usuário já existe');
        // }

        await userModel.createUser(username, email, password);
        console.log('Novo usuário criado:', username);

        
        // await userModel.disconnect(); 
        // res.redirect('/login');
    } catch (err) {
        console.error('Erro ao criar usuário:', err);
        res.status(500).send('Erro interno do servidor');
    }
};
