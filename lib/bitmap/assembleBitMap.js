const T = require('../tools');

/**
 * Assembles the Bitmap of fields 0-127 for the ISO 8583 message in the Main class Instance.
 * @method assembleBitmap
 * @memberof module:Bitmap-Assemble
 */
function assembleBitmap() {
  if (this.checkMTI()) {
    let upper = this.hasSpecialFields ? 193 : 128;
    let _map = new Uint8Array(upper);
    let fields = Object.keys(this.Msg);

    _map[0] = 1;
    // construct 128 bit mask
    for (let i = 0; i < fields.length; i++) {
      let field = parseInt(fields[i], 10);
      if (field > 1) {
        _map[field - 1] = 1;
      }
    }
    this.bitmaps = _map;
    return _map;
  } else return T.toErrorObject('bitmap error, iso message type undefined or invalid');
}
module.exports = assembleBitmap;