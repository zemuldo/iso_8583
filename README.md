# iso8583

This is a javascript library that does message conversion between a system and an interface that accepts iso8583 message requests and send [ISO 8583 Financial transaction card originated messages](https://en.wikipedia.org/wiki/ISO_8583) responses.

ISO 8583 is an international standard for Financial transaction card originated interchange messaging. It is the International Organization for Standardization standard for systems that exchange electronic transactions initiated by cardholders using payment cards.

ISO 8583 defines a message format and a communication flow so that different systems can exchange these transaction requests and responses. The vast majority of transactions made when a customer uses a card to make a payment in a store (EFTPOS) use ISO 8583 at some point in the communication chain, as do transactions made at ATMs. In particular, both the MasterCard and Visa networks base their authorization communications on the ISO 8583 standard, as do many other institutions and networks.

Although ISO 8583 defines a common standard, it is not typically used directly by systems or networks. It defines many standard fields (data elements) which remain the same in all systems or networks, and leaves a few additional fields for passing network-specific details. These fields are used by each network to adapt the standard for its own use with custom fields and custom usages. [More info here]((https://en.wikipedia.org/wiki/ISO_8583))

Usage: For Bitmap Messaging

Install from npm using

```
npm install --save iso_8583

```

Import the library using:

```
let iso_8583 = require('iso_8583')

```

To invoke the package initialize with the iso8583 json or object as argument. If the json contains any fields not defined in iso8583 or has no field 0, the error is returned in an object.

```
let isoJson = {
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
	"43": "4D6F6269746C6C204D65726368616E7420312030",
	"49": "404",
	"45": "0303030204E4149524F4249204B452dataString04B45",
	"123": "09010001000105010103040C010001"
};

```

```
let isopack = new iso_8583(isoJson)

```

The object initialized has the following methods:

To get the mti as a string:
```
isopack.getMti()

```

returns a 4 byte buffer containing the mti

To get the bitmaps in binary:

```
isopack.getBmpsBinary()

```

returns a string 

```
111100100011110001000110110...

```

or an error object with error prop

To get the bitmaps in hex:

```
isopack.getBitMapHex()

```

returns a hexadecimal string 

```
f23c46c020e880000000000000000020

```

or an error object with error prop

To get the assembled data:

```
isopack.assembleDataElements()

```

returns an object with props data and length 

```
07541333000000000000000200002101606.. 253

```

or an error object with error prop

To save the hustle, you can get all this information in one object

```
isopack.getBmpPack()

```

returns

```
{ mti: '0100',
  bitmapHex: 'f23c46c020e880000000000000000020',
  dataString: '07541333000000000000000200002101606071488931606070210251241111410030012345413330089020011D2512601079360805F313276764D4F424954494C44D6F6269746C6C204D65726368616E7420312030450303030204E4149524F4249204B452dataString04B4540403009010001000105010103040C010001',
  length: 273,
  lengthIndicator: [ '1', 17 ] }


```


To get a buffer tcp message to send to the ISO 8584 Interface:

```

let bufferMessage = isopack.getBufferMessage();

```

This returns a buffer containing the message or an object containing error message

```
<Buffer 01 11 30 31 30 30 f2 3c 46 c0 20 e8 80 00 00 00 00 00 00 00 00 20 30 37 35 34 ...

```


To upuck a message from the interface, that always comes in a tcp stream/buffer
Just parse the incoming buffer or string to the method


```
let incoming = new isopack().getIsoJSON(incoming)

```

This returns a json object of the message

```
{ '0': '0100',
  '2': '5413330',
  '3': '000000',
  '4': '000000002000',
  '7': '0210160607',
  '11': '148893',
  '12': '160607',
  '13': '0210',
  '14': '2512',
  '18': '4111',
  '22': '141',
  '23': '003',
  '25': '00',
  '26': '12',
  '35': '5413330089020011D2512601079360805F',
  '41': '31327676',
  '42': '4D4F424954494C4',
  '43': '4D6F6269746C6C204D65726368616E7420312030',
  '45': '0303030204E4149524F4249204B452dataString04B45',
  '49': '404',
  '123': '09010001000105010103040C010001' }

```

Usage: For XML Messaging:
To get xml from a json:
Initialize the iso object with the json as argument

```
let isoPack = new isoPack(isoJson)

```

```
isoPack.getXMLString()

```

returns a string of iso 8583 xml string

To get json form the xml string
Initialize with no argument

```$xslt
let isoPack = new isoPack()

```

parse the string to the method to get the iso json

```$xslt
let xmlTets = '<?xml version="1.0" encoding="UTF-8"?>\n' +
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
    '</Iso8583PostXml>'

```

```$xslt
isoPack.getJsonFromXml(xmlTets)

```

returns a json object or an error object

Thanks, Have Fun
