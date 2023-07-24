"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const tools_1 = require("../tools");
const formats_1 = require("../formats");
/**
 * Assemble fields 127.25.0-63 into ISO 8583 encoded string
 * @method assemble0_127_25_extensions
 * @memberof module:Message-Package
 */
function default_1() {
    const bitampHext = this.Msg['127.25.1'] || this.getBitMapHex_127_ext_25();
    this.Msg['127.25.1'] = bitampHext;
    let buff = this.buildBitmapBuffer(bitampHext, 'ascii');
    if (tools_1.default.isXmlEncoded(this.Msg['127.25'])) {
        buff = Buffer.alloc(this.Msg['127.25'].length, this.Msg['127.25']);
        const padCount = tools_1.default.getLenType(formats_1.default['127.25'].LenType);
        let actualLen = buff.byteLength.toString();
        const x = padCount - actualLen.length;
        for (let i = 0; i < x; i++)
            actualLen = '0' + actualLen;
        const lenBuff = Buffer.alloc(actualLen.length, actualLen);
        return Buffer.concat([lenBuff, buff]);
    }
    const bitmaps_127 = this.assembleBitMap_127_25();
    for (let i = 1; i < 40; i++) {
        const field = '127.25.' + (Number(i) + 1);
        const this_format = this.formats[field] || formats_1.default[field];
        if (bitmaps_127[i] === 1) {
            if (field === '127.25.1') {
                continue;
            }
            if (!this.Msg[field]) {
                return tools_1.default.toErrorObject(['Field ', field, ' in bitmap but not in json']);
            }
            if (this_format) {
                if (this_format.LenType === 'fixed') {
                    if (this_format.ContentType === 'b') {
                        if (this_format.MaxLen === this.Msg[field].length) {
                            const size = this_format.MaxLen / 2;
                            const thisBuff = Buffer.alloc(size, this.Msg[field], 'hex');
                            buff = Buffer.concat([buff, thisBuff]);
                        }
                        else
                            return tools_1.default.toInvalidLengthErrorObject(field, this.Msg[field].length);
                    }
                    else {
                        if (this_format.MaxLen === this.Msg[field].length) {
                            const thisBuff = Buffer.alloc(this.Msg[field].length, this.Msg[field]);
                            buff = Buffer.concat([buff, thisBuff]);
                        }
                        else {
                            return tools_1.default.toInvalidLengthErrorObject(field, this.Msg[field].length);
                        }
                    }
                }
                else {
                    const thisLen = tools_1.default.getLenType(this_format.LenType);
                    if (!this_format.MaxLen)
                        return tools_1.default.toErrorObject(['max length not implemented for ', this_format.LenType, field]);
                    if (this.Msg[field] && this.Msg[field].length > this_format.MaxLen) {
                        return tools_1.default.toInvalidLengthErrorObject(field, this.Msg[field].length);
                    }
                    if (thisLen === 0) {
                        return tools_1.default.toErrorObject('field ' + field + ' has no field implementation');
                    }
                    else {
                        const actualLength = this.Msg[field].length;
                        const padCount = thisLen - actualLength.toString().length;
                        let lenIndicator = actualLength.toString();
                        for (let i = 0; i < padCount; i++) {
                            lenIndicator = 0 + lenIndicator;
                        }
                        const thisBuff = Buffer.alloc(this.Msg[field].length + lenIndicator.length, lenIndicator + this.Msg[field]);
                        buff = Buffer.concat([buff, thisBuff]);
                    }
                }
            }
        }
    }
    const padCount = tools_1.default.getLenType(formats_1.default['127.25'].LenType);
    let actualLen = buff.byteLength.toString();
    const x = padCount - actualLen.length;
    for (let i = 0; i < x; i++)
        actualLen = '0' + actualLen;
    const lenBuff = Buffer.alloc(actualLen.length, actualLen);
    return Buffer.concat([lenBuff, buff]);
}
exports.default = default_1;
;
