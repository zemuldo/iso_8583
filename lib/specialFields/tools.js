"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectSpecial = exports.validateSpecialFields = void 0;
const errors_1 = require("./../errors");
const formats_1 = require("./formats");
const validateSpecialFields = (msg, customFormats) => {
    const fields = Object.keys(msg);
    let i = 0;
    for (i; i < fields.length; i++) {
        // @ts-ignore
        // @ts-ignore
        if (formats_1.default[fields[i]] && !customFormats[fields[i]]) {
            return new errors_1.DefaultError(`Special field ${fields[i]} has no custom formats`);
        }
    }
    if (i === fields.length) {
        return true;
    }
};
exports.validateSpecialFields = validateSpecialFields;
const detectSpecial = (msg) => {
    const state = false;
    const fields = Object.keys(msg);
    let i = 0;
    for (i; i < fields.length; i++) {
        // @ts-ignore
        if (formats_1.default[fields[i]]) {
            return true;
        }
    }
    if (i === fields.length) {
        return state;
    }
    return state;
};
exports.detectSpecial = detectSpecial;
