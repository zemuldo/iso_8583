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
let isopack = new iso_8583(isoJson)

```

The object initialized has the following methods:

```
isopack.assembleDataElements()

```

