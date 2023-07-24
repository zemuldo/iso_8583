/// <reference types="node" />
import * as Types from '../t';
/**
 * Unpack fields 0-127 from an ISO 8583 encoded string into a JSON
 * @method unpack_0_127
 * @memberof module:Message-UnPackage
 */
export default function (incoming: Buffer, isoJSON: Types.KeyValueStringT, config: Types.KeyValueT): any;
