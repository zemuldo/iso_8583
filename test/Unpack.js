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
    Testing pack unpack message
 */
//CASE 1
let _0_127_Buffer1 = iso1.getBufferMessage()
console.log(_0_127_Buffer1.toString())
let unpack1 = new iso1Pack().getIsoJSON(_0_127_Buffer1,{})
console.log(unpack1)
console.log("---------------------------------")
//CASE 2
let _0_127_Buffer2 = iso2.getBufferMessage()
console.log(_0_127_Buffer2.toString())
let unpack2 = iso2.getIsoJSON(_0_127_Buffer2,{})
console.log(unpack2)
console.log("---------------------------------")
//CASE 3
let _0_127_Buffer3 = iso3.getBufferMessage()
console.log(_0_127_Buffer3.toString())
let unpack3 = iso3.getIsoJSON(_0_127_Buffer3,{})
console.log(unpack3)
console.log("---------------------------------")
//CASE 4
let _0_127_Buffer4 = iso4.getBufferMessage()
console.log(_0_127_Buffer4.toString())
let unpack4 = iso4.getIsoJSON(_0_127_Buffer4,{})
console.log(unpack4)
console.log("---------------------------------")
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
