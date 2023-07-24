"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const tools_1 = require("../tools");
const formats_1 = require("../formats");
const types_1 = require("../types");
const SpT = require("../specialFields/tools");
/**
 * Assemble fields 0-127 into ISO 8583 encoded string
 * @method assemble0_127_Fields
 * @memberof module:Message-Package
 */
function assemble0_127_Fields() {
    const bitMapCheck = this.getBitMapHex();
    const state = this.assembleBitMap();
    const validDate = tools_1.default.validateFields(this);
    const specialValidate = SpT.validateSpecialFields(this.Msg, this.formats);
    const mti = this.getMti();
    // expects array of 0s & 1s and data-json object
    if (!state.error && !validDate.error && !specialValidate.error && !bitMapCheck.error && !mti.error) {
        const mtiBuffer = Buffer.alloc(4, mti);
        let buff;
        const this_format = this.formats['1'] || formats_1.default['1'];
        if (this_format.ContentType === 'an')
            buff = this.buildBitmapBuffer(bitMapCheck, 'ascii');
        else
            buff = this.buildBitmapBuffer(bitMapCheck, 'hex');
        buff = Buffer.concat([mtiBuffer, buff]);
        for (let i = 1; i < this.bitmaps.length; i++) {
            const field = i + 1;
            if (this.bitmaps[i] === 1) {
                // present
                if (field === 127) {
                    const _127_exetnsions = this.assemble127_extensions();
                    if (!_127_exetnsions.error) {
                        if (_127_exetnsions.byteLength > 12) {
                            buff = Buffer.concat([buff, _127_exetnsions]);
                            continue;
                        }
                        else {
                            continue;
                        }
                    }
                    else {
                        return _127_exetnsions;
                    }
                }
                if (!this.Msg[field]) {
                    return tools_1.default.toErrorObject(['Field ', field, ' in bitmap but not in json']);
                }
                const this_format = this.formats[field] || formats_1.default[field];
                const state = (0, types_1.default)(this_format, this.Msg[field], field);
                if (state.error) {
                    return state;
                }
                if (this_format) {
                    if (this_format.LenType === 'fixed') {
                        if (this_format.ContentType === 'b') {
                            if (this_format.MaxLen === this.Msg[field].length) {
                                const size = this_format.MaxLen / 2;
                                const thisBuff = Buffer.alloc(size, this.Msg[field], 'hex');
                                buff = Buffer.concat([buff, thisBuff]);
                            }
                            else {
                                return tools_1.default.toInvalidLengthErrorObject(field, this.Msg[field].length);
                            }
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
                        if (this.Msg[field] && this.Msg[field].length > this_format.MaxLen)
                            return tools_1.default.toInvalidLengthErrorObject(field, this.Msg[field].length);
                        if (thisLen === 0) {
                            return tools_1.default.toErrorObject(['field', field, ' has no field implementation']);
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
                else {
                    return tools_1.default.toErrorObject(['field ', field, ' has invalid data']);
                }
            }
        }
        return Buffer.concat([buff]);
    }
    else {
        return state;
    }
}
exports.default = assemble0_127_Fields;
