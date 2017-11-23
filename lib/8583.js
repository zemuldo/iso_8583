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

    getLenBuffer(len){
        let buf1 = this.getTCPHeaderBuffer(parseInt((Number(len) /256)))
        let buf2 = this.getTCPHeaderBuffer((parseInt((Number(len)  % 256))))
        return Buffer.concat([buf1,buf2])
    }

    /**
     * [getTType description]
     * @return {[type]} [description]
     */
    getTType(){
        if(this.Msg['3']){
            return getTransType(this.Msg['3'].slice(0,2))
        }
        else {
            return {error:"transaction type not defined in message"}
        }
    }
   
   getTransactionType(){
      return this.getTType();
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
                    if(!this.Msg[field]){
                        continue
                    }
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
    _checkMTI(mti){
        if(msgTypes[mti]){
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
    rebuildExtensions_127_25(){
        if(this.Msg['127.25']){
            let dataString = this.Msg['127.25'];
            let bitmap_127 = getHex(dataString.slice(0,16)).split('').map(Number);
            this.Msg['127.25.1'] =dataString.slice(0,16)
            dataString = dataString.slice(16,dataString.length);
            for(let i = 0; i<bitmap_127.length; i++){
                if(bitmap_127[i]===1){
                    let field = '127.25.'+(Number(i)+1);
                    if (formats[field].LenType==="fixed") {
                        this.Msg[field] =dataString.slice(0,formats[field].MaxLen);
                        dataString = dataString.slice(formats[field].MaxLen,dataString.length);
                    }
                    else {
                        let thisLen = getLenType(formats[field].LenType);
                        if(thisLen === 0){
                            console.log("field has no format implementation");
                            throw {error:"field " + field + " format not implemented"};
                        }
                        //check length of iso field
                        else {
                            let len = dataString.slice(0, thisLen).toString();
                            dataString = dataString.slice(thisLen, dataString.length);
                            this.Msg[field] = dataString.slice(0, Number(len)).toString();
                            dataString = dataString.slice(Number(len), dataString.length);
                        }
                    }
                }
            }
        }
        return this.validateMessage(this.Msg)

    }
    // ***tested***
    rebuildExtensions(){
        this.dataString = ''
        if(this.Msg['127']){
            let dataString = this.Msg['127'];
            let bitmap_127 = getHex(dataString.slice(0,16)).split('').map(Number);
            this.Msg['127.1'] =dataString.slice(0,16)
            dataString = dataString.slice(16,dataString.length);
            for(let i = 0; i<bitmap_127.length; i++){
                if(bitmap_127[i]===1){
                    let field = '127.'+(Number(i)+1);
                    if (formats[field].LenType==="fixed") {
                        this.Msg[field] =dataString.slice(0,formats[field].MaxLen);
                        dataString = dataString.slice(formats[field].MaxLen,dataString.length);
                    }
                    else {
                        let thisLen = getLenType(formats[field].LenType);
                        if(thisLen === 0){
                            console.log("field has no format implementation");
                            throw {error:"field " + field + " format not implemented"};
                        }
                        //check length of iso field
                        else {
                            let len = dataString.slice(0, thisLen).toString();
                            dataString = dataString.slice(thisLen, dataString.length);
                            this.Msg[field] = dataString.slice(0, Number(len)).toString();
                            dataString = dataString.slice(Number(len), dataString.length);
                        }
                    }
                }
            }
        }
        return this.rebuildExtensions_127_25()

    }
    assembleBitMap() {
        let state = this.checkMTI()
        if(state){
            if(this.Msg['0'] && state){
                let _map = new Uint8Array(128);
                let fields = Object.keys(this.Msg);

                _map[0] = 1;
                // construct 128 bit mask
                for (let i = 0; i < fields.length; i++) {
                    let field = parseInt(fields[i]);
                    if (field > 1) {
                        _map[field - 1] = 1;
                    }
                }
                this.bitmaps = _map
                return  _map
            }
            else{
                return  {error:"'bitmap error, iso message type undefined or invalid'"};
            }
        }
        else {
            return  {error:"'bitmap error, iso message type undefined or invalid'"};
        }

    }
    assembleBitMap_127() {
        let extend = this.rebuildExtensions()
        let state = this.checkMTI()
        if(state && !extend.error){
            if(this.Msg['0'] && state){
                let _map = new Uint8Array(64);
                for (let i = 0; i<_map.length;i++){
                    let field = '127.'+(i+1)

                    if(this.Msg[field]){
                        _map[i]=1
                    }
                }
                return _map
            }
            else{
                return  {error:"'bitmap error, iso message type undefined or invalid'"};
            }
        }
        else {
            return  {error:"'bitmap error, iso message type undefined or invalid'"};
        }

    }
    assembleBitMap_127_25() {
        let extend = this.rebuildExtensions()
        let state = this.checkMTI()
        if(state && !extend.error){
            if(this.Msg['0'] && state){
                let _map = new Uint8Array(64);
                for (let i = 0; i<_map.length;i++){
                    let field = '127.25.'+(i+1)

                    if(this.Msg[field]){
                        _map[i]=1
                    }
                }
                return _map
            }
            else{
                return  {error:"'bitmap error, iso message type undefined or invalid'"};
            }
        }
        else {
            return  {error:"'bitmap error, iso message type undefined or invalid'"};
        }

    }
    assembleBitMap_127_125() {

        let extend = this.rebuildExtensions()
        let state = this.checkMTI()
        if(state && !extend.error){
            if(this.Msg['0'] && state){
                let _map = new Uint8Array(64);
                for (let i = 0; i<_map.length;i++){
                    let field = '127.25.'+(i+1)
                    if(this.Msg[field]){
                        _map[i]=1
                    }
                }
                return _map
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
                    let field = parseInt(fields[i]);
                    if (field > 1) {
                        _map[field-1] = 1;
                    }
                }
                this.bitmaps = _map
                return this.bitmaps.join('')
            }
        }

    }
    getBitMapHex_127_ext() {
        let state = this.assembleBitMap_127()
        if (state.error){
            return state
        }
        else {
            let map = ''
            let maps = []
            let counter = 0
            for (let i = 0; i < state.length; i++) {
                counter++
                map += state[i]
                if (counter == 4) {
                    maps.push(parseInt(map, 2).toString(16))
                    counter = 0
                    map = ''
                }
            }
            return 16, maps.join('')
        }
    }
    getBitMapHex_127_ext_25() {
        this.rebuildExtensions()
        let state = this.assembleBitMap_127_125()
        if (state.error){
            return state
        }
        else {
            let map = ''
            let maps = []
            let counter = 0
            for (let i = 0; i < state.length; i++) {
                counter++
                map += state[i]
                if (counter == 4) {
                    maps.push(parseInt(map, 2).toString(16))
                    counter = 0
                    map = ''
                }
            }
            return 16, maps.join('')
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
    unpack_127_25_1_63(slice_127_25,isoJSON){
        if(slice_127_25.byteLength<10){
            return {json:isoJSON, remSlice:slice_127_25}
        }
        else {
            let len = slice_127_25.slice(0,4)
            slice_127_25 = slice_127_25.slice(4,slice_127_25.length)
            let bitmap = getHex(slice_127_25.slice(0, 16).toString()).split('').map(Number)
            slice_127_25 = slice_127_25.slice(16, slice_127_25.length)
            for (let i = 0; i < 34; i++) {
                if (bitmap[i] === 1) {
                    let subField =  '127.25.'+(i+1)
                    if (formats[subField]) {
                        if (formats[subField].LenType==="fixed") {
                            if(formats[subField].ContentType==="b"){
                                isoJSON[subField] = slice_127_25.slice(0, formats[subField].MaxLen/2).toString('hex')
                                slice_127_25 = slice_127_25.slice(formats[subField].MaxLen/2, slice_127_25.length)
                            }
                            else {
                                isoJSON[subField] = slice_127_25.slice(0, formats[subField].MaxLen).toString()
                                slice_127_25 = slice_127_25.slice(formats[subField].MaxLen, slice_127_25.length)
                            }
                        }
                        else {
                            let thisLen = getLenType(formats[subField].LenType)
                            if(thisLen === 0){
                                console.log("field has no format implementation")
                                throw {error:"field " + subField + " format not implemented"}
                            }
                            //check length of iso field
                            else {
                                let len = slice_127_25.slice(0, thisLen).toString()
                                slice_127_25 = slice_127_25.slice(thisLen, slice_127_25.length)
                                isoJSON[subField] = slice_127_25.slice(0, Number(len)).toString()
                                slice_127_25 = slice_127_25.slice(Number(len), slice_127_25.length)
                            }
                        }
                    }
                    else {
                        return {error:"field " + subField + " format not implemented"}
                    }
                }
            }

            return {json:isoJSON, remSlice:slice_127_25}
        }

    }

    unpack_127_1_63(slice_127,isoJSON){
	    console.log(slice_127.toString())
        let len = slice_127.slice(0,6)
        console.log(len.toString())
        slice_127 = slice_127.slice(6,slice_127.length)
        console.log(slice_127.slice(0,8).toString('hex'))
        let bitmap = getHex(slice_127.slice(0, 8).toString('hex')).split('').map(Number)
        slice_127 = slice_127.slice(8, slice_127.length)
        for (let i = 0; i < 40; i++) {
            if (bitmap[i] === 1) {
                let subField =  '127.'+(i+1)
                if(subField==='127.25'){
                    console.log(slice_127.toString())
                    let get127_25Exts = this.unpack_127_25_1_63(slice_127,isoJSON)
                   if(get127_25Exts.error){
                        return get127_25Exts
                   }
                   else {
                       isoJSON = get127_25Exts.json
                       slice_127 = get127_25Exts.remSlice
                       continue
                   }
                }
                if (formats[subField]) {
                    if (formats[subField].LenType==="fixed") {
                        if(formats[subField].ContentType==="b"){
                            isoJSON[subField] = slice_127.slice(0, formats[subField].MaxLen/2).toString('hex')
                            slice_127 = slice_127.slice(formats[subField].MaxLen/2, slice_127.length)
                        }
                        else {
                            isoJSON[subField] = slice_127.slice(0, formats[subField].MaxLen).toString()
                            slice_127 = slice_127.slice(formats[subField].MaxLen, slice_127.length)
                        }
                    }
                    else {
                        let thisLen = getLenType(formats[subField].LenType)
                        if(thisLen == 0){
                            console.log("field has no format implementation")
                            throw {error:"field " + subField + " format not implemented"}
                        }
                        //check length of iso field
                        else {
                            let len = slice_127.slice(0, thisLen).toString()
                            slice_127 = slice_127.slice(thisLen, slice_127.length)
                            isoJSON[subField] = slice_127.slice(0, Number(len)).toString()
                            slice_127 = slice_127.slice(Number(len), slice_127.length)
                        }
                    }
                }
                else {
                    return {error:"field" + subField + " format not implemented"}
                }
            }
        }

        return {json:isoJSON, remSlice:slice_127}
    }
    // **tested****
    unpack_127(incoming,isoJSON) {
        if(Buffer.isBuffer(incoming)){
            let mti = incoming.slice(0,4).toString()
            isoJSON['0'] = mti
            if(!this._checkMTI(mti)){
                return {error:"failed to unpack at get mti"}
            }
            let bitmap = getHex(incoming.slice(4, 20).toString('hex')).split('').map(Number)
            let thisBuff = incoming.slice(20, incoming.byteLength)
            for (let i = 1; i < bitmap.length; i++) {

                if (bitmap[i] == 1) {
                    //format defined
                    let field = i + 1
                    if(field===127){
                        console.log(thisBuff.toString())
                        let get127Exts = this.unpack_127_1_63(thisBuff,isoJSON)
                        if(get127Exts.error){
                            return get127Exts
                        }
                        else {
                            isoJSON = get127Exts.json
                            thisBuff = get127Exts.remSlice
                            continue
                        }
                    }
                    if (formats[field]) {
                        if (formats[field].LenType=="fixed") {
                            if(formats[field].ContentType==="b"){
                                isoJSON[field] = thisBuff.slice(0, formats[field].MaxLen/2).toString('hex')
                                thisBuff = thisBuff.slice(formats[field].MaxLen/2, thisBuff.byteLength)
                            }
                            else {
                                isoJSON[field] = thisBuff.slice(0, formats[field].MaxLen).toString()
                                thisBuff = thisBuff.slice(formats[field].MaxLen, thisBuff.byteLength)
                            }
                        }
                        else {
                            let thisLen = getLenType(formats[field].LenType)
                            if(thisLen == 0){
                                console.log("field has no format implementation")
                                throw {error:"field " + field + " format not implemented"}
                            }
                            //check length of iso field
                            else {
                                let len = thisBuff.slice(0, thisLen).toString()
                                thisBuff = thisBuff.slice(thisLen, thisBuff.byteLength)
                                isoJSON[field] = thisBuff.slice(0, Number(len)).toString()
                                thisBuff = thisBuff.slice(Number(len), thisBuff.byteLength)
                            }
                        }
                    }
                    else {
                        return {error:"field" + field + " format not implemented"}
                    }
                }
            }

            return {json:isoJSON, remSlice:thisBuff}
        }
        else {
           return {error:"expecting buffer but got "+ typeof incoming}
        }

    }
    getIsoJSON(buffer){
        console.log(buffer.toString())
        if(Buffer.isBuffer(buffer)){
            let len1 =parseInt(buffer.slice(0,1).toString('hex'),16)
            let len2 =parseInt(buffer.slice(1,2).toString('hex'),16)
            let actualLen = (256*len1)+len2
            buffer = buffer.slice(2,buffer.byteLength)
            let iso =  this.unpack_127(buffer,{})
            if (iso.error){
                return iso
            }
            else {
                return iso.json
            }
        }
        else{
            return {error: "expecting buffer but got " + typeof buffer}
        }

    }
    assemble127_25_extensions(){
        let buff = Buffer(this.Msg['127.25.1']);
        let bitmaps_127 = this.assembleBitMap_127_125()
        for (let i = 1; i < 40; i++) {
            let field = '127.25.'+ (Number(i) + 1);
            if (bitmaps_127[i] === 1) {
                if(field ==='127.25.1'){
                    continue
                }
                if(!this.Msg[field]){
                    return {error: "Field "+ field +" in bitmap but not in json"}
                }
                if (formats[field]) {
                    if (formats[field].LenType==="fixed") {
                        if(formats[field].ContentType==="b"){
                            if (formats[field].MaxLen===this.Msg[field].length){
                                let size = formats[field].MaxLen/2
                                let thisBuff = Buffer.alloc(size,this.Msg[field],'hex')
                                buff =  Buffer.concat([buff,thisBuff])
                            }
                            else{
                                return {error:"invalid length of data on field "+field}
                            }
                        }
                        else {
                            if (formats[field].MaxLen===this.Msg[field].length){
                                let thisBuff = Buffer(this.Msg[field])
                                buff = Buffer.concat([buff,thisBuff])
                            }
                            else{
                                return {error:"invalid length of data on field "+field}
                            }
                        }
                    }
                    else {
                        let thisLen = getLenType(formats[field].LenType);
                        if(thisLen === 0){
                            return {error:"field " + field + " has no field implementation"}
                        }
                        else {
                            let actualLength = this.Msg[field].length;
                            let padCount = thisLen-actualLength.toString().length;
                            let lenIndicator = actualLength.toString();
                            for (let i=0;i<padCount;i++){
                                lenIndicator = 0 +lenIndicator;
                            }
                            let thisBuff = Buffer(lenIndicator+this.Msg[field])
                            buff = Buffer.concat([buff,thisBuff])
                        }
                    }
                }
                else {
                    return {error:"field " + field + " has invalid data"}
                }

            }
        }
        let padCount = getLenType(formats['127.25'].LenType)
        let actualLen = buff.byteLength.toString()
        let x = padCount-actualLen.length
        for (let i=0;i<x;i++){

            actualLen = '0' +actualLen;
        }
        let lenBuff = Buffer(actualLen)
        return Buffer.concat([lenBuff,buff])
    }
    assemble127_extensions(){
        let mtiCheck = this.checkMTI()
        let validate = this.validateMessage(this.Msg)
        let state = this.rebuildExtensions()
        //expects array of 0s & 1s and data-json object
        if(mtiCheck && validate && state){
            let bitmaps_127 = this.assembleBitMap_127()
            let bmpsHex = this.getBitMapHex_127_ext()
            let buff = Buffer.alloc(8,bmpsHex,'hex')
            for (let i = 0; i < bitmaps_127.length; i++) {
                let field = '127.'+ (Number(i) + 1);
                if(field==='127.1'){

                }
                if (bitmaps_127[i] === 1) {
                    if(field ==='127.25'){
                        let _25_buff = this.assemble127_25_extensions()
                        if(!_25_buff.error){
                            if(_25_buff.byteLength>12){
                                buff = Buffer.concat([buff,_25_buff])
                                continue
                            }
                            else {
                                continue
                            }
                        }
                    }
                    if(!this.Msg[field]){
                        return {error: "Field "+ field +" in bitmap but not in json"}
                    }
                    if (formats[field]) {
                        let state = types(formats[field],this.Msg[field],field)
                        if(state.error){
                            return state
                        }
                        if (formats[field].LenType==="fixed") {
                            if(formats[field].ContentType==="b"){
                                if (formats[field].MaxLen===this.Msg[field].length){
                                    let size = formats[field].MaxLen/2
                                    let thisBuff = Buffer.alloc(size,this.Msg[field],'hex')
                                    buff =  Buffer.concat([buff,thisBuff])
                                }
                                else{
                                    return {error:"invalid length of data on field "+field}
                                }
                            }
                            else {
                                if (formats[field].MaxLen===this.Msg[field].length){
                                    let thisBuff = Buffer(this.Msg[field])
                                    buff = Buffer.concat([buff,thisBuff])
                                }
                                else{
                                    return {error:"invalid length of data on field "+field}
                                }
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
                                    lenIndicator = 0 +lenIndicator;
                                }
                                let thisBuff = Buffer(lenIndicator+this.Msg[field])
                                buff = Buffer.concat([buff,thisBuff])
                            }
                        }
                    }
                    else {
                        return {error:"field " + field + " not implemented"}
                    }

                }
            }
            let padCount = getLenType(formats['127'].LenType)
            let actualLen = buff.byteLength.toString()
            let x = padCount-actualLen.length
            for (let i=0;i<x;i++){

                actualLen = '0' +actualLen;
            }
            let bitmapBuff = buff.slice(0,8)
            let lenBuff = Buffer(actualLen)
            let dataBuff = buff.slice(8,buff.byteLength)
            return Buffer.concat([lenBuff,bitmapBuff,dataBuff])
        }
        else {
            return {error:"Invalid Message in 127 extensions"}
        }

    }
    assemble0_127_Fields() {
        let bitMapCheck = this.getBitMapHex();
        let state = this.assembleBitMap()
        let validDate = validateFields(this.Msg)
        let state2 = this.rebuildExtensions()
        let mti = this.getMti()
        //expects array of 0s & 1s and data-json object
        if (!state.error && !validDate.error && !bitMapCheck.error && !mti.error){
            let mtiBuffer = Buffer(mti);
            let buff = Buffer.alloc(16,bitMapCheck,'hex')
            buff = Buffer.concat([mtiBuffer,buff])

            let counter = 0
            for (let i = 1; i < this.bitmaps.length; i++) {
                counter++
                let field = i + 1;
                if (this.bitmaps[i] === 1) {
                    //present
                    if(field===127){
                        let _127_exetnsions = this.assemble127_extensions()
                        if(!_127_exetnsions.error){
                            if(_127_exetnsions.byteLength>12){
                                buff = Buffer.concat([buff,_127_exetnsions])
                                continue
                            }
                            else {
                                continue
                            }
                        }
                        else {
                            return _127_exetnsions
                        }
                    }
                    if(!this.Msg[field]){
                        return {error: "Field "+ field +" in bitmap but not in json"}
                    }
                    let state = types(formats[field],this.Msg[field],field)
                    if(state.error){
                        return state
                    }
                    if (formats[field]) {
                        if (formats[field].LenType==="fixed") {
                            if(formats[field].ContentType==="b"){
                                if (formats[field].MaxLen===this.Msg[field].length){
                                    let size = formats[field].MaxLen/2
                                   let thisBuff = Buffer.alloc(size,this.Msg[field],'hex')
                                        buff =  Buffer.concat([buff,thisBuff])
                                }
                                else{
                                    return {error:"invalid length of data on field "+field}
                                }
                            }
                            else {
                                if (formats[field].MaxLen===this.Msg[field].length){
                                    let thisBuff = Buffer(this.Msg[field])
                                    buff = Buffer.concat([buff,thisBuff])
                                }
                                else{
                                    return {error:"invalid length of data on field "+field}
                                }
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
                                    lenIndicator = 0 +lenIndicator;
                                }
                                let thisBuff = Buffer(lenIndicator+this.Msg[field])
                                buff = Buffer.concat([buff,thisBuff])
                            }
                        }
                    }
                    else {
                        return {error:"field " + field + " has invalid data"}
                    }

                }
            }

            return Buffer.concat([buff])
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
                let data = this.assemble0_127_Fields(Buffer.alloc(16,bitMapsHex));
                if(data.error){
                    return data
                }
                else {
                    let messageLength = mti.length + data.buff.byteLength;
                    let tcpH = [(parseInt((messageLength / 256))),(messageLength % 256)]

                    return {
                        mti:mti,
                        bitmapHex:bitMapsHex,
                        dataString:data.buff.toString(),
                        len:4+data.buff.byteLength,
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
        let _0_127_Buffer = this.assemble0_127_Fields()
        if(_0_127_Buffer.error){
            return _0_127_Buffer
        }
        else {
            let len_0_127_1 = this.getTCPHeaderBuffer(parseInt((Number(_0_127_Buffer.byteLength) /256)))
            let len_0_127_2 = this.getTCPHeaderBuffer((parseInt((Number(_0_127_Buffer.byteLength)  % 256))))
            return Buffer.concat([len_0_127_1,len_0_127_2,_0_127_Buffer])
        }
    }

    getRawMessage() {
        return this.assemble0_127_Fields()
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
            return "127" + "." + Number(field.split('field_127_')[1])
        }
        else if (field.length > 14) {
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
