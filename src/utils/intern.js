const crypto = require('crypto');
const config = require('../config/config');

const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048, // Tamanho da chave
    publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs1', format: 'pem' }
});

function encrypt(text) {
    return crypto.publicEncrypt(publicKey, Buffer.from(text)).toString('base64');
}

function decrypt(encryptedText) {
    return crypto.privateDecrypt(privateKey, Buffer.from(encryptedText, 'base64')).toString('utf8');
}


module.exports =  {
    decrypt,
    encrypt
}