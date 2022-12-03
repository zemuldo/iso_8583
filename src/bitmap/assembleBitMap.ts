// @ts-nocheck
import * as Types from '../t';
import T from '../tools';

/**
 * Assembles the Bitmap of fields 0-127 for the ISO 8583 message in the Main class Instance.
 * @method assembleBitmap
 * @memberof module:Bitmap-Assemble
 */
function assembleBitmap(): Types.BitMap | Types.Error {
  if (this.checkMTI()) {
    const upper = this.hasSpecialFields ? 193 : 128;
    let _map = new Uint8Array(upper);
    const fields = Object.keys(this.Msg);

    // Support backward compat
    if (this.includesSecondaryBitmap || !this.optionalSecondaryBitmap) {
      _map[0] = 1;
    } else if (!this.includesSecondaryBitmap) {
      _map = _map.slice(0, 64);
    }

    // construct 128 bit mask
    for (let i = 0; i < fields.length; i++) {
      const field = parseInt(fields[i], 10);
      if (field > 1) {
        _map[field - 1] = 1;
      }
    }
    this.bitmaps = _map;
    return _map;
  } else return T.toErrorObject('bitmap error, iso message type undefined or invalid');
}
export default assembleBitmap;
