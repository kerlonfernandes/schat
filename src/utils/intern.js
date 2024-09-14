const crypto = require('crypto');
const config = require('../config/config');

const iv = crypto.randomBytes(16); 

const secretKey = config.secretKey; 

function encrypt(id) {
    const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
    let encrypted = cipher.update(id.toString(), 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
}

function decrypt(encryptedId) {
    const [ivHex, encrypted] = encryptedId.split(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', secretKey, Buffer.from(ivHex, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    return decrypted;
}

module.exports =  {
    decrypt,
    encrypt
}