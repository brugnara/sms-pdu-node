// this code was originally written by Swen-Peter Ekkebus and Andrew Alexander.

//Array with "The 7 bit defaultalphabet"
var sevenbitdefault = ['@', '£', '$', '¥', 'è', 'é', 'ù', 'ì', 'ò', 'Ç', '\n', 'Ø', 'ø', '\r','Å', 'å','\u0394', '_', '\u03a6', '\u0393', '\u039b', '\u03a9', '\u03a0','\u03a8', '\u03a3', '\u0398', '\u039e','€', 'Æ', 'æ', 'ß', 'É', ' ', '!', '"', '#', '¤', '%', '&', '\'', '(', ')','*', '+', ',', '-', '.', '/', '0', '1', '2', '3', '4', '5', '6', '7','8', '9', ':', ';', '<', '=', '>', '?', '¡', 'A', 'B', 'C', 'D', 'E','F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S','T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Ä', 'Ö', 'Ñ', 'Ü', '§', '¿', 'a','b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o','p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'ä', 'ö', 'ñ','ü', 'à'];

function phoneNumberMap(character) {
  //	return character;
  if ((character >= '0') && (character <= '9')) {
    return character;
  }
  switch (character.toUpperCase()) {
    case '*':
      return 'A';
    case '#':
      return 'B';
    case 'A':
      return 'C';
    case 'B':
      return 'D';
    case 'C':
      return 'E';
//		case '+':
//			return '+'; // An exception to fit with current processing ...
    default:
      return 'F';
  }
}

function toHex(i) {
  var sHex = "0123456789ABCDEF";
  var out = "";
  out = sHex.charAt(i&0xf);
  i>>=4;
  out = sHex.charAt(i&0xf) + out;
  return out;
}

// function to convert a integer into a bit String
function intToBin(x,size) {
  //sp
  var base = 2;
  var num = parseInt(x);
  var bin = num.toString(base);
  for (var i=bin.length;i<size;i++) {
    bin = "0" + bin;
  }
  return bin;
}

// function te convert a bit string into a integer
function binToInt(x) {
  //sp
  var total = 0;
  var power = parseInt(x.length) - 1;
  for (var i=0;i<x.length;i++) {
    if(x.charAt(i) == '1') {
      total = total +Math.pow(2,power);
    }
    power --;
  }
  return total;
}

//function to convert integer to Hex
function intToHex(i) {
  // sp
  var sHex = "0123456789ABCDEF";
  var h = "";
  i = parseInt(i);
  for (var j = 0; j <= 3; j++) {
    h += sHex.charAt((i >> (j * 8 + 4)) & 0x0F) + sHex.charAt((i >> (j * 8)) & 0x0F);
  }
  return h.substring(0,2);
}

// function to convert semioctets to a string
function semiOctetToString(inp) {
  // sp
  var out = "";
  for (var i=0;i<inp.length;i=i+2) {
    var temp = inp.substring(i,i+2);
    out = out + phoneNumberMap(temp.charAt(1)) + phoneNumberMap(temp.charAt(0));
  }
  return out;
}

function getSevenBit(character) {
  // sp
  for (var i=0;i<sevenbitdefault.length;i++) {
    if(sevenbitdefault[i] == character) {
      return i;
    }
  }
  // alert("No 7 bit char for " + character);
  return 0;
}

function getEightBit(character) {
  return character;
}

function get16Bit(character) {
  return character;
}

function stringToPDU(inpString, phoneNumber, smscNumber, bitSize, mclass, valid, receipt) {
  // AJA fixed SMSC processing
  var octetFirst = "";
  var octetSecond = "";
  var output = "";
  var i;
  var firstOctet; // = "1100";
  var REIVER_NUMBER_FORMAT = "81"; // national
  var REIVER_NUMBER_LENGTH;
  var PROTO_ID = "00";
  var DCS = 0;
  var VALID_PERIOD = ""; // AA
  var REIVER_NUMBER;
  var DATA_ENCODING;
  var userDataSize;
  var current;
  var currentOctet;
  //Make header
  var SMSC_INFO_LENGTH = 0;
  var SMSC_LENGTH = 0;
  var SMSC_NUMBER_FORMAT = "";
  var SMSC = "";
  if (!bitSize) {
    bitSize = 8;
  }
  if (smscNumber) {
    SMSC_NUMBER_FORMAT = "81"; // national
    if (smscNumber[0] == '+') {
      SMSC_NUMBER_FORMAT = "91"; // international
      smscNumber = smscNumber.substr(1);
    } else {
      if (smscNumber[0] !='0') {
        SMSC_NUMBER_FORMAT = "91"; // international
      }
    }

    if (smscNumber.length%2 != 0) {
      // add trailing F
      smscNumber += "F";
    }

    SMSC = semiOctetToString(smscNumber);
    SMSC_INFO_LENGTH = ((SMSC_NUMBER_FORMAT + "" + SMSC).length)/2;
    SMSC_LENGTH = SMSC_INFO_LENGTH;

  }
  if (SMSC_INFO_LENGTH < 10) {
    SMSC_INFO_LENGTH = "0" + SMSC_INFO_LENGTH;
  }

  if (receipt) {
    if (valid) {
      firstOctet = "3100"; // 18 is mask for validity period // 10 indicates relative
    } else {
      firstOctet = "2100";
    }
  } else {
    if (valid) {
      firstOctet = "1100";
    } else {
      firstOctet = "0100";
    }
  }

  if (phoneNumber[0] == '+') {
    REIVER_NUMBER_FORMAT = "91"; // international
    phoneNumber = phoneNumber.substr(1); //,phoneNumber.length-1);
  } else {
    if (phoneNumber[0] != '0') {
      REIVER_NUMBER_FORMAT = "91"; // international
    }
  }
  REIVER_NUMBER_LENGTH = intToHex(phoneNumber.length);
  if(phoneNumber.length%2 != 0) {
    // add trailing F
    phoneNumber+= "F";
  }

  REIVER_NUMBER = semiOctetToString(phoneNumber);
  if ([0, 1, 2, 3].indexOf(mclass) !== -1) {
    // AJA
    DCS = mclass | 0x10;
  }

  switch(bitSize) {
    case 7:
      break;
    case 8:
      DCS = DCS | 4;
      break;
    case 16:
      DCS = DCS | 8;
      break;
  }
  DATA_ENCODING = intToHex(DCS);
//	var DATA_ENCODING = "00"; // Default
//	if (bitSize == 8)
//	{
//		DATA_ENCODING = "04";
//	}
//	else if (bitSize == 16)
//	{
//		DATA_ENCODING = "08";
//	}

  if (valid) {
    VALID_PERIOD = intToHex(valid); // AA
  }
  switch (bitSize) {
    case 7:
      userDataSize = intToHex(inpString.length);

      for (i=0;i<=inpString.length;i++) {
        if (i==inpString.length) {
          if (octetSecond != "") {
            // AJA Fix overshoot
            output = output + "" + (intToHex(binToInt(octetSecond)));
          }
          break;
        }
        current = intToBin(getSevenBit(inpString.charAt(i)),7);
        if (i!=0 && i%8!=0) {
          octetFirst = current.substring(7-(i)%8);
          currentOctet = octetFirst + octetSecond;	//put octet parts together
          output+= "" + (intToHex(binToInt(currentOctet)));
          octetSecond = current.substring(0,7-(i)%8);	//set net second octet
        } else {
          octetSecond = current.substring(0,7-(i)%8);
        }
      }
      break;
    case 8:
      userDataSize = intToHex(inpString.length);
      var CurrentByte = 0;
      for (i=0;i<inpString.length;i++) {
        CurrentByte = getEightBit(inpString.charCodeAt(i));
        output = output + "" + ( toHex( CurrentByte ) );
      }
      break;
    case 16:
      userDataSize = intToHex(inpString.length * 2);
      var myChar = 0;
      for (i = 0; i < inpString.length; i++) {
        myChar = get16Bit(inpString.charCodeAt(i));
        output = output + "" + ( toHex((myChar & 0xff00) >> 8)) + ( toHex(myChar & 0xff) );
      }
      break;
  }
  var header = SMSC_INFO_LENGTH + SMSC_NUMBER_FORMAT + SMSC + firstOctet + REIVER_NUMBER_LENGTH + REIVER_NUMBER_FORMAT + REIVER_NUMBER +  PROTO_ID + DATA_ENCODING + VALID_PERIOD + userDataSize;

  /*
  console.log('HEADER:', SMSC_INFO_LENGTH, SMSC_NUMBER_FORMAT, SMSC, firstOctet, REIVER_NUMBER_LENGTH, REIVER_NUMBER_FORMAT,
      REIVER_NUMBER, PROTO_ID, DATA_ENCODING, VALID_PERIOD, userDataSize);
  */

  // console.log('OUTPUT:', output);

  var PDU = header + output;
  var AT = "AT+CMGS=" + (PDU.length/2 - SMSC_LENGTH - 1) ; // Add /2 for PDU length AJA - I think the SMSC information should also be excluded

//	var bStep=18;
//	for(var breakUp=1;breakUp*bStep < PDU.length;breakUp++)
//	{
//		PDU = PDU.substr(0,breakUp*bStep+breakUp-1) + " " + PDU.substr(breakUp*bStep+breakUp-1);
//	}

  //CMGW
  return {
    command: AT,
    pdu: PDU
  };
}

module.exports = stringToPDU;