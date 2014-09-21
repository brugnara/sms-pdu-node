sms-pdu-node
============

This tool is very useful for conversion of a text into a PDU, ready for sending an SMS through a 3g modem.

# Thanks to..

Before all, I want to thank [Swen-Peter Ekkebus](http://www.linkedin.com/in/ekkebus) and [Andrew Alexander](http://www.linkedin.com/in/andrewalexander)
for the initial work they published on [this web site](http://rednaxela.net/pdu.php).

I've cleaned and refactored the code, to be able to work into a nodejs application. I'll work on bug fixes and improvements
in future releases.

# How to use.

You should be able to run `node test.js` and view a working example.

## Example

```bash
npm install sms-pdu-node
```

```js
var pdu = require('sms-pdu-node');

console.log(pdu('ciao', '393420011223')); // defaults to 8 bit

console.log(pdu('ciao', '393420011223', null. 7)); // 7 bit!
```

# How to send a PDU message

```bash
screen /dev/ttyUSB0 9600
AT+CMGS=XX   # XX is the lenght of the PDU message we are sending. Take output obtained from this module!
> PASTE PDU output and press ^Z
```

This should output something like this:

```
+CMGS: 16

OK
```
