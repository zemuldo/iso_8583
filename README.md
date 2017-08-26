# iso8583

This is a javascript library that does message conversion between a system and an interface that accepts iso8583 message requests and send iso8583 responses.

ISO 8583 is an international standard for Financial transaction card originated interchange messaging. It is the International Organization for Standardization standard for systems that exchange electronic transactions initiated by cardholders using payment cards.

ISO 8583 defines a message format and a communication flow so that different systems can exchange these transaction requests and responses. The vast majority of transactions made when a customer uses a card to make a payment in a store (EFTPOS) use ISO 8583 at some point in the communication chain, as do transactions made at ATMs. In particular, both the MasterCard and Visa networks base their authorization communications on the ISO 8583 standard, as do many other institutions and networks.

Although ISO 8583 defines a common standard, it is not typically used directly by systems or networks. It defines many standard fields (data elements) which remain the same in all systems or networks, and leaves a few additional fields for passing network-specific details. These fields are used by each network to adapt the standard for its own use with custom fields and custom usages. 

Usage:

Install from npm using

```
npm install --save iso_8583

```

Import the library using:

```
let iso_8583 = require('iso_8583')

```

To invoke the initialize with the iso8583 json or object as argument

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
isopack.getMtiBuffer()

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
isopack.assembleBitMap()

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



