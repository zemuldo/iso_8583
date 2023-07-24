/// <reference types="node" />
import { DefaultError } from './errors';
import ISO8583Base from './ISO8583Base';
/**
 * Handy Utils for transforming data
 * @module Tools
 */
declare const _default: {
    /**
     * Convert TCP message string length to a buffer, should be a number that fits in one byte.
     * @method getTCPHeaderBuffer
     * @param {integer} indicator length of ISO 8583 message string.
     * @returns {buffer} 1 byte buffer representing the message length indicator
     */
    getTCPHeaderBuffer: (indicator: number) => Buffer;
    /**
     * Format error to a universal object. Can take an array of strings to join or just a string.
     * @method toErrorObject
     * @param {string|string[]} errors
     * @returns {object} Object having property error
     * @example Tools.toErrorObject("some error") -> {error: "some error"}
     * @example Tools.toErrorObject("some error on field", 67, "happened" ) -> {error: "some error on field 67 happened"}
     */
    toErrorObject: (errors: (string | number | undefined)[] | string | number) => DefaultError;
    toInvalidLengthErrorObject: (field: string | number, invalidLength: number) => DefaultError;
    /**
     * Convert a hexadecimal string in to binary string: To a string of 0s and 1s
     * @method getHex
     * @param {string} hexaString
     * @returns {string} A string of 0s and 1s representing the hexadecimal string input
     * @example Tools.getHex("EF") -> "11101111"
     * @example Tools.getHex("EFEF") -> "1110111111101111"
     */
    getHex: (hexaString: string) => string;
    /**
     * Convert a string of integers to hexadecimal string.
     * @method getHexString
     * @param {string} string A string of integers
     * @returns {string} A hexadecimal string representation of the string of integers received
     * @example T.getHexString("123456") -> "1e240"
     */
    getHexString: (string: string) => string;
    getLenType: (lentype: string | undefined) => 0 | 1 | 2 | 3 | 4 | 5 | 6;
    validateFields: (self: ISO8583Base) => boolean | Error;
    /**
     * Get the expected response MTI of an MTI
     * @method getResType
     * @param {string} reqType The request or outgoing MTI
     * @returns {string|object} The expected response MTI | Error object
     * @example T.getResType("0100") -> "0110"
     * @example T.getResType("01000") ->  {error: 'mti invalid'}
     */
    getResType: (reqType: string) => "" | "0110" | "0130" | "0210" | "0212" | "0230" | "0322" | "0410" | "0430" | "0510" | "0530" | "0522" | "0610" | "0630";
    getTransType: (id: string) => string;
    getAccType: (id: string) => string;
    getTranStatus: (id: string) => string;
    isXmlEncoded: (s: string) => boolean;
};
export default _default;
