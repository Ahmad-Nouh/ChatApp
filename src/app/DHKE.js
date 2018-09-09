const bigInteger = require('big-integer');
const forge = require('node-forge');

/**
 * 
 * @param {string} prime The prime defining key space
 * @param {string} primitiveRoot A primitive root to the prime P
 * @param {number} base Base of the provided prime and primitiveRoot 
 */
function DHKE(prime, primitiveRoot) {
    this.prime = prime
    this.primitiveRoot = primitiveRoot
    this.privateKey = null;
    this.publicKey = null;
}

DHKE.prototype.GetPublicKey = function (radix = 10) {
    return bigInteger(this.publicKey).toString(radix);
}
module.exports.GetPublicKey = this.GetPublicKey;

/**
 * 
 * @param {number} bitsCount
 * @param {function} callback
 */
DHKE.prototype.GenerateKeys = function (bitsCount, callback) {
    let caller = this;
    forge.prime.generateProbablePrime(bitsCount, function (err, num) {
        caller.privateKey = num.toString();
        let p = bigInteger(caller.prime);
        let g = bigInteger(caller.primitiveRoot);
        let privateKey = bigInteger(caller.privateKey);
        caller.publicKey = g.modPow(privateKey, p).toString();
        callback(this.publicKey);
    });
}
module.exports.GeneratePrivateKey = this.GeneratePrivateKey;

/**
 * 
 * @param {string} otherPublicKey must be decimal encoded
 * @returns The shared secret
 */
DHKE.prototype.ComputeSecret = function (otherPublicKey, radix = 10) {
    try {
        otherPublicKey = bigInteger(otherPublicKey);
        return secret = otherPublicKey.modPow(bigInteger(this.privateKey), bigInteger(this.prime)).toString(radix);
    } catch (err) {
        return null;
    }
}
module.exports.ComputeSecret = this.ComputeSecret;

module.exports = {
    DHKE
};