'use strict';

const formats = require('./formats');
const msgTypes =require('./msgTypes')
const parser = require('./parker');
const types = require('./types')
let { validateFields,getLenType } = require('./tools');

class Main {
    // ***tested***
    constructor(object) {
        if(object) {
            this.MsgType = object[0];
            this.Msg = object;
            this.bitmaps = null;
            this.dataString =''
        }
        else {
            this.MsgType = null;
            this.Msg = {};
            this.bitmaps = null;
            this.dataString = ''
        }
    }
    // ***tested***
    checkMTI(){
        if(msgTypes[this.MsgType]){
            return true;
        }
        else{
            return false
        }
    }
    // ***tested***
    getMtiBuffer() {
        let state = this.checkMTI()
        if (state){
            let mti = this.MsgType
            if (mti===null || mti===undefined){
                return {error:"mti undefined in message"}
            }
            else {
                if(this.checkMTI()){
                    let _mti;

                    if (!this.Msg['0']) {
                        if (!this.MsgType) {
                            return {code:667,error:'mti undefined on field 0'}
                        } else {
                            _mti = this.MsgType;
                        }
                    } else {
                        _mti = this.Msg['0'];
                    }
                    let mti = new Uint8Array(4);
                    for (let i = 0; i < 4; i++) {
                        mti[i] = parseInt(_mti[i]);
                    }
                    return mti.join('')
                }
                else {
                    return {error:"invalid mti"}
                }
            }
        }
        else{
            return {error:'mti undefined on field 0'}
        }


    }
    // ***tested***
    assembleBitMap() {
        let state = this.checkMTI()
        if(state){
            if(this.Msg['0'] && state){
                let _map = new Uint8Array(128);
                let fields = Object.keys(this.Msg);

                _map[0] = 1;
                // construct 128 bit mask
                for (let i = 0; i < fields.length; i++) {
                    let field = Number(fields[i]);
                    if (field > 1) {
                        _map[field - 1] = 1;
                    }
                }
                this.bitmaps = _map
                return true
            }
            else{
                return  {error:"'bitmap error, iso message type undefined or invalid'"};
            }
        }
        else {
            return  {error:"'bitmap error, iso message type undefined or invalid'"};
        }

    }
    // ***tested***
    getBmpsBinary(){
        let state = this.assembleBitMap()
        console.log(state)
        if (state.error){
            return state.error
        }
        else {
            if(!this.Msg['0']){
                return {error:'message type error, empty or undefined'}
            }
            else{
                let _map = new Uint8Array(128);
                let fields = Object.keys(this.Msg);

                _map[0] = 1;
                // construct 128 bit mask
                for (let i = 0; i < fields.length; i++) {
                    let field = Number(fields[i]);
                    if (field > 1) {
                        _map[field - 1] = 1;
                    }
                }
                this.bitmaps = _map
                return this.bitmaps.join('')
            }
        }

    }
    // ***tested***
    getBitMapHex() {
        let state = this.assembleBitMap()
        if (state.error){
            return state.error
        }
        else {
            if(this.bitmaps != null && msgTypes[this.MsgType]){
                let map = ''
                let maps = []
                let counter = 0
                for (let i = 0; i < this.bitmaps.length; i++) {
                    counter++
                    map += this.bitmaps[i]
                    if (counter == 4) {
                        maps.push(parseInt(map, 2).toString(16))
                        counter = 0
                        map = ''
                    }
                }
                return 16, maps.join('')
            }
            else {
                return {error:'bitmap error, expecting 128 length unit array'}
            }
        }
    }

    parseDataElement(field, element) {
        if (formats[field]) {
            throw new Error(field + ' is not defined');
        }

        let options = {};

        options.field = field;
        options.type = formats[field].ContentType;
        options.length = formats[field].MaxLen;
        options.max = formats[field].MaxLen;
        options.LenType = formats[field].LenType;;

        return parser(options, element);
    }

    getIsoJSON(bitmap, data, mti) {
            let dataString = data
            let isoJSON = {
                '0': mti
            }
            for (let i = 1; i < bitmap.length; i++) {
                //first bit is always 1
                // bitmap 1, data present
                if (bitmap[i] == 1) {
                    //format defined
                    let field = i + 1
                    if (formats[field]) {
                        if (formats[field].LenType=="fixed") {
                            isoJSON[field] = dataString.slice(0, formats[field].MaxLen)
                            dataString = dataString.slice(formats[field].MaxLen, dataString.length)
                        }
                        else {
                            let thisLen = getLenType(formats[field].LenType)
                            if(thisLen == 0){
                                console.log("field has no format implementation")
                                return {error:"field" + field + " format not implemented"}
                            }
                            //check length of iso field
                            else {
                                let len = dataString.slice(0, thisLen)
                                dataString = dataString.slice(thisLen, dataString.length)
                                isoJSON[field] = dataString.slice(0, Number(len))
                                dataString = dataString.slice(Number(len), dataString.length)
                            }
                        }
                    }
                    else {
                        return {error:"field" + field + " format not implemented"}
                    }
                }
            }
            return isoJSON
    }
    // ***tested***
     assembleDataElements() {
        let state = this.assembleBitMap()
         let validDate = validateFields(this.Msg)
        //expects array of 0s & 1s and data-json object
        if (!state.error && validDate){
            let counter = 0
            for (let i = 1; i < this.bitmaps.length; i++) {
                counter++
                let field = i + 1
                if (this.bitmaps[i] === 1) {
                    if (formats[field] && types(formats[field],this.Msg[field])) {
                        if (formats[field].LenType==="fixed") {
                            this.dataString += this.Msg[field];
                        }
                        else {
                            let thisLen = getLenType(formats[field].LenType);
                            if(thisLen === 0){
                                return {error:"field" + field + " has no field implementation"}
                            }
                            else {
                                let actualLength = this.Msg[field].length;
                                let padCount = thisLen-actualLength.toString().length;
                                let lenIndicator = actualLength.toString();
                                for (let i=0;i<padCount;i++){
                                    lenIndicator =0 +lenIndicator;
                                }
                                this.dataString += (lenIndicator+this.Msg[field]);
                            }
                        }
                    }
                    else {
                        return {error:"field " + field + " has invalid data"}
                    }

                }
            }
            return { dataString: this.dataString, len: this.dataString.length };
        }
        else {
            return state
        }

    }
    // ***tested***
    getBmpPack() {
        let mti = this.getMtiBuffer();
        if (mti.error){
            return mti
        }
        else{

            let bitMapsHex = this.getBitMapHex();
            if(bitMapsHex.error){
                return bitMapsHex
            }
            else {
                let data = this.assembleDataElements();
                if(data.error){
                    return data
                }
                else {
                    let messageLength = mti.length + 16 + data.len;
                    let tcpH = [((messageLength / 256).toFixed(0)),(messageLength % 256)]

                    return {
                        mti:mti,
                        bitmapHex:bitMapsHex,
                        dataString:data.dataString,
                        len:mti.length+16+data.len,
                        lengthIndicator:tcpH
                    }
                }

            }
        }

    }
    // ***tested***
    getTCPHeaderBuffer(indicator) {
        let integer = Number(indicator)
        return new Buffer.alloc(1, integer, 'hex');
    }
    // ***tested***
    getBufferMessage (obj){
        let len1 = (Number(obj.len) /256).toFixed(0)
        let len2 = (Number(obj.len) % 256)
        let mtiBuffer = Buffer(obj.mti)
        let tcpH1 = this.getTCPHeaderBuffer(len1)
        let tcpH2 = this.getTCPHeaderBuffer(len2)
        let bitmapBuffer = Buffer.alloc(16,obj.bitmapHex,'hex')
        let dataBuffer = Buffer(obj.dataString)
        return Buffer.concat([tcpH1,tcpH2,mtiBuffer,bitmapBuffer,dataBuffer])
    }
}

module.exports = Main;