exports.setSession = (req, res) => {
    req.session.user = 'someUser'; 
    console.log('Sessão definida');

    // Resposta ao cliente
    res.send('Sessão foi definida');
};
