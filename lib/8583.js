'use strict';

const formats = require('./postbridge');
const parser = require('./parker');
let { getHex,getLenType,getHexString} = require('./tools');

class Main {
    constructor(object) {
        if(object) {
            this.MsgType = object[0];
            this.Msg = object;
        }
        else {
            this.MsgType = null;
            this.Msg = {};
        }
    }
    // expand fields for xml format
    expandFields(field) {
        let str = field.toString();
        if (str.length < 3) {
            let pad = 3 - str.length;
            for (let i = 0; i < pad; i++) {
                str = '0' + str;
            }
            return 'Field_' + str;
        }
        else if (str.length > 3 && str.length < 7) {
            let field = 'Field_127_'
            let ext = str.split('127.')[1]
            let pad = 3 - ext.length;
            while (pad > 0) {
                field += '0'
                pad--
            }
            return field + ext;
        }
        else if (str.length > 6) {
            let field = 'Field_127_25_'
            let ext = str.split('127.25.')[1]
            let pad = 3 - ext.length;
            while (pad > 0) {
                field += '0'
                pad--
            }
            return field + ext;
        }
        else {
            return 'Field_' + str;
        }


    }
    // expand field for xml format
    contractField(field) {
        if (field.length > 12 && field.length < 14) {
            return "127" + "." + Number(field.split('field_127_')[1])
        }
        else if (field.length > 14) {
            return "127" + "." + Number(field.split('_')[2]) + "." + Number(field.split('_')[3])
        }
        else {
            field = field.toLowerCase();
            field = field.split('field_')[1];

            let fi = parseInt(field);

            if (Number.isNaN(fi)) {
                // TODO fix this, might throw false positive on field 127 extensions
                throw new Error('error parsing field %s', field);
            }

            return fi.toString();
        }

    }

    addField(number, data) {
        if (!this.diObject) {
            this.diObject = {};
        }

        if (!formats[number]){
            return {code:666,error:'field '+ number +' is either non existent, or not implemented'};
        }

        // TODO run some validations here
        if (number === 0) {
            this.diObject['0'] = data;
            this.MsgType = data;
        } else {
            this.diObject[number.toString()] = data;
            this.fields[this.expandFields(number)] = data;
        }
    }

    addFromDiObject(obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty) {
                this.addField(key, obj[key]);
            }
        }

        return this;
    }

    returnDIObject() {
        if (this.diObject) {
            return this.diObject;
        }
    }

    // from xml
    addFromPostBrigeXml(string) {
        let obj = jxon.stringToJs(string);
        let iso = obj.iso8583postxml;
        let res = {};
        let mti = '';

        if (!iso) {
            throw new Error('xml is not properly encoded');
        }

        // prepare MTI
        mti = iso.msgtype.toString();
        if (mti.length === 3) {
            mti = '0' + mti;
        }
        res['0'] = mti;

        for (let key in iso.fields) {
            if (iso.fields.hasOwnProperty(key)) {
                let item = this.contractField(key);
                res[item] = iso.fields[key];
            }
        }

        return this.addFromDiObject(res);
    }

    // to xml
    toPostBridgeXmlString() {
        const header = '<?xml version="1.0" encoding="UTF-8"?>';
        let msgtype = null;

        if (!this.MsgType) {
            if (this.diObject['0']) {
                msgtype = this.diObject['0'];
            } else {
                log.warn('cannot find mti on data aborting');
            }
        } else {
            msgtype = this.MsgType;
        }

        let d = {};
        d['Iso8583PostXml'] = {
            MsgType: msgtype,
            Fields: this.fields
        };

        return header + jxon.jsToString(d);
    }

    getMti() {
        let mti = this.MsgType
        if (mti===null || mti===undefined){
            return {error:"mti undefined in message"}
        }
        else {
            //build the message type identifier
            let _mti;

            if (!this.Msg['0']) {
                if (!this.MsgType) {
                    return {code:667,error:'mti undefined on field 0'}
                } else {
                    _mti = this.MsgType;
                }
            } else {
                _mti = this.Msg['0'];
                _mti = this.Msg['0'];
            }

            // TODO validation

            let mti = new Uint8Array(4);
            for (let i = 0; i < 4; i++) {
                mti[i] = parseInt(_mti[i]);
            }
            return Buffer(mti.join(''))
        }

    }

    assembleBitMap() {
        if(!this.Msg['0']){
            return {error:'message empty or undefined'}
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
            return _map;
        }
    }

    getBitMapBuffer(bitmap) {
        let map = ''
        let maps = []
        let counter = 0
        for (let i = 0; i < bitmap.length; i++) {
            counter++
            map += bitmap[i]
            if (counter == 4) {
                maps.push(parseInt(map, 2).toString(16))
                counter = 0
                map = ''
            }
        }
        return Buffer.alloc(16, maps.join(''), 'hex')
    }

    getTCPHeaderBuffer(indicator) {
        let integer = Number(indicator)
        return new Buffer.alloc(1, integer, 'hex');
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
    assembleDataElements(bitmap, data) {
        //expects array of 0s & 1s and data-json object
        let dataString = ''
        let counter = 0
        for (let i = 1; i < bitmap.length; i++) {
            counter++
            let field = i + 1
            if (bitmap[i] === 1) {
                if (formats[field]) {
                    if (formats[field].LenType==="fixed") {
                        dataString += data[field]
                    }
                    else {
                        let thisLen = getLenType(formats[field].LenType)
                        if(thisLen === 0){

                        }
                        else {
                            let actualLength = data[field].length
                            let padCount = thisLen-actualLength.toString().length
                            let lenIndicator = actualLength.toString()
                            for (let i=0;i<padCount;i++){
                                lenIndicator =0 +lenIndicator
                            }
                            dataString += (lenIndicator+data[field])
                        }
                    }
                }
                else {
                    return {error:"field" + field + " format not implemented"}
                }

            }
        }
        return { data: Buffer(dataString), length: dataString.length };
    }
    //construct bitmap from an object///json
    toByteArray() {
        let mti = this.getMti(this.diObject);
        let bitmap = this.assembleBitMap(this.diObject);
        let bitMapsBuf = this.getBitMapBuffer(bitmap);
        let dataBuf = this.assembleDataElements(bitmap, this.diObject, bitMapsBuf);
        let messageLength = mti.length + 16 + dataBuf.length;
        let tcpH1 = this.getTCPHeaderBuffer(((messageLength / 256).toFixed(0)))
        let tcpH2 = this.getTCPHeaderBuffer((messageLength % 256))
        return Buffer.concat([tcpH1, tcpH2, mti,bitMapsBuf,dataBuf.data])
    }
}

module.exports = Main;