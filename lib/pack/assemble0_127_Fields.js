const T = require('../tools');
const formats = require('../formats');
const types = require('../types');
const SpT = require('../specialFields/tools');

/**
 * Assemble fields 0-127 into ISO 8583 encoded string
 * @method assemble0_127_Fields
 * @memberof module:Message-Package
 */
 function assemble0_127_Fields () {
  let bitMapCheck = this.getBitMapHex();
  let state = this.assembleBitMap();
  let validDate = T.validateFields(this.Msg, this.formats);
  let specialValidate = SpT.validateSpecialFields(this.Msg, this.formats);
  let mti = this.getMti();
  //expects array of 0s & 1s and data-json object
  if (
    !state.error &&
    !validDate.error &&
    !specialValidate.error &&
    !bitMapCheck.error &&
    !mti.error
  ) {
    let mtiBuffer = Buffer.alloc(4, mti);

    let buff;
    const this_format = this.formats['1'] || formats['1'];
    if (this_format.ContentType === 'an')
      buff = this.buildBitmapBuffer(bitMapCheck, 'ascii');
    else buff = this.buildBitmapBuffer(bitMapCheck, 'hex');

    buff = Buffer.concat([mtiBuffer, buff]);

    let counter = 0;
    for (let i = 1; i < this.bitmaps.length; i++) {
      counter++;
      let field = i + 1;
      if (this.bitmaps[i] === 1) {
        //present
        if (field === 127) {
          let _127_exetnsions = this.assemble127_extensions();
          if (!_127_exetnsions.error) {
            if (_127_exetnsions.byteLength > 12) {
              buff = Buffer.concat([buff, _127_exetnsions]);
              continue;
            } else {
              continue;
            }
          } else {
            return _127_exetnsions;
          }
        }
        if (!this.Msg[field]) {
          return T.toErrorObject(['Field ', field, ' in bitmap but not in json']);
        }
        let this_format = this.formats[field] || formats[field];
        let state = types(this_format, this.Msg[field], field);
        if (state.error) {
          return state;
        }
        if (this_format) {
          if (this_format.LenType === 'fixed') {
            if (this_format.ContentType === 'b') {
              if (this_format.MaxLen === this.Msg[field].length) {
                let size = this_format.MaxLen / 2;
                let thisBuff = Buffer.alloc(size, this.Msg[field], 'hex');
                buff = Buffer.concat([buff, thisBuff]);
              } else {
                return T.toErrorObject(['invalid length of data on field ', field]);
              }
            } else {
              if (this_format.MaxLen === this.Msg[field].length) {
                let thisBuff = Buffer.alloc(
                  this.Msg[field].length,
                  this.Msg[field]
                );
                buff = Buffer.concat([buff, thisBuff]);
              } else {
                return T.toErrorObject(['invalid length of data on field ', field]);
              }
            }
          } else {
            let thisLen = T.getLenType(this_format.LenType);
            if (!this_format.MaxLen)
              return T.toErrorObject(['max length not implemented for ', this_format.LenType, field]);
            if (
              this.Msg[field] &&
              this.Msg[field].length > this_format.MaxLen
            )
              return T.toErrorObject(['invalid length of data on field ', field]);
            if (thisLen === 0) {
              return T.toErrorObject(['field', field, ' has no field implementation']);
            } else {
              let actualLength = this.Msg[field].length;
              let padCount = thisLen - actualLength.toString().length;
              let lenIndicator = actualLength.toString();
              for (let i = 0; i < padCount; i++) {
                lenIndicator = 0 + lenIndicator;
              }
              let thisBuff = Buffer.alloc(
                this.Msg[field].length + lenIndicator.length,
                lenIndicator + this.Msg[field]
              );
              buff = Buffer.concat([buff, thisBuff]);
            }
          }
        } else {
          return T.toErrorObject(['field ', field, ' has invalid data']);
        }
      }
    }

    return Buffer.concat([buff]);
  } else {
    return state;
  }
}

module.exports = assemble0_127_Fields;