import { DefaultError } from './errors';
import * as Types from './t';
import toSafeLog from './safeToLog';
import * as SpT from './specialFields/tools'

const maskPan = require('./maskPan');

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
 * @param {object} requiredFieldsSchema - Required field Schema definitions for different message types.
 * @example new Main(SomeMessage,customFormats, requiredFieldConfig) -> Main..
 */

export interface ISO8583JSONMessageType {
  [key: string]: string;
}

export type ISO8583RawMessageType = Buffer;

export type ISO8583MessageType = ISO8583JSONMessageType | ISO8583RawMessageType;

export default class ISO8583Base {
  MsgType: string | null = null;
  BufferMsg: Types.ISO8583RawT | null = null;
  Msg: ISO8583JSONMessageType | null = {};
  formats: Types.CustomFormatsT;
  hasSpecialFields: boolean;
  optionalSecondaryBitmap: boolean = false;
  bitmaps: Uint8Array;
  fields: Types.KeyValueStringT;
  requiredFieldsSchema: any;

  config: Types.KeyValueT = {};

  metaData: string = '';

  excessBuffer: Buffer | null = null;

  maskPan: () => void;
  toSafeLog: (config: Types.KeyValueStringT, data: Types.KeyValueStringT, panMaskFormat: string) => void;

  assembleBitMap: () => DefaultError | Types.BitMap;
  assembleBitMap_127: () => DefaultError | Types.BitMap;
  assembleBitMap_127_25: () => DefaultError | Types.BitMap;

  unpack_0_127: (
    incoming: Buffer,
    isoJSON: Types.KeyValueStringT,
    config: Types.KeyValueT,
  ) => Types.KeyValueStringT | DefaultError;
  unpack_127_1_63: (slice_127: Buffer, isoJSON: Types.KeyValueStringT) => Types.KeyValueStringT | DefaultError;
  unpack_127_25_1_63: (slice_127_25: Buffer, isoJSON: Types.KeyValueStringT) => Types.KeyValueStringT | DefaultError;

  assemble0_127_Fields: () => Buffer;
  assemble127_extensions: () => Buffer;
  assemble127_25_extensions: () => Buffer;

  includesSecondaryBitmap: boolean;

  constructor(
    message?: ISO8583MessageType,
    customFormats?: Types.CustomFormatsT,
    requiredFieldsSchema?: Types.RequiredFieldSchemaT,
  ) {
    this.formats = customFormats || {};
    this.hasSpecialFields = false;
    if (Buffer.isBuffer(message)) {
      this.BufferMsg = message;
    } else if (message) {
      // @ts-ignore
      this.MsgType = message[0];
      this.Msg = message;

      this.hasSpecialFields = SpT.detectSpecial(this.Msg);
    }

    this.bitmaps = new Uint8Array();
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
