const formats = require('./formats');
const accTypes = require('./accountTypes');
const transTypes = require('./transactionTypes');
const transStatus = require('./transactionStatus');
let checkTypes = require('./types');

module.exports = {
  getHex: hexaString => {
    let mapping = {
      '0': '0000',
      '1': '0001',
      '2': '0010',
      '3': '0011',
      '4': '0100',
      '5': '0101',
      '6': '0110',
      '7': '0111',
      '8': '1000',
      '9': '1001',
      'a': '1010',
      'b': '1011',
      'c': '1100',
      'd': '1101',
      'e': '1110',
      'f': '1111',
      'A': '1010',
      'B': '1011',
      'C': '1100',
      'D': '1101',
      'E': '1110',
      'F': '1111',
    };
    let bitmaps = '';
    for (let i = 0; i < hexaString.length; i++)
      bitmaps += mapping[hexaString[i]];

    return bitmaps;
  },

  getHexString: string =>{
    return parseInt(string, 10).toString(16);
  },

  getLenType: lentype => {
    switch (lentype){
      case 'lvar':
        return 1;
  
      case 'llvar':
        return 2;
  
      case 'lllvar':
        return 3;

      case 'llllvar':
        return 4;

      case 'lllllvar':
        return 5;

      case 'llllllvar':
        return 6;

      default:
        return 0;
    }
  },

  validateFields: obj =>{
    let state = false;
    for (let field in obj) {
      if (obj.hasOwnProperty(field)) {
        if (formats[field] && checkTypes(formats[field],obj[field])){
          state = true;
        } else {
          return {error: 'field ' + field + ' error'};
        }
      }
    }
    return state;
  },

  getResType: reqType =>{
    switch (reqType){
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
        //'0323' ignored
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
        //'0523' ignored
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
        return {error: 'mti invalid'};
    }

  },

  getTransType: (id)=>{
    if (transTypes[id])
      return transTypes[id];
    else
      return 'Code '+ id +' Name Undefined';
  },

  getAccType: (id)=> {
    if (accTypes[id])
      return accTypes[id];
    else
      return 'Code '+ id + ' Name Undefined';
  },

  getTranStatus: (id)=> {
    if (accTypes[id])
      return accTypes[id];
    else
      return 'Code '+ id + ' Name Undefined';
  }
};
