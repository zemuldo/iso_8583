/**
 * Unpack fields 127.25.0-127 from an ISO 8583 encoded string into a JSON
 * @method unpack_127_25_1_63
 * @memberof module:Message-UnPackage
 */
export default function (slice_127_25: any, isoJSON: any): import("../errors").DefaultError | {
    json: any;
    remSlice: any;
};
