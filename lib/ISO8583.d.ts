/// <reference types="node" />
import { KeyValueStringT } from './t';
import * as Types from './t';
import ISO8583Base from './ISO8583Base';
/**
 * Main ISO 8583 Class used to create a new message object with formating methods.
 * @param {object} message - An ISO 8583 message in JSON format.
 * @param {object} customFormats - Custom ISO 8583 format definitions.
 * @param {object} requiredFieldsSchema - Required field Schema definitions for different message types.
 * @example new Main(SomeMessage,customFormats, requiredFieldConfig) -> Main..
 */
export default class ISO8583 extends ISO8583Base {
    dataString: string;
    constructor(message?: Types.ISOMessageT, customFormats?: Types.CustomFormatsT, requiredFieldsSchema?: any);
    static getFieldDescription(fields?: string | string[] | number | number[] | null, customFormats?: Types.CustomFormatsT): any;
    setMetadata(metaData: string): this;
    /**
     * Convert an ISO 8583 message to a retransmit type; Append the retransmit MTI.
     * @function
     * @returns {object} New ISO 8583 message with a retransmit MTI.
     * @example toRetransmit({'0': '0100', ...}) -> {'0': '0101', ...}
     */
    toRetransmit(): void | import("./ISO8583Base").ISO8583JSONMessageType;
    /**
     * Convert an ISO 8583 message to a response type; Append the response MTI.
     * @function
     * @returns {object} New ISO 8583 message with a response MTI.
     * @example toResponse({'0': '0100', ...}) -> {'0': '0110', ...}
     */
    toResponse(): void | import("./ISO8583Base").ISO8583JSONMessageType;
    /**
     * Convert an ISO 8583 message to an advise type; Append the an advise MTI.
     * @function
     * @returns {object} New ISO 8583 message with an advise MTI.
     * @example toAdvice({'0': '0100', ...}) -> {'0': '0120', ...}
     */
    toAdvice(): void | import("./ISO8583Base").ISO8583JSONMessageType;
    checkSpecialFields(): true | void | import("./errors").DefaultError;
    getLenBuffer(len: number): Buffer;
    getTType(): string | void | import("./errors").DefaultError;
    getTransactionType(): string | void | import("./errors").DefaultError;
    getAccType(): string | void | import("./errors").DefaultError;
    getAccountTypeFrom(): string | void | import("./errors").DefaultError;
    getAccountTypeTo(): string | void | import("./errors").DefaultError;
    getTransStatus(): string | void | import("./errors").DefaultError;
    attachTimeStamp(): void | import("./errors").DefaultError | import("./ISO8583Base").ISO8583JSONMessageType;
    /**
     * Check if message is valid.
     * @returns {boolean} true
     * @returns {boolean} false
     * @example new Main(SomeValidMessage,customFormats, []).validateMessage() -> true
     * @example new Main(SomeInvalidMessage,customFormats, []).validateMessage() -> false
     */
    validateMessage(): boolean | import("./errors").DefaultError;
    validateEcho(iso_send: KeyValueStringT, iso_answer: KeyValueStringT): boolean;
    checkMTI(): boolean | void;
    _checkMTI(mti: string): boolean;
    /**
     * Get the Message Type Identifier (MTI)
     * @returns {buffer} ISO 8583 encoded Buffer
     * @returns {object} Object with property error
     * @example new Main(SomeValidMessage,customFormats, []).getMti() -> 0100
     * @example new Main(SomeInvalidMessage,customFormats, []).getMti() -> {error: 'some error message'}
     */
    getMti(): string | void | import("./errors").DefaultError;
    getResMTI(): "" | "0110" | "0130" | "0210" | "0212" | "0230" | "0322" | "0410" | "0430" | "0510" | "0530" | "0522" | "0610" | "0630" | undefined;
    rebuildField(field: string, bitmapLength?: number): boolean | void | import("./errors").DefaultError;
    upackFieldWithBitmap(parentField: string, bitmaLength: number): void | import("./errors").DefaultError;
    unpackKeyValueStringField(field: string): true | void;
    rebuildExtensions(): boolean | void | import("./errors").DefaultError;
    /**
     * Gets the bitmap of entire message field 0 to 127
     * @returns {string} The bitmap of fields 0-127 in binary form
     * @returns {object} Object with property error
     * @example new Main(SomeValidMessage,customFormats, []).getBmpsBinary() -> 1111001000111.....
     * @example new Main(SomeInvalidMessage,customFormats, []).getBmpsBinary() -> {error: 'some error message'}
     */
    getBmpsBinary(): string | void | import("./errors").DefaultError;
    /**
     * Gets the bitmap of fields 127.0 to 127.63
     * @returns {string} The bitmap of fields 127.0 to 127.63 in binary form
     * @returns {object} Object with property error
     * @example new Main(SomeValidMessage,customFormats, []).getBitMapHex_127_ext() -> 8000008000000000
     * @example new Main(SomeInvalidMessage,customFormats, []).getBitMapHex_127_ext() -> {error: 'some error message'}
     */
    getBitMapHex_127_ext(): string | import("./errors").DefaultError;
    /**
     * Gets the bitmap of fields 127.25.0 to 127.63
     * @returns {string} The bitmap of fields 127.25.0 to 127.25.63 in binary form
     * @returns {object} Object with property error
     * @example new Main(SomeValidMessage,customFormats, []).getBitMapHex_127_ext_25() -> fe1e5f7c00000000
     * @example new Main(SomeInvalidMessage,customFormats, []).getBitMapHex_127_ext_25() -> {error: 'some error message'}
     */
    getBitMapHex_127_ext_25(): string | import("./errors").DefaultError;
    getBitMapHex(): string | number | import("./errors").DefaultError;
    getBitMapFields(): void | number[];
    hasSecondaryBitmap(primaryBitmapBuffer: Buffer, config: Types.Config): boolean;
    /**
     * Convert an ISO 8583 message buffer to JSON, Refer to configuration ::Deprecated
     * @deprecated Will be removed in the next version, use decode instead
     * @param {buffer} buffer ISO 8583 encoded buffer
     * @param {object} config Custom conf configurations. Can be { lenHeaderEncoding: 'utf8'/'hex', bitmapEncoding: 'utf8'/'hex', secondaryBitmap: false/true, }
     * @returns {object} ISO 8583 JSON
     * @returns {object} Object with property error
     * @example new Main().getIsoJSON(buffer, config) -> {...}
     * @example new Main().getIsoJSON(buffer, config) -> {error: 'some error message'}
     */
    getIsoJSON(buffer: Buffer, config: Types.KeyValueT): KeyValueStringT | import("./errors").DefaultError;
    /**
     * Convert an ISO 8583 message buffer to JSON, Refer to configuration
     * @param {buffer} buffer ISO 8583 encoded buffer
     * @param {object} config Custom conf configurations. Can be { lenHeaderEncoding: 'utf8'/'hex', bitmapEncoding: 'utf8'/'hex', secondaryBitmap: false/true, }
     * @returns {object} ISO 8583 JSON
     * @returns {object} Object with property error
     * @example new Main().getIsoJSON(buffer, config) -> {...}
     * @example new Main().getIsoJSON(buffer, config) -> {error: 'some error message'}
     */
    decode(): KeyValueStringT | import("./errors").DefaultError;
    buildBitmapBuffer(bitmap: string, type: string): Buffer;
    /**
     * @deprecated will be removed in next version. Use encode instead
     * @param {buffer} buffer ISO 8583 encoded buffer
     * @param {object} config Custom conf configurations
     * @returns {buffer} ISO 8583 encoded Buffer
     * @returns {object} Object with property error
     * @example new Main(SomeValidMessage,customFormats, []).getBufferMessage() -> <Buffer 01 11 30 31 30 30 f2 ...
     * @example new Main(SomeInvalidMessage,customFormats, []).getBufferMessage() -> {error: 'some error message'}
     */
    getBufferMessage(): Buffer;
    /**
     *
     * @returns {buffer} ISO 8583 encoded Buffer
     * @returns {object} Object with property error
     * @example new Main(SomeValidMessage,customFormats, []).getBufferMessage() -> <Buffer 01 11 30 31 30 30 f2 ...
     * @example new Main(SomeInvalidMessage,customFormats, []).getBufferMessage() -> {error: 'some error message'}
     */
    encode(): Buffer;
    getRawMessage(): Buffer;
    expandFields(field: number | string): string;
    contractField(field: string): string | number;
    addField(field: string | number, data: string): true | import("./errors").DefaultError;
    addFromDiObject(): true | import("./errors").DefaultError;
    getJsonFromXml(xmString: string): void;
    getXMLString(): void;
    throwMessageUndef(): void;
}
