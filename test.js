var stringToPDU = require('./');

var phoneNumber = '39' + '3420000000'; // internationa prefix, without (+) followed by number.
console.log(stringToPDU('test', phoneNumber));