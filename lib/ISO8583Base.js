"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const safeToLog_1 = require("./safeToLog");
const SpT = require("./specialFields/tools");
const maskPan_1 = require("./maskPan");
/**
 * Set of methods for unpacking TCP message encoded in ISO 8583 format. Members of Main Class
 * @module Message-UnPackage
 */
const unpack_0_127_1 = require("./unpack/unpack_0_127");
const unpack_127_1_63_1 = require("./unpack/unpack_127_1_63");
const unpack_127_25_1_63_1 = require("./unpack/unpack_127_25_1_63");
/**
 * Set of methods for assembling the bitmaps for message field 0-127, 127.0-63, 127.25.0-39. Members of Main Class
 * @module Bitmap-Assemble
 */
const assembleBitMap_1 = require("./bitmap/assembleBitMap");
const assembleBitMap_127_1 = require("./bitmap/assembleBitMap_127");
const assembleBitMap_127_25_1 = require("./bitmap/assembleBitMap_127_25");
/**
 * Set of methods for packing JSON message into a Buffer message. Members of Main Class
 * @module Message-Package
 */
const assemble0_127_Fields_1 = require("./pack/assemble0_127_Fields");
const assemble127_extensions_1 = require("./pack/assemble127_extensions");
const assemble127_25_extensions_1 = require("./pack/assemble127_25_extensions");
class ISO8583Base {
    constructor(message, customFormats, requiredFieldsSchema) {
        this.MsgType = null;
        this.BufferMsg = null;
        this.Msg = {};
        this.optionalSecondaryBitmap = false;
        this.config = {};
        this.metaData = '';
        this.excessBuffer = null;
        this.embededProperties = { field_127_25_key_value_string: false, exclude127Bitmap: false };
        this.formats = customFormats || {};
        this.hasSpecialFields = false;
        if (Buffer.isBuffer(message)) {
            this.BufferMsg = message;
        }
        else if (message) {
            // @ts-ignore
            this.MsgType = message[0];
            this.Msg = message;
            this.hasSpecialFields = SpT.detectSpecial(this.Msg);
        }
        this.bitmaps = new Uint8Array();
        this.fields = {};
        this.requiredFieldsSchema = requiredFieldsSchema;
        this.maskPan = maskPan_1.default.bind(this);
        this.toSafeLog = safeToLog_1.default.bind(this);
        this.assembleBitMap = assembleBitMap_1.default.bind(this);
        this.assembleBitMap_127 = assembleBitMap_127_1.default.bind(this);
        this.assembleBitMap_127_25 = assembleBitMap_127_25_1.default.bind(this);
        this.unpack_0_127 = unpack_0_127_1.default.bind(this);
        this.unpack_127_1_63 = unpack_127_1_63_1.default.bind(this);
        this.unpack_127_25_1_63 = unpack_127_25_1_63_1.default.bind(this);
        this.assemble0_127_Fields = assemble0_127_Fields_1.default.bind(this);
        this.assemble127_extensions = assemble127_extensions_1.default.bind(this);
        this.assemble127_25_extensions = assemble127_25_extensions_1.default.bind(this);
        this.includesSecondaryBitmap = false;
    }
}
exports.default = ISO8583Base;
