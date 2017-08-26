'use strict'
const formats = require('./formats');
let checkTypes = require('./types')

module.exports = {
    getHex: hexaString => {
    let mapping = {
        '0': '0000',
        '1': '0001',
        '2': '0010',
        '3': '0011',
        '4': '0100',
        '5': '0101',
        '6': '0110',
        '7': '0111',
        '8': '1000',
        '9': '1001',
        'a': '1010',
        'b': '1011',
        'c': '1100',
        'd': '1101',
        'e': '1110',
        'f': '1111',
        'A': '1010',
        'B': '1011',
        'C': '1100',
        'D': '1101',
        'E': '1110',
        'F': '1111',
    }
    let bitmaps = ''
    for (let i = 0; i < hexaString.length; i++) {
    bitmaps += mapping[hexaString[i]]
}

return  bitmaps
},

getHexString: bitmaps =>{
    parseInt(bitmaps, 2).toString(16)
},
getLenType: lentype => {

    if (lentype === "llvar"){
        return 2
    }
    else if (lentype === "lllvar"){
        return 3
    }
    else if (lentype === "llllvar") {
        return 4
    }
    else if (lentype === "lllllvar") {
        return 4
    }
    else {
        return 0
    }

},
validateFields: obj =>{
    for (let field in obj) {
        if (obj.hasOwnProperty(field)) {
            if(formats[field] && obj[field].length>1 && checkTypes(formats[field],obj[field])){
            }
            else {
                return {state:false,error:{error:"field " + field + " error"}}
            }
        }
    }
    return {state:true}
}
}