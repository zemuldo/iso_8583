'use strict';

const formats = require('./formats');
const msgTypes =require('./msgTypes');
const jxon = require('jxon');
const types = require('./types')
let {attachDiTimeStamps} = require('./helpers')
let { validateFields,getLenType,getHex,getResType,getTransType,getAccType,getTranStatus } = require('./tools');

class Main {
    // ***tested***
    constructor(object) {
        if(object) {
            this.MsgType = object[0];
            this.Msg = object;
            this.bitmaps = null;
            this.dataString =''
            this.fields = {};
        }
        else {
            this.MsgType = null;
            this.Msg = {};
            this.bitmaps = null;
            this.dataString = ''
            this.fields = {};
        }
    }
    getTType(){
        if(this.Msg['3']){
            return getTransType(this.Msg['3'].slice(0,2))
        }
        else {
            return {error:"transaction type not defined in message"}
        }

    }
    getAccType(){
        if(this.Msg['3']){
            return getAccType(this.Msg['3'].slice(2,4))
        }
        else {
            return {error:"transaction type not defined in message"}
        }

    }

    getTransStatus(){
        if(this.Msg['39']){
            return getTranStatus(this.Msg['39'])
        }
        else {
            return {error:"transaction type not defined in message"}
        }
    }
    attachTimeStamp (){
        if(this.Msg['0']){
            let state = this.validateMessage(this.Msg)
            if(state.error){
                return state
            }
            else {
                this.Msg = attachDiTimeStamps(this.Msg)
                return this.Msg
            }
        }
        else {
            return {error:"mti error"}
        }

    }
    //BITMAP FORMAT
    validateMessage(){
        let valid = false
        let state = this.assembleBitMap()
        let validDate = validateFields(this.Msg)
        //expects array of 0s & 1s and data-json object
        if (!state.error && !validDate.error){
            let counter = 0
            for (let i = 1; i < this.bitmaps.length; i++) {
                counter++
                let field = i + 1
                if (this.bitmaps[i] === 1) {
                    let state = types(formats[field],this.Msg[field],field)
                    if(state.error){
                        return state
                    }
                    if (formats[field]) {
                        if (formats[field].LenType==="fixed") {
                            if (formats[field].MaxLen===this.Msg[field].length){
                                valid = true
                            }
                            else{
                                return {error:"invalid length of data on field "+field}
                            }

                        }
                        else {
                            let thisLen = getLenType(formats[field].LenType);
                            if(thisLen === 0){
                                return {error:"field" + field + " has no field implementation"}
                            }
                            else {
                                valid = true
                            }
                        }
                    }
                    else {
                        return {error:"field " + field + " has invalid data"}
                    }

                }
            }
            return valid
        }
        else {
            return valid
        }

    }
    // ***tested***
    checkMTI(){
        if(msgTypes[this.Msg['0']]){
            return true;
        }
        else{
            return false
        }
    }
    // ***tested***
    getMti() {
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

    getResMTI(){
        if(this.MsgType){
            return getResType(this.MsgType)
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
    // **tested****
    getIsoJSON(incoming) {
        if(Buffer.isBuffer(incoming)){
            let mti = incoming.slice(2, 6).toString()
            let bitmap = getHex(incoming.slice(6, 22).toString('hex'))
            let dataString = incoming.slice(22, incoming.length).toString()
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
        else if(typeof incoming =='string'){
            let mti = incoming.slice(2, 6).toString()
            let bitmap = getHex(incoming.slice(6, 22).toString('hex'))
            let dataString = incoming.slice(22, incoming.length).toString()
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

    }
    // ***tested***
    assembleDataElements() {
        this.dataString = ''
        let state = this.assembleBitMap()
        let validDate = validateFields(this.Msg)
        //expects array of 0s & 1s and data-json object
        if (!state.error && !validDate.error){
            let counter = 0
            for (let i = 1; i < this.bitmaps.length; i++) {
                counter++
                let field = i + 1
                if (this.bitmaps[i] === 1) {
                    let state = types(formats[field],this.Msg[field],field)
                    if(state.error){
                        return state
                    }
                    if (formats[field]) {
                        if (formats[field].LenType==="fixed") {
                            if (formats[field].MaxLen===this.Msg[field].length){
                                this.dataString += this.Msg[field];
                            }
                            else{
                                return {error:"invalid length of data on field "+field}
                            }

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
        let mti = this.getMti();
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
                    console.log(messageLength)
                    let tcpH = [(parseInt((messageLength / 256))),(messageLength % 256)]

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
    getBufferMessage () {
        let obj = this.getBmpPack()
        if (obj.error) {
            return obj
        }
        else {

            let len1 = parseInt((Number(obj.len) /256))
            let len2 = (Number(obj.len) % 256)
            let mtiBuffer = Buffer(obj.mti)
            let tcpH1 = this.getTCPHeaderBuffer(len1)
            let tcpH2 = this.getTCPHeaderBuffer(len2)
            let bitmapBuffer = Buffer.alloc(16,obj.bitmapHex,'hex')
            let dataBuffer = Buffer(obj.dataString)
            return Buffer.concat([tcpH1,tcpH2,mtiBuffer,bitmapBuffer,dataBuffer])
        }
    }

    //XML FORMAT

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

    contractField(field) {
        field = field.toLowerCase();
        //field_127_002
        //field_127_025_024
        if (field.length > 12 && field.length < 14) {
            console.log(field)
            return "127" + "." + Number(field.split('field_127_')[1])
        }
        else if (field.length > 14) {
            console.log(field)
            return "127" + "." + Number(field.split('_')[2]) + "." + Number(field.split('_')[3])
        }
        else {
            return Number(field.split('field_')[1])
        }

    }

    addField(number, data) {
        if (!this.Msg) {
            return {error:"message undefined"}
        }

        if (!formats[number]){
            return {error:"field " + number +" not implemented"}
        }

        let state = types(formats[number],this.Msg[number].toString(),number)

        if (number === 0) {
            this.Msg['0'] = data;
            this.MsgType = data;
            return true
        } else {
            if(state.error){
                return state
            }
            else {
                this.Msg[number.toString()] = data;
                this.fields[this.expandFields(number)] = data;
                return true
            }
        }
    }

    addFromDiObject() {
        for (let key in this.Msg) {
            if (this.Msg.hasOwnProperty) {
                let state = this.addField(key, this.Msg[key]);
                if(state.error){
                    return state
                }
            }
        }

        return true;
    }

    // from xml
    getJsonFromXml(string) {
        if(string){
            let obj = jxon.stringToJs(string);
            if(obj.Iso8583PostXml){
                let iso = obj.Iso8583PostXml;
                let res = {};
                // prepare MTI
                let mti = iso.MsgType.toString();
                res['0'] = mti;

                for (let key in iso.Fields) {
                    if (iso.Fields.hasOwnProperty(key)) {
                        let item = this.contractField(key);
                        res[item] = iso.Fields[key];
                    }
                }

                return res
            }
            else if(obj.iso8583postxml){
                let iso = obj.iso8583postxml;
                let res = {};
                let mti = '';
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

                return res
            }
            else{
                return {error: 'could not parse xml'}
            }


        }
        else {
            return {error:'xml is not properly encoded'};
        }

    }

    // to xml
    getXMLString() {
        const header = '<?xml version="1.0" encoding="UTF-8"?>';

        if (!this.MsgType || !msgTypes[this.MsgType]) {
            return {error:"mti undefined or invalid"}
        } else {
            let state = this.addFromDiObject()
            if (state.error){
                return state
            }
            else{
                let d = {};
                d['Iso8583PostXml'] = {
                    MsgType: this.MsgType,
                    Fields: this.fields
                };
                return header + jxon.jsToString(d);
            }
        }

    }

}

module.exports = Main;