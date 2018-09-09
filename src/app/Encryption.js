const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const bigInteger = require('big-integer');
const forge = require('node-forge');
const SHA256=crypto.createHash('sha256');
const saltGenRounds = 10;

//Server Side

function HashPassword(password) {
    try {
        let salt = bcrypt.genSaltSync(saltGenRounds);
        let hashResult = bcrypt.hashSync(password, salt);
        return hashResult;
    }
    catch (err) {
        return null;
    }
}

function CheckPassword(password, storedHash) {
    try {
        return bcrypt.compare(password, storedHash);
    }
    catch (err) {
        return null;
    }
}

//Client Side

const ENCRYPTION_KEY_LENGTH = 16; // Must be 128 bytes (16 characters)
const IV_LENGTH = 16; // For AES, this is always 16

/**
 * 
 * @param {string} text Plaintext to encrypt 
 * @param {string} key  Encryption key, must be 128 bytes
 */
function Encrypt(text, key) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let hash=crypto.createHash('sha256');
        hash.update(key);
    let keyHash = hash.digest().slice(0,16);
    let cipher = crypto.createCipheriv('aes-128-cbc', keyHash, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + encrypted.toString();
}

function Decrypt(data, key) {
    let dataLength = data.length;
    let iv = Buffer.from(data.substring(0, IV_LENGTH * 2), 'hex');
    let hash=crypto.createHash('sha256');
        hash.update(key);
    let keyHash = hash.digest().subarray(0,16);
    let cipherText = data.substring(IV_LENGTH * 2, dataLength);
    let decipher = crypto.createDecipheriv('aes-128-cbc', keyHash, iv);
    let decrypted = decipher.update(cipherText, 'hex', 'utf8');
    decrypted += decipher.final();

    return decrypted;
}



module.exports = {
    HashPassword, Encrypt, Decrypt
};