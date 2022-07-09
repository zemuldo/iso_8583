export interface KeyValueStringT {
  [key: string]: string | object ;
}

export interface KeyValueT {
  [key: string]: string | boolean;
}

export interface CustomFormatT {
  [key: string]: {
    ContentType: string;
    Label: string;
    LenType: string;
    MaxLen?: number;
    MinLen?: number;
  };
}

export interface Error {
  error: string;
}

export type ISO8583RawT = Buffer

export interface ISO8583JsonT {
  [key: string | number]: string;
}


export interface BitMap {
  '0': 0 | 1;
  '1': 0 | 1;
  '2': 0 | 1;
  '3': 0 | 1;
  '4': 0 | 1;
  '5': 0 | 1;
  '6': 0 | 1;
  '7': 0 | 1;
  '8': 0 | 1;
  '9': 0 | 1;
  '10': 0 | 1;
  '11': 0 | 1;
  '12': 0 | 1;
  '13': 0 | 1;
  '14': 0 | 1;
  '15': 0 | 1;
  '16': 0 | 1;
  '17': 0 | 1;
  '18': 0 | 1;
  '19': 0 | 1;
  '20': 0 | 1;
  '21': 0 | 1;
  '22': 0 | 1;
  '23': 0 | 1;
  '24': 0 | 1;
  '25': 0 | 1;
  '26': 0 | 1;
  '27': 0 | 1;
  '28': 0 | 1;
  '29': 0 | 1;
  '30': 0 | 1;
  '31': 0 | 1;
  '32': 0 | 1;
  '33': 0 | 1;
  '34': 0 | 1;
  '35': 0 | 1;
  '36': 0 | 1;
  '37': 0 | 1;
  '38': 0 | 1;
  '39': 0 | 1;
  '40': 0 | 1;
  '41': 0 | 1;
  '42': 0 | 1;
  '43': 0 | 1;
  '44': 0 | 1;
  '45': 0 | 1;
  '46': 0 | 1;
  '47': 0 | 1;
  '48': 0 | 1;
  '49': 0 | 1;
  '50': 0 | 1;
  '51': 0 | 1;
  '52': 0 | 1;
  '53': 0 | 1;
  '54': 0 | 1;
  '55': 0 | 1;
  '56': 0 | 1;
  '57': 0 | 1;
  '58': 0 | 1;
  '59': 0 | 1;
  '60': 0 | 1;
  '61': 0 | 1;
  '62': 0 | 1;
  '63': 0 | 1;
  '64': 0 | 1;
  '65': 0 | 1;
  '66': 0 | 1;
  '67': 0 | 1;
  '68': 0 | 1;
  '69': 0 | 1;
  '70': 0 | 1;
  '71': 0 | 1;
  '72': 0 | 1;
  '73': 0 | 1;
  '74': 0 | 1;
  '75': 0 | 1;
  '76': 0 | 1;
  '77': 0 | 1;
  '78': 0 | 1;
  '79': 0 | 1;
  '80': 0 | 1;
  '81': 0 | 1;
  '82': 0 | 1;
  '83': 0 | 1;
  '84': 0 | 1;
  '85': 0 | 1;
  '86': 0 | 1;
  '87': 0 | 1;
  '88': 0 | 1;
  '89': 0 | 1;
  '90': 0 | 1;
  '91': 0 | 1;
  '92': 0 | 1;
  '93': 0 | 1;
  '94': 0 | 1;
  '95': 0 | 1;
  '96': 0 | 1;
  '97': 0 | 1;
  '98': 0 | 1;
  '99': 0 | 1;
  '100': 0 | 1;
  '101': 0 | 1;
  '102': 0 | 1;
  '103': 0 | 1;
  '104': 0 | 1;
  '105': 0 | 1;
  '106': 0 | 1;
  '107': 0 | 1;
  '108': 0 | 1;
  '109': 0 | 1;
  '110': 0 | 1;
  '111': 0 | 1;
  '112': 0 | 1;
  '113': 0 | 1;
  '114': 0 | 1;
  '115': 0 | 1;
  '116': 0 | 1;
  '117': 0 | 1;
  '118': 0 | 1;
  '119': 0 | 1;
  '120': 0 | 1;
  '121': 0 | 1;
  '122': 0 | 1;
  '123': 0 | 1;

  '124': 0 | 1;
  '125': 0 | 1;
  '126': 0 | 1;
  '127': 0 | 1;
  '127.1': 0 | 1;
  '127.2': 0 | 1;

  '127.3': 0 | 1;
  '127.4': 0 | 1;
  '127.5': 0 | 1;
  '127.6': 0 | 1;
  '127.7': 0 | 1;

  '127.8': 0 | 1;

  '127.9': 0 | 1;

  '127.10': 0 | 1;
  '127.11': 0 | 1;

  '127.12': 0 | 1;

  '127.13': 0 | 1;
  '127.14': 0 | 1;
  '127.15': 0 | 1;

  '127.16': 0 | 1;
  '127.17': 0 | 1;

  '127.18': 0 | 1;

  '127.19': 0 | 1;
  '127.20': 0 | 1;
  '127.21': 0 | 1;

  '127.22': 0 | 1;

  '127.23': 0 | 1;
  '127.24': 0 | 1;

  '127.25': 0 | 1;

  '127.25.1': 0 | 1;
  '127.25.2': 0 | 1;
  '127.25.3': 0 | 1;
  '127.25.4': 0 | 1;

  '127.25.5': 0 | 1;
  '127.25.6': 0 | 1;
  '127.25.7': 0 | 1;
  '127.25.8': 0 | 1;
  '127.25.9': 0 | 1;
  '127.25.10': 0 | 1;
  '127.25.11': 0 | 1;
  '127.25.12': 0 | 1;
  '127.25.13': 0 | 1;
  '127.25.14': 0 | 1;
  '127.25.15': 0 | 1;
  '127.25.16': 0 | 1;
  '127.25.17': 0 | 1;
  '127.25.18': 0 | 1;
  '127.25.19': 0 | 1;
  '127.25.20': 0 | 1;
  '127.25.21': 0 | 1;
  '127.25.22': 0 | 1;
  '127.25.23': 0 | 1;
  '127.25.24': 0 | 1;
  '127.25.25': 0 | 1;
  '127.25.26': 0 | 1;
  '127.25.27': 0 | 1;
  '127.25.28': 0 | 1;
  '127.25.29': 0 | 1;
  '127.25.30': 0 | 1;
  '127.25.31': 0 | 1;
  '127.25.32': 0 | 1;
  '127.25.33': 0 | 1;
  '127.26': 0 | 1;
  '127.27': 0 | 1;
  '127.28': 0 | 1;
  '127.29': 0 | 1;
  '127.30': 0 | 1;
  '127.31': 0 | 1;
  '127.32': 0 | 1;
  '127.33': 0 | 1;
  '127.34': 0 | 1;
  '127.35': 0 | 1;
  '127.36': 0 | 1;
  '127.37': 0 | 1;
  '127.38': 0 | 1;
  '127.39': 0 | 1;
  '128': 0 | 1;
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
  requiredFieldsSchema: KeyValueStringT;

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
    requiredFieldsSchema: KeyValueStringT,
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