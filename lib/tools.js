"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
const formats_1 = require("./formats");
const types_1 = require("./types");
const accountTypes_1 = require("./accountTypes");
const transactionTypes_1 = require("./transactionTypes");
const transactionStatus_1 = require("./transactionStatus");
/**
 * Handy Utils for transforming data
 * @module Tools
 */
exports.default = {
    /**
     * Convert TCP message string length to a buffer, should be a number that fits in one byte.
     * @method getTCPHeaderBuffer
     * @param {integer} indicator length of ISO 8583 message string.
     * @returns {buffer} 1 byte buffer representing the message length indicator
     */
    getTCPHeaderBuffer: (indicator) => {
        const integer = Number(indicator);
        return Buffer.alloc(1, integer, 'hex');
    },
    /**
     * Format error to a universal object. Can take an array of strings to join or just a string.
     * @method toErrorObject
     * @param {string|string[]} errors
     * @returns {object} Object having property error
     * @example Tools.toErrorObject("some error") -> {error: "some error"}
     * @example Tools.toErrorObject("some error on field", 67, "happened" ) -> {error: "some error on field 67 happened"}
     */
    toErrorObject: (errors) => {
        if (Array.isArray(errors))
            return new errors_1.DefaultError(errors.join(''));
        // @ts-ignore
        else
            return new errors_1.DefaultError(errors);
    },
    toInvalidLengthErrorObject: (field, invalidLength) => {
        return new errors_1.DefaultError(`invalid length ${invalidLength} of data on field ${field}`);
    },
    /**
     * Convert a hexadecimal string in to binary string: To a string of 0s and 1s
     * @method getHex
     * @param {string} hexaString
     * @returns {string} A string of 0s and 1s representing the hexadecimal string input
     * @example Tools.getHex("EF") -> "11101111"
     * @example Tools.getHex("EFEF") -> "1110111111101111"
     */
    getHex: (hexaString) => {
        const mapping = {
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
            a: '1010',
            b: '1011',
            c: '1100',
            d: '1101',
            e: '1110',
            f: '1111',
            A: '1010',
            B: '1011',
            C: '1100',
            D: '1101',
            E: '1110',
            F: '1111',
        };
        let bitmaps = '';
        for (let i = 0; i < hexaString.length; i++)
            bitmaps += mapping[hexaString[i]];
        return bitmaps;
    },
    /**
     * Convert a string of integers to hexadecimal string.
     * @method getHexString
     * @param {string} string A string of integers
     * @returns {string} A hexadecimal string representation of the string of integers received
     * @example T.getHexString("123456") -> "1e240"
     */
    getHexString: (string) => {
        return parseInt(string, 10).toString(16);
    },
    getLenType: (lentype) => {
        switch (lentype) {
            case 'lvar':
                return 1;
            case 'llvar':
                return 2;
            case 'lllvar':
                return 3;
            case 'llllvar':
                return 4;
            case 'lllllvar':
                return 5;
            case 'llllllvar':
                return 6;
            default:
                return 0;
        }
    },
    validateFields: (self) => {
        const obj = self.Msg;
        const customFormats = self.formats;
        let state = false;
        for (const field in obj) {
            if (parseInt(field, 10) > 64)
                self.includesSecondaryBitmap = true;
            if (obj.hasOwnProperty(field)) {
                // @ts-ignore
                const this_format = customFormats[field] || formats_1.default[field];
                if (this_format && (0, types_1.default)(this_format, obj[field], field)) {
                    state = true;
                }
                else {
                    return new Error('field ' + field + ' error');
                }
            }
        }
        return state;
    },
    /**
     * Get the expected response MTI of an MTI
     * @method getResType
     * @param {string} reqType The request or outgoing MTI
     * @returns {string|object} The expected response MTI | Error object
     * @example T.getResType("0100") -> "0110"
     * @example T.getResType("01000") ->  {error: 'mti invalid'}
     */
    getResType: (reqType) => {
        switch (reqType) {
            case '0100':
            case '0101':
                return '0110';
            case '0120':
            case '0121':
                return '0130';
            case '0200':
            case '0201':
                return '0210';
            case '0202':
            case '0203':
                return '0212';
            case '0220':
            case '0221':
                return '0230';
            case '0332':
                // '0323' ignored
                return '0322';
            case '0400':
            case '0401':
                return '0410';
            case '0410':
            case '0420':
            case '0421':
                return '0430';
            case '0500':
            case '0501':
                return '0510';
            case '0520':
            case '0521':
                return '0530';
            case '0532':
                // '0523' ignored
                return '0522';
            case '0600':
            case '0601':
                return '0610';
            case '0620':
            case '0621':
                return '0630';
            default:
                return '';
        }
    },
    getTransType: (id) => {
        if (transactionTypes_1.default[id])
            return transactionTypes_1.default[id];
        else
            return 'Code ' + id + ' Name Undefined';
    },
    getAccType: (id) => {
        if (accountTypes_1.default[id])
            return accountTypes_1.default[id];
        else
            return 'Code ' + id + ' Name Undefined';
    },
    getTranStatus: (id) => {
        if (transactionStatus_1.default[id])
            return transactionStatus_1.default[id];
        else
            return 'Code ' + id + ' Name Undefined';
    },
    isXmlEncoded: (s) => {
        if (!s)
            return false;
        if (s.startsWith('<') && s.endsWith('>'))
            return true;
        if (s.startsWith("'<") && s.endsWith(">'"))
            return true;
        return false;
    },
};
