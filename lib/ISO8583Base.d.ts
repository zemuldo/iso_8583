/// <reference types="node" />
import { DefaultError } from './errors';
import * as Types from './t';
/**
 * Main ISO 8583 Class used to create a new message object with formating methods.
 * @param {object} message - An ISO 8583 message in JSON format.
 * @param {object} customFormats - Custom ISO 8583 format definitions.
 * @param {object} requiredFieldsSchema - Required field Schema definitions for different message types.
 * @example new Main(SomeMessage,customFormats, requiredFieldConfig) -> Main..
 */
export interface ISO8583JSONMessageType {
    [key: string]: string;
}
export interface EmbededProperties {
    field_127_25_key_value_string?: boolean;
    exclude127Bitmap?: boolean;
}
export type ISO8583RawMessageType = Buffer;
export type ISO8583MessageType = ISO8583JSONMessageType | ISO8583RawMessageType;
export default class ISO8583Base {
    MsgType: string | null;
    BufferMsg: Types.ISO8583RawT | null;
    Msg: ISO8583JSONMessageType | null;
    formats: Types.CustomFormatsT;
    hasSpecialFields: boolean;
    optionalSecondaryBitmap: boolean;
    bitmaps: Uint8Array;
    fields: Types.KeyValueStringT;
    requiredFieldsSchema: any;
    config: Types.KeyValueT;
    metaData: string;
    excessBuffer: Buffer | null;
    embededProperties: EmbededProperties;
    maskPan: (pan: string, format: string, masker?: string | undefined) => string | {
        error: string;
    };
    toSafeLog: (config: Types.KeyValueStringT, data: Types.KeyValueStringT, panMaskFormat: string) => void;
    assembleBitMap: () => DefaultError | Types.BitMap;
    assembleBitMap_127: () => Uint8Array | DefaultError;
    assembleBitMap_127_25: () => Uint8Array | DefaultError;
    unpack_0_127: (incoming: Buffer, isoJSON: Types.KeyValueStringT, config: Types.KeyValueT) => Types.KeyValueStringT | DefaultError;
    unpack_127_1_63: (slice_127: Buffer, isoJSON: Types.KeyValueStringT) => Types.KeyValueStringT | DefaultError;
    unpack_127_25_1_63: (slice_127_25: Buffer, isoJSON: Types.KeyValueStringT) => Types.KeyValueStringT | DefaultError;
    assemble0_127_Fields: () => Buffer;
    assemble127_extensions: () => Buffer | DefaultError;
    assemble127_25_extensions: () => Buffer | DefaultError;
    includesSecondaryBitmap: boolean;
    constructor(message?: ISO8583MessageType, customFormats?: Types.CustomFormatsT, requiredFieldsSchema?: Types.RequiredFieldSchemaT);
}
