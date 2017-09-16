'use strict';
let {getHex} = require('../lib/tools')
let iso1Pack = require('../lib/8583');
let testData1 = {
    "0": "0100",
    "2": "4180875104555684",
    "3": "000000",
    "4": "000000002000",
    "7": "0901105843",
    "11": "123456",
    "12": "105843",
    "13": "0901",
    "14": "1905",
    "18": "4111",
    "22": "051",
    "23": "000",
    "25": "00",
    "26": "12",
    "32": "423935",
    "33": "111111111",
    "35": "4180875104555684D190522611950628",
    "37": "724410123456",
    "41": "12345678",
    "42": "MOBITILL0000001",
    "43": "Mobitll Merchant 1 0000000 NAIROBI KE KE",
    "49": "404",
    "52": "481C9038075937B1",
    "56": "1510",
    "123": "91010151134C101",
    "127": "000000800000000001927E1E5F7C0000000000000000200000000000000014A00000000310107C0000C2FF004934683D9B5D1447800280000000000000000410342031F024103021406010A03A42002008CE0D0C84042100000488004041709018000003276039079EDA"
}
let testData2 = {
    "0": "0200",
    "2": "5060990103738877557",
    "3": "310000",
    "4": "000000000000",
    "7": "0604074705",
    "11": "804058",
    "12": "074808",
    "13": "0604",
    "14": "1812",
    "15": "0905",
    "18": "6011",
    "22": "901",
    "23": "000",
    "25": "00",
    "26": "12",
    "28": "C00000000",
    "30": "C00000000",
    "32": "483912",
    "33":  "506099",
    "35": "5060990103738877557D18126018307250",
    "37": "MBTL00000009",
    "40": "601",
    "41": "NIC00002",
    "42": "NIC000200000009",
    "43":  "NIC HOUSE 1            NAIROBI        KE",
    "49": "404",
    "56": "1510",
    "123": "511201511344002",
    "127.2": "0007713856",
    "127.3": "NIC HOUSE 1            NAIROBI        KE        ",
    "127.20": "20100604"
}

let testData3 = {
    "0": "0100",
    "2": "4180875104555684",
    "3": "000000",
    "4": "000000002000",
    "7": "0901105843",
    "11": "123456",
    "12": "105843",
    "13": "0901",
    "14": "1905",
    "18": "4111",
    "22": "051",
    "23": "000",
    "25": "00",
    "26": "12",
    "32": "423935",
    "33": "111111111",
    "35": "4180875104555684D190522611950628",
    "37": "724410123456",
    "41": "12345678",
    "42": "MOBITILL0000001",
    "43": "Mobitll Merchant 1 0000000 NAIROBI KE KE",
    "49": "404",
    "52": "481C9038075937B1",
    "56": "1510"
}
let testData4 = {}
let iso1 = new iso1Pack(testData1)
let iso2 = new iso1Pack(testData2)
let iso3 = new iso1Pack(testData3)
let iso4 = new iso1Pack(testData4)

/*
    Validating iso Message.
    These methods validate the iso
*/
//CASE 1
// console.log(iso1.validateMessage())
// console.log(iso1.validateMessage())
// console.log(iso1.getMti())
// console.log(iso1.getBitMapHex())
// console.log(iso1.getBitMapHex_127_ext())
// //CASE 2
// console.log(iso2.validateMessage())
// console.log(iso2.validateMessage())
// console.log(iso2.getMti())
// console.log(iso2.getBitMapHex())
// //CASE 3
// console.log(iso3.validateMessage())
// console.log(iso3.validateMessage())
// console.log(iso3.getMti())
// console.log(iso3.getBitMapHex())
// //CASE 4
// console.log(iso4.validateMessage())
// console.log(iso4.validateMessage())
// console.log(iso4.getMti())
// console.log(iso4.getBitMapHex())

/*
   For a message that has fields 127 or 127.25
   We expand the extensions before with validate the message
   Then we can get the bitmaps for the extensions
*/

// console.log(iso1.rebuildExtensions())
// console.log(iso1.Msg)
//
// console.log(iso2.rebuildExtensions())
// console.log(iso2.Msg)
// console.log(iso1.assembleBitMap().join(''))
// console.log(iso1.assembleBitMap_127().join(''))
// console.log(iso1.assembleBitMap_127_125().join(''))


// // console.log(iso12.getTransStatus())
// // console.log(iso12.getBitMapHex())

/*
    Assemble Daata Test
    calling the
*/
//console.log(iso1.assemble0_127_Fields().toString())
// console.log(iso1.assemble0_127_Fields().slice(0,4).toString())
// console.log(iso1.assemble0_127_Fields().slice(4,20).toString('hex'))
//
// console.log(iso1.assemble127_extensions().toString())
// console.log(iso1.assemble127_extensions().slice(0,1).toString('hex'))
// console.log(iso1.assemble127_extensions().slice(1,2).toString('hex'))
// console.log(iso1.assemble127_extensions().slice(2,10).toString('hex'))
// //
// ///
//console.log(iso2.assemble0_127_Fields().toString())
// console.log(iso2.assemble0_127_Fields().slice(0,4).toString())
// console.log(iso2.assemble0_127_Fields().slice(4,20).toString('hex'))
//
// console.log(iso2.assemble127_extensions().toString())
// console.log(iso2.assemble127_extensions().slice(0,1).toString('hex'))
// console.log(iso2.assemble127_extensions().slice(1,2).toString('hex'))
// console.log(iso2.assemble127_extensions().slice(2,10).toString('hex'))
//
//
// ///
// console.log(iso3.assemble0_127_Fields())
// console.log(iso3.assemble127_extensions())


//console.log(iso1.assemble127_25_extensions().toString())
//console.log(iso1.assemble127_25_extensions().slice(0,1).toString('hex'))
//console.log(iso1.assemble127_25_extensions().slice(1,2).toString('hex'))
//console.log(iso1.assemble127_25_extensions().toString())

/*
    Testing pack unpack message
 */
// //CASE 1
// let _0_127_Buffer1 = iso1.getBufferMessage()
// console.log(_0_127_Buffer1.toString())
// let unpack1 = iso1.getIsoJSON(_0_127_Buffer1,{})
// console.log(unpack1.json)
// console.log("---------------------------------")
// console.log(unpack1.remSlice)
// //CASE 2
// let _0_127_Buffer2 = iso2.getBufferMessage()
// console.log(_0_127_Buffer2.toString())
// let unpack2 = iso2.getIsoJSON(_0_127_Buffer2,{})
// console.log(unpack2.json)
// console.log("---------------------------------")
// console.log(unpack2.remSlice)
// //CASE 3
// let _0_127_Buffer3 = iso3.getBufferMessage()
// console.log(_0_127_Buffer3.toString())
// let unpack3 = iso3.getIsoJSON(_0_127_Buffer3,{})
// console.log(unpack3.json)
// console.log("---------------------------------")
// console.log(unpack3.remSlice)
//CASE 4
let t = {
    "0": "0800",
    "7": "0818160244",
    "11": "646465",
    "12": "160244",
    "13": "0818",
    "70": "001"
}
let iso5 = new iso1Pack(t)
let _0_127_Buffer5 = iso5.getBufferMessage()
console.log(_0_127_Buffer5)
let unpack5 = iso5.getIsoJSON(_0_127_Buffer5,{})
console.log(unpack5)
console.log("---------------------------------")
console.log(unpack5)


// let _0_127_Buffer2 = iso2.assemble0_127_Fields()
// console.log(_0_127_Buffer2.toString())
//
// let _0_127_Buffer3 = iso3.assemble0_127_Fields()
// console.log(_0_127_Buffer3.toString())
//
// let _0_127_Buffer4 = iso4.assemble0_127_Fields()
//console.log(_0_127_Buffer4)
// let stage1json = iso1.unpack_127(_0_127_Buffer,{})
// console.log(stage1json)

//let _127_63_buffer = iso1.assemble127_extensions()
//console.log(_127_63_buffer)
//let stage2json = iso1.unpack_127_1_63(_127_63_buffer,stage1json.json).json
//console.log(stage2json)
// // console.log(iso1.unpack_127_25_1_63(_127_25_63_buffer,stage2json))


// console.log(iso12.assembleDataBuffer())
// console.log(iso1.getBmpPack())
// console.log(iso12.getBmpPack())

/*
    Testing getBufferMessage method
    Returns buffer or error object
*/

// console.log(iso1.getBufferMessage())
// console.log(iso2.getBufferMessage())
// console.log(iso3.getBufferMessage())


/*
    Testing getIsoJSON method by parsing the buffer message
    Returns valid iso 8583 object or error object
*/


// console.log(iso1.getBufferMessage().toString())
// console.log(iso1.getIsoJSON(iso1.getBufferMessage()))
// console.log(iso1.getIsoJSON(iso1.getBufferMessage()))
// console.log(iso1.attachTimeStamp())
// console.log(iso12.attachTimeStamp())
// console.log(iso1.getTType())
// console.log(iso1.getAccType())
// console.log(iso1.getTransStatus())

