const T = require('../tools')

module.exports = function () {
    let extend = this.rebuildExtensions();
    let state = this.checkMTI();
    if (state && !extend.error) {
      if (this.Msg['0'] && state) {
        let _map = new Uint8Array(64);
        for (let i = 0; i < _map.length; i++) {
          let field = '127.' + (i + 1);

          if (this.Msg[field]) {
            _map[i] = 1;
          }
        }
        return _map;
      } else return T.toErrorObject('bitmap error, iso message type undefined or invalid');
    } else return T.toErrorObject('bitmap error, iso message type undefined or invalid');
  }
