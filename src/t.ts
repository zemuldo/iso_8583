export interface Config {
  bitmapEncoding: BufferEncoding;
  [key: string]: string | BufferEncoding;
}
export interface KeyValueStringT {
  [key: string]: string ;
}

export interface KeyValueT {
  [key: string]: string | boolean;
}

export type RequireFields = {
  [key: string]: number[];
}

export interface RequiredFieldSchemaEntryT {
  processing_code: string;
  required_fields: RequireFields[];
  required_echo: number[];
}

export interface RequiredFieldSchemaT extends Array<RequiredFieldSchemaEntryT> {}
export interface CustomFormatT {
  [key: string]: {
    ContentType: string;
    Label: string;
    LenType: string;
    MaxLen?: number;
    MinLen?: number;
  };
}

export interface Err {
  error: string;
}

export type ISO8583RawT = Buffer

export interface ISO8583JsonT {
  [key: string | number]: string;
}


export interface BitMap {
  [key: string | number]: number;
}

export type ISOMessageT = ISO8583JsonT | ISO8583RawT

const SpT = require('./specialFields/tools');
const maskPan = require('./maskPan');
const toSafeLog = require('./safeToLog');

/**
 * Set of methods for unpacking TCP message encoded in ISO 8583 format. Members of Main Class
 * @module Message-UnPackage
 */
const unpack_0_127 = require('./unpack/unpack_0_127');
const unpack_127_1_63 = require('./unpack/unpack_127_1_63');
const unpack_127_25_1_63 = require('./unpack/unpack_127_25_1_63');

/**
 * Set of methods for assembling the bitmaps for message field 0-127, 127.0-63, 127.25.0-39. Members of Main Class
 * @module Bitmap-Assemble
 */
const assembleBitMap = require('./bitmap/assembleBitMap');
const assembleBitMap_127 = require('./bitmap/assembleBitMap_127');
const assembleBitMap_127_25 = require('./bitmap/assembleBitMap_127_25');

/**
 * Set of methods for packing JSON message into a Buffer message. Members of Main Class
 * @module Message-Package
 */
const assemble0_127_Fields = require('./pack/assemble0_127_Fields');
const assemble127_extensions = require('./pack/assemble127_extensions');
const assemble127_25_extensions = require('./pack/assemble127_25_extensions');

/**
 * Main ISO 8583 Class used to create a new message object with formating methods.
 * @param {object} message - An ISO 8583 message in JSON format.
 * @param {object} customFormats - Custom ISO 8583 format definitions.
 * @param {object} requiredFieldsSchema - Required field Schema definitions for different message 
 * @example new Main(SomeMessage,customFormats, requiredFieldConfig) -> Main..
 */
export class Main {
  MsgType: string | null = null;
  BufferMsg: ISO8583RawT | null = null;
  Msg: ISO8583JsonT | null = null;
  formats: CustomFormatT;
  hasSpecialFields: boolean;
  bitmaps: KeyValueStringT | null;
  fields: KeyValueStringT;
  requiredFieldsSchema: RequiredFieldSchemaT;

  metaData: KeyValueStringT = {};

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

  constructor(
    message: ISOMessageT,
    customFormats: CustomFormatT,
    requiredFieldsSchema: RequiredFieldSchemaT,
  ) {
    if (Buffer.isBuffer(message)) {
      this.BufferMsg = message;
    } else {
      this.MsgType = message[0];
      this.Msg = message;
    }
    this.formats = customFormats || {};

    this.hasSpecialFields = SpT.detectSpecial(this.Msg, this.formats);

    this.bitmaps = null;
    this.fields = {};

    this.requiredFieldsSchema = requiredFieldsSchema;

    this.maskPan = maskPan.bind(this);
    this.toSafeLog = toSafeLog.bind(this);

    this.assembleBitMap = assembleBitMap.bind(this);
    this.assembleBitMap_127 = assembleBitMap_127.bind(this);
    this.assembleBitMap_127_25 = assembleBitMap_127_25.bind(this);

    this.unpack_0_127 = unpack_0_127.bind(this);
    this.unpack_127_1_63 = unpack_127_1_63.bind(this);
    this.unpack_127_25_1_63 = unpack_127_25_1_63.bind(this);

    this.assemble0_127_Fields = assemble0_127_Fields.bind(this);
    this.assemble127_extensions = assemble127_extensions.bind(this);
    this.assemble127_25_extensions = assemble127_25_extensions.bind(this);
    this.includesSecondaryBitmap = false;
  }
}