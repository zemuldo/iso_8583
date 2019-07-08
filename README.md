# ISO_8583

[![Greenkeeper badge](https://badges.greenkeeper.io/zemuldo/iso_8583.svg)](https://greenkeeper.io/)~![Travis CI build badge](https://travis-ci.org/zemuldo/iso_8583.svg?branch=master)~[![Known Vulnerabilities](https://snyk.io/test/github/zemuldo/iso_8583/badge.svg?targetFile=package.json)](https://snyk.io/test/github/zemuldo/iso_8583?targetFile=package.json)

ISO_8583 is a <span style="color:green; font-size:18px">Customizable ISO 8583 Library for JavaScript and NodeJS</span> that does message conversion between a system and an interface that exchange [ISO 8583 Financial transaction card originated messages](https://en.wikipedia.org/wiki/ISO_8583).

##  Install from npm using

```
npm install --save iso_8583
```

## <span style="color:orange">Slack Channel</span>

Join this [slack channel](https://join.slack.com/t/zemuldo/shared_invite/enQtNDQwMzY3OTE3MzQ0LTllYWNjNGFlMDBlMjY4OTgxMWU5MWQ3ZTZjMjYyYWIyMDcwNjZiMDJhYmU4YTdhYzk4MDY3NWRiMjljODBiMTU) for support.

## Usage: Bitmap Messaging

### Configuration

#### Custom ISO 8583 Formats.

This library Supports custom ISO 8583 Formats, versions 1993 and 2003. This means you can decide what data types are allowed on each field, the length properties of the field and its description.
Custom ISO 8583 formats must be passed in the format below.

```javascript
{
      'FIELD_NAME': {
        ContentType: 'Types accepted',
        Label: 'Description of the field',
        LenType: 'Length type can bee fixed or lvar ...',
        MaxLen: Maximum length (number)
      }
    }
```

Here is an example of custom format for field 3. You can refer to formats in the docs to see the default formats.

```javascript

let customFormats = {
    '3': {
      ContentType: 'n',
      Label: 'Processing code',
      LenType: 'fixed',
      MaxLen: 9
    }
  };

```

#### Required fields

You can also set required field for message types as you desire.
To use required fields you need to create a json config file and add to the class when creating a new message class, thats two ways works:

```javascript
let isopack = new iso8583(iso);
isopack.requiredFieldsSchema = './config/required-fields.json';
```

```javascript
const required_fields = './config/required-fields.json';
let isopack = new iso8583(iso, customFormats, required_fields);
```

And at the config file you can organize by process code and by messages codes, like this:

```json
[
  {
    "processing_code": "000000",
    "required_fields": [0, 2, 4]
  },
  {
    "processing_code": "999999",
    "required_fields":[
      {
        "0100": [3, 7],
        "0500": [3, 7, 11]
      }
    ]
  }
]
```

#### Message Packaging and Un-packaging

This library uses a default mode of message encoding and packaging. If you are using a third party message source or a third party packaging source, you have to pre-format your data to meet the default encoding or configure things for yourself. See configuration for more info.

##### Unpacking

This only applies when you are receiving messages from others sources that don't encode as per this library like JPos.
Default unpack conditions:

`2-byte leng header in hex` + `4-byte MTI encoded in utf8` + `16-byte Bitmap encoded in hex`

If the message you are receiving is in a different state, the passing config to `getIsoJSON` like below.


##### Packing
Messages are packaged as:

- 2 byte length indicator + 4 byte message type + 16 byte bitmap(primary + secondary bitmap) + message field data.
- Each field with variable length data is preceded with the actual length of the data in that field.


######  <span style="color:blue">Field 127 and 127.25</span>

>The library extends fields 127 and fields 127.25 to their sub fields.    
>If you are handling a json with field 127 or 127.25 as one string, the bitmap must be 16 character string then a 4 digit number indicating the length
>In the above case the library will expand them.    
>If they are already broken down to subfields, nothing changes.    
>To invoke the package initialize with the iso8583 json or object as argument. If the json contains any fields not defined in iso8583 or has no field 0, the error is returned in an object.    
>If you want to handle xml iso 8583 messages, the usage is described down there. 

## Example

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

let customFormats = {
    '3': {
      ContentType: 'n',
      Label: 'Processing code',
      LenType: 'fixed',
      MaxLen: 9
    }
  };

let isopack = new iso8583(data,customFormats);
```

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

To get the bitmap active fields:
```javascript
isopack.getBitMapFields(); 
// returns the array of enabled fields in bitmap, excluding MTI and bitmap fields
// e.g. [2, 3, 4, 7, 12, 13, 14, 18, 22, 23, 25, 26, 32, 33, 35, 41, 42, 43, 49, 52, 56, 123, 127]

```


To get the bitmaps in hex for fields 0-127, fields 127 extensions and fields 127.25 extensions

```javascript
isopack.getBitMapHex();             // returns 'f23c46c1a8e091000000000000000022'
isopack.getBitMapHex_127_ext();     // returns '8000008000000000'
isopack.getBitMapHex_127_ext_25();  // returns 'fe1e5f7c00000000'

// in case of error, the error object returned with error prop
```

To get a raw message:

```javascript
let bufferMessage = isopack.getRawMessage(); 
// returns a buffer containing the message (without 2-byte length field) or an error object
<Buffer 30 31 30 30 f2 3c 46 c0 20 e8 80 00 00 00 00 00 00 00 00 20 30 37 35 34 ...

```

To get a buffer tcp message to send to the ISO 8583 Interface:

```javascript
let bufferMessage = isopack.getBufferMessage(); 
// returns a buffer containing the message with 2 additional bytes indicating the length 
// or an error object
<Buffer 01 11 30 31 30 30 f2 3c 46 c0 20 e8 80 00 00 00 00 00 00 00 00 20 30 37 35 34 ...

```

To get the field description:
```javascript
const iso8583 = require('iso_8583');
iso8583.getFieldDescription(24);
// The object with field descriptions to be returned:
// {24: 'Network International identifier (NII)'}
```

To get the several fields descriptions:
```javascript
const iso8583 = require('iso_8583');
iso8583.getFieldDescription([24, 37, 39]);
// The object with field descriptions to be returned:
// {
//    24: 'Network International identifier (NII)'},
//    37: 'Retrieval reference number', 
//    39: 'Response code'
// }
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

## Usage: XML Messaging

### To get xml from a json

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

## Usage: MTI converting

### Changing current mti type

Initialize the iso object with the json as argument

```javascript
  let data = {
    0: '0400',
    2: '4761739001010119',
    3: '000000',
    4: '000000005000',
    7: '0911131411'
  };

  let isopack = new isoPack(data);
  isoPack.toRetransmit()
  isoPack.getMti(); // returns '0401'
  
  isopack = new isoPack(data);
  isoPack.toResponse(); 
  isoPack.getMti(); // returns '0410'
  
  isopack = new isoPack(data);
  isoPack.toAdvice(); 
  isoPack.getMti(); // returns '0420'
  
```

There are other cool stuff like ```isoPack.attachTimeStamp()``` which adds times stamps to field 7,12,13, plus more
When working with xml, first change the xml to json then validate.

## <span style="color:green">Thanks</span> , <span style="color:blue">Have</span> <span style="color:orange">Fun</span>
