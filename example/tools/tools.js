
const formats = require('./formats');
const transTypes = require('./transactionTypes');
const accTypes = require('./transactionStatus');
const accntTypes = require('./accountTypes');
const checkTypes = require('./types');

module.exports = {
  getHex: (hexaString) => {
    const mapping = {
      0: '0000',
      1: '0001',
      2: '0010',
      3: '0011',
      4: '0100',
      5: '0101',
      6: '0110',
      7: '0111',
      8: '1000',
      9: '1001',
      a: '1010',
      b: '1011',
      c: '1100',
      d: '1101',
      e: '1110',
      f: '1111',
      A: '1010',
      B: '1011',
      C: '1100',
      D: '1101',
      E: '1110',
      F: '1111',
    };
    let bitmaps = '';
    for (let i = 0; i < hexaString.length; i += 1) {
      bitmaps += mapping[hexaString[i]];
    }

    return bitmaps;
  },

  getHexString: string => parseInt(string, 10).toString(16),
  getLenType: (lentype) => {
    if (lentype === 'llvar') {
      return 2;
    } if (lentype === 'lllvar') {
      return 3;
    } if (lentype === 'llllvar') {
      return 4;
    } if (lentype === 'lllllvar') {
      return 4;
    }
    return 0;
  },
  validateFields: (obj) => {
    const keys = Object.keys(obj);
    for (const field of keys) {
      if (!(formats[field] && obj[field].length > 1 && checkTypes(formats[field], obj[field]))) return { error: `field ${field} error` };
    }
    return true;
  },
  getResType: (reqType) => {
    switch (reqType) {
      case '0100':
        return '0110';
      case '0101':
        return '0110';

      case '0120':
        return '0130';
      case '0121':
        return '0130';

      case '0200':
        return '0210';
      case '0201':
        return '0210';

      case '0202':
        return '0212';
      case '0203':
        return '0212';

      case '0220':
        return '0230';
      case '0221':
        return '0230';

      case '0332':
        // '0323' ignored
        return '0322';

      case '0400':
        return '0410';
      case '0401':
        return '0410';

      case '0420':
        return '0430';
      case '0421':
        return '0430';

      case '0500':
        return '0510';
      case '0501':
        return '0510';

      case '0520':
        return '0530';
      case '0521':
        return '0530';

      case '0532':
        // '0523' ignored
        return '0522';

      case '0600':
        return '0610';
      case '0601':
        return '0610';

      case '0620':
        return '0630';
      case '0621':
        return '0630';

      default:
        return { error: 'mti invalid' };
    }
  },
  getTType: (id) => {
    if (id) {
      return transTypes[id];
    }
    return { error: 'transaction type not defined in message' };
  },
  getAccType: (id) => {
    if (id) {
      return accntTypes[id];
    }
    return { error: 'transaction type not defined in message' };
  },
  getTranStatus: (id) => {
    if (accTypes[id]) {
      return accTypes[id];
    }

    return `Code ${id} Name Undefined`;
  },
  fill: (data) => {
    const d = data.toString();
    return `${d.length > 1 ? '' : '0'}${d}`;
  },
};
