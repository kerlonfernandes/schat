const crypto = require('crypto');

const mysql_config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'schat'
}

const secretKey = crypto.randomBytes(32); 

module.exports =  {
    mysql_config,
    secretKey
}