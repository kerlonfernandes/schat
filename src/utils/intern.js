const crypto = require('crypto');
const config = require('../config/config');

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048, // Tamanho da chave
    publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
});

function encrypt(text) {
    return text;
}

function decrypt(encryptedText) {
    return encryptedText;
}

module.exports =  {
    decrypt,
    encrypt
}