var stringToPDU = require('./');

var phoneNumber = '39' + '3421122334'; // internationa prefix, without (+) followed by number.
// check for validity and bits!!!!
console.log(stringToPDU('test', phoneNumber, null, 7));
