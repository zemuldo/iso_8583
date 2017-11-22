# iso_8583

This is a javascript library that does message conversion between a system and an interface that accepts iso8583 message requests and send [ISO 8583 Financial transaction card originated messages](https://en.wikipedia.org/wiki/ISO_8583) responses.

# Usage: Bitmap Messaging

##  Install from npm using

```
npm install --save iso_8583

```

##  Import the library using:

```javascript
const iso8583 = require('iso_8583');
let data = {
    0: "0100",
    2: "4761739001010119",
    3: "000000",
    4: "000000005000",
    7: "0911131411",
    12: "131411",
    13: "0911",
    14: "2212",
    18: "4111",
    22: "051",
    23: "001",
    25: "00",
    26: "12",
    32: "423935",
    33: "111111111",
    35: "4761739001010119D22122011758928889",
    41: "12345678",
    42: "MOTITILL_000001",
    43: "My Termianl Business                    ",
    49: "404",
    52: "7434F67813BAE545",
    56: "1510",
    123: "91010151134C101",
    127: "000000800000000001927E1E5F7C0000000000000000500000000000000014A00000000310105C000128FF0061F379D43D5AEEBC8002800000000000000001E0302031F000203001406010A03A09000008CE0D0C840421028004880040417091180000014760BAC24959"
};

let isopack = new iso8583(data);
```

> **!IMPORTANT**
>
>The library extends fields 127 and fields 127.25 to their sub fields.    
>If you are handling a json with field 127 or 127.25 as one string, the bitmap must be 16 character string then a 4 digit number indicating the length
>In the above case the library will expand them.    
>If they are already broken down to subfields, nothing changes.    
>To invoke the package initialize with the iso8583 json or object as argument. If the json contains any fields not defined in iso8583 or has no field 0, the error is returned in an object.    
>If you want to handle xml iso 8583 messages, the usage is described down there.    


The object initialized has the following methods:

To validate the iso message

```javascript
isopack.validateMessage();  // returns true for valid message or error

```


To get the mti as a string:
```javascript
isopack.getMti(); // returns a 4 byte buffer containing the mti

```

To get the bitmaps in binary:

```javascript
isopack.getBmpsBinary(); // returns a string '1111001000111..' or an error object with error prop

```


To get the bitmaps in hex for fields 0-127, fields 127 extensions and  fields 127.25 extensions

```javascript
isopack.getBitMapHex();             // returns 'f23c46c1a8e091000000000000000022'
isopack.getBitMapHex_127_ext();     // returns '8000008000000000'
isopack.getBitMapHex_127_ext_25();  // returns 'fe1e5f7c00000000'

// in case of error, the error object returned with error prop
```


To get a buffer tcp message to send to the ISO 8584 Interface:

```javascript
let bufferMessage = isopack.getBufferMessage(); 
// returns a buffer containing the message or an error object
<Buffer 01 11 30 31 30 30 f2 3c 46 c0 20 e8 80 00 00 00 00 00 00 00 00 20 30 37 35 34 ...

```

To unpack a message from the interface, that usually comes in a tcp stream/buffer just parse the incoming buffer or string to the method

```javascript
let incoming = new isopack().getIsoJSON(incoming);
// returns parsed json object:
let testData = {
    "0": "0100",
    "2": "5413330",
    "3": "000000",
    "4": "000000002000",
    "7": "0210160607",
    "11": "148893",
    "12": "160607",
    "13": "0210",
    "14": "2512",
    "18": "4111",
    "22": "141",
    "23": "003",
    "25": "00",
    "26": "12",
    "35": "5413330089020011D2512601079360805F",
    "41": "31327676",
    "42": "4D4F424954494C4",
    "43": "My Termianl Business                    ",
    "49": "404",
    "45": "0303030204E4149524F4249204B452dataString04B45",
    "123": "09010001000105010103040C010001"
};

```

# Usage: XML Messaging
## To get xml from a json:
Initialize the iso object with the json as argument

```javascript
let isoPack = new isoPack(testData);
isoPack.getXMLString();     // returns a string of iso 8583 xml string
```


To get json form the xml string
```javascript
let isoPack = new isoPack();    // Initialize with no argument
```

Parse the string to the method to get the iso json

```javascript
let xmlData = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<Iso8583PostXml>\n' +
    '<MsgType>0200</MsgType>\n' +
    '<Fields>\n' +
    '<Field_002>4839123456709012</Field_002>\n' +
    '<Field_003>000000</Field_003>\n' +
    '<Field_004>000000001500</Field_004>\n' +
    '<Field_007>0604074705</Field_007>\n' +
    '<Field_011>804058</Field_011>\n' +
    '<Field_012>074808</Field_012>\n' +
    '<Field_013>0604</Field_013>\n' +
    '<Field_014>0812</Field_014>\n' +
    '<Field_015>0905</Field_015>\n' +
    '<Field_022>901</Field_022>\n' +
    '<Field_025>02</Field_025>\n' +
    '<Field_026>05</Field_026>\n' +
    '<Field_028>000000500</Field_028>\n' +
    '<Field_030>000000500</Field_030>\n' +
    '<Field_032>483912</Field_032>\n' +
    '<Field_035>4839123456709012=08125876305082011</Field_035>\n' +
    '<Field_037>D000A0030000</Field_037>\n' +
    '<Field_040>507</Field_040>\n' +
    '<Field_041>FOFUGUT1</Field_041>\n' +
    '<Field_042>191121119111112</Field_042>\n' +
    '<Field_043>Postilion Cafeteria Rondebosch ZA</Field_043>\n' +
    '<Field_049>710</Field_049> <Field_056>1510</Field_056>\n' +
    '<Field_059>0000000072</Field_059>\n' +
    '<Field_123>211401213041013</Field_123>\n' +
    '<Field_127_002>0007713856</Field_127_002>\n' +
    '<Field_127_009>013040604040604016501100330000</Field_127_009>\n' +
    '<Field_127_012>My Terminal Business</Field_127_012>\n' +
    '<Field_127_020>20100604</Field_127_020>\n' +
    '</Fields>\n' +
    '</Iso8583PostXml>';

isoPack.getJsonFromXml(xmlData); // returns a json object or an error object
```

There are other cool stuff like ```isoPack.attachTimeStamp()``` which adds times stamps to field 7,12,13, plus more
When working with xml, first change the xml to json then validate.

# Thanks, Have Fun