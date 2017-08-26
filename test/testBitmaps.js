'use strict'

let isoPack = require('../lib/8583');

let test1 = {
    "0": "9100",
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
}

let test2 = {}

let iso1 = new isoPack(test1)
let iso2 = new isoPack(test2)

let bitmapArray1 = iso1.assembleBitMap()
console.log(bitmapArray1)
console.log(iso2.getBmpsBinary())
console.log(iso1.getBitMapBuffer())