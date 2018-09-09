const path = require('path');
const http = require('http');
const fs = require('fs');
const express = require('express');
const socketIO = require('socket.io');
const user = require('./User.js');
const storingStream= require('./StoringStream');
const ArrayFunctions = require('../Functionality_Modules/ArrayFunctionalities.js');
const validation = require('../Functionality_Modules/Validation');
const port = process.env.PORT || 3000;
const bcrypt=require('bcryptjs');
const crypto=require('crypto');
const info=require('./Info');
const groupChat=require('./GroupChat');
const encrypt=require('./Encryption');
const forge=require('node-forge')
const bigInteger=require('big-integer');

// var app = express();
// var server = http.createServer(app);

// // info.Initialize();
// // user.Create({firstName:'omar', lastName:'malass',username:'omarMalass',password:'123'});
// // user.Create({firstName:'ahmed',lastName:'treez', username:'A6eez',     password:'123'});
// // user.Create({firstName:'ibrah',lastName:'nouh', username:'nouhAbo',    password:'123'});

// // groupChat.Create('Pink Mloyd',['omarMalass','A6eez','nouhAbo'],'omarMalass');

// // user.Create({firstName:'ahmed', lastName:'hritani',username:'hariout',password:'123'});
// // groupChat.AddMember('000000000000002','hariout');

// // groupChat.RemoveMember('000000000000002','hariout');



// generate a random prime using Web Workers (if available, otherwise
// falls back to the main thread)
// var bits = 1024;
// var options = {
//   algorithm: {
//     name: 'PRIMEINC',
//     workers: -1 // auto-optimize # of workers
//   }
// };
// forge.prime.generateProbablePrime(bits, options, function(err, num) {
//   console.log('random prime', num.toString(16));
// });


// Diffie Hellman key exchange

let p='28401819833194672263220074318568239913240629340614134316461681527129740019027636140757831311994994015520845027759059625513302448313286023126833646854375714585166906088183885663794080097340936198896766766884824330230759478149039933887325452487112982841213248410034360015394086822849244377174119550162391805753160443942786972164502798968834306898412366478501193632735671379046936711103109794947330946532917273199501039484827099108375018229688415849095088940888827138097109161920916553046346980025794170405481748159364908074147471432142208410109519997658710147759474207550469840261684005212634493995003979085986141372247';
let g='2';

const DHKE=require('./DHKE');

let alice=new DHKE.DHKE(p,g,10);
let bob=new DHKE.DHKE(p,g,10);

alice.GenerateKeys(1024,function(){
     bob.GenerateKeys(1024,function(){
         let secret1=alice.ComputeSecret(bob.GetPublicKey(10),16);
         let secret2=bob.ComputeSecret(alice.GetPublicKey(10),16);

         let message ="Hello there my son";
         let encrypted=encrypt.Encrypt(message,secret1);
         let decrypted=encrypt.Decrypt(encrypted,secret2);

         console.log(encrypted);
         
         console.log(decrypted);
     });
});

