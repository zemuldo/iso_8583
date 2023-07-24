"use strict";
/**
 * This module has helper functions that are useful along side this library.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractBits = exports.matchValues = exports.findRequiredFields = exports.attachDiTimeStamps = exports.attachPostillionLength = exports.extractPostillionData = exports.getPostillionLength = void 0;
const date_fns_1 = require("date-fns");
const getPostillionLength = function (buf) {
    const div = buf[0];
    const rem = buf[1];
    return 256 * div + rem;
};
exports.getPostillionLength = getPostillionLength;
const extractPostillionData = function (sent) {
    // the data is two bytes shorter than what is sent
    const buf = Buffer.alloc(sent.byteLength - 2);
    // the first to bytes represents the length, the rest is data
    for (let i = 2; i < sent.byteLength; i++) {
        buf[i - 2] = sent[i];
    }
    return buf;
};
exports.extractPostillionData = extractPostillionData;
const attachPostillionLength = function (_data) {
    let data = Buffer.alloc(0);
    // make sure _data is a buffer, if it's a string convert
    if (!Buffer.isBuffer(_data)) {
        if (typeof _data === 'string') {
            data = Buffer.alloc(_data.length, _data);
        }
    }
    else {
        data = _data;
    }
    // data is represented by two bytes
    const length = Buffer.alloc(2);
    length[0] = data.length / 256;
    length[1] = data.length % 256;
    return Buffer.concat([length, data]);
};
exports.attachPostillionLength = attachPostillionLength;
const attachDiTimeStamps = function (obj) {
    if (!obj['7'] || !obj['12'] || !obj['13']) {
        const time = new Date();
        obj['7'] = (0, date_fns_1.format)(time, 'MMDDhhmmss');
        obj['12'] = (0, date_fns_1.format)(time, 'hhmmss');
        obj['13'] = (0, date_fns_1.format)(time, 'MMDD');
    }
    return obj;
};
exports.attachDiTimeStamps = attachDiTimeStamps;
const findRequiredFields = function (json = [], key, processing_code, message_code) {
    let requiredFields = [];
    if (!json)
        return requiredFields;
    for (let i = 0; i < json.length; i++) {
        if (json[i].processing_code === processing_code) {
            requiredFields = json[i][key];
            if (typeof requiredFields[0] === 'object') {
                for (const key in requiredFields[0]) {
                    if (key === message_code) {
                        requiredFields = requiredFields[0][key];
                    }
                }
            }
        }
    }
    return requiredFields;
};
exports.findRequiredFields = findRequiredFields;
const matchValues = function (required_fields, iso_fields) {
    const missing_fields = required_fields;
    // Refactory to use .filter()
    for (let b = 0; b < required_fields.length; b++) {
        for (let i = 0; i < iso_fields.length; i++) {
            if (required_fields[b] === iso_fields[i]) {
                missing_fields.splice(b, 1);
            }
        }
    }
    return missing_fields;
};
exports.matchValues = matchValues;
const extractBits = function (iso) {
    const bits = [];
    for (const key in iso) {
        bits.push(parseInt(key, 10));
    }
    return bits;
};
exports.extractBits = extractBits;
