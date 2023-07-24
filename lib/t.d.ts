/// <reference types="node" />
export interface Config {
    bitmapEncoding: BufferEncoding;
    [key: string]: string | BufferEncoding;
}
export interface KeyValueStringT {
    [key: string]: string;
}
export interface KeyValueT {
    [key: string]: string | boolean;
}
export type RequireFields = {
    [key: string]: number[];
};
export interface RequiredFieldSchemaT {
    processing_code: string;
    required_fields: RequireFields[];
    required_echo: number[];
}
export interface CustomFormatT {
    ContentType?: string;
    Label?: string;
    LenType?: string;
    MaxLen?: number;
    MinLen?: number;
}
export interface CustomFormatsT {
    [key: string]: CustomFormatT;
}
export interface Err {
    error: string;
}
export type ISO8583RawT = Buffer;
export interface ISO8583JsonT {
    [key: string | number]: string;
}
export interface BitMap {
    [key: string | number]: number;
}
export type ISOMessageT = ISO8583JsonT | ISO8583RawT;
/**
 * Main ISO 8583 Class used to create a new message object with formating methods.
 * @param {object} message - An ISO 8583 message in JSON format.
 * @param {object} customFormats - Custom ISO 8583 format definitions.
 * @param {object} requiredFieldsSchema - Required field Schema definitions for different message
 * @example new Main(SomeMessage,customFormats, requiredFieldConfig) -> Main..
 */
export declare class Main {
    MsgType: string | null;
    BufferMsg: ISO8583RawT | null;
    Msg: ISO8583JsonT | null;
    formats: CustomFormatsT;
    hasSpecialFields: boolean;
    bitmaps: KeyValueStringT | null;
    fields: KeyValueStringT;
    requiredFieldsSchema: RequiredFieldSchemaT;
    metaData: KeyValueStringT;
    maskPan: () => void;
    toSafeLog: () => void;
    assembleBitMap: () => Error | BitMap;
    assembleBitMap_127: () => void;
    assembleBitMap_127_25: () => void;
    unpack_0_127: () => void;
    unpack_127_1_63: () => void;
    unpack_127_25_1_63: () => void;
    assemble0_127_Fields: () => void;
    assemble127_extensions: () => void;
    assemble127_25_extensions: () => void;
    includesSecondaryBitmap: boolean;
    constructor(message: ISOMessageT, customFormats: CustomFormatsT, requiredFieldsSchema: RequiredFieldSchemaT);
}
