'use strict';

let isoPack = require('../lib/8583');
let { getHex,getLenType } = require('../lib/tools')
let checkTypes = require('../lib/types')
let formats = require('../lib/postbridge')

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
	"43": "4D6F6269746C6C204D65726368616E7420312030",
	"49": "404",
	"45": "0303030204E4149524F4249204B452dataString04B45",
	"123": "09010001000105010103040C010001"
};
let tty = {}
let iso = new isoPack(testData)
let mti = iso.getMti();
console.log(mti.toString())
let bitmap = iso.assembleBitMap();
console.log(bitmap)
// let bitMapsBuf = new isoPack().getBitMapBuffer(bitmap);
// let dataBuf = new isoPack().assembleDataElements(bitmap, testData, bitMapsBuf);
// let data = new isoPack().addFromDiObject(testData).toByteArray();
// let thisMti = data.slice(2, 6).toString()
// let thisBitmaps = getHex(data.slice(6, 22).toString('hex'))
// let thisData = data.slice(22, data.length).toString()
// let iso = new isoPack().getIsoJSON(thisBitmaps, thisData, thisMti);
// console.log(dataBuf.data.length)
// console.log(data.toString())
// console.log(thisData)
// console.log(iso)
