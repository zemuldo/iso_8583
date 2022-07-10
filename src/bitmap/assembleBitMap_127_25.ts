// @ts-nocheck
import T from '../tools';

/**
 * Assembles the Bitmap of fields 127.25.0-63 for the ISO 8583 message in the Main class Instance.
 * @method assembleBitmap_127_25
 * @memberof module:Bitmap-Assemble
 */
function assembleBitmap_127_25() {
  const extend = this.rebuildExtensions();
  const state = this.checkMTI();
  if (state && !extend.error) {
    if (this.Msg['0'] && state) {
      const _map = new Uint8Array(64);
      for (let i = 0; i < _map.length; i++) {
        const field = '127.25.' + (i + 1);
        if (this.Msg[field]) {
          _map[i] = 1;
        }
      }
      return _map;
    } else return T.toErrorObject('bitmap error, iso message type undefined or invalid');
  } else return T.toErrorObject('bitmap error, iso message type undefined or invalid');
}
export default assembleBitmap_127_25;
