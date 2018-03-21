const formats = require('./formats');

module.exports = {
  validateSpecialFields: (msg, customFormats) => {
    let fields = Object.keys(msg);
    let i = 0;
    for (i; i < fields.length; i++) {
      if (formats[fields[i]] && !customFormats[fields[i]]) {
        return {error: `Special field ${fields[i]} has no custom formats`};
      }
    }
    if (i === fields.length) {
      return true;
    }
  },
  detectSpecial: (msg) => {
    let state = false;
    let fields = Object.keys(msg);
    let i = 0;
    for (i; i < fields.length; i++) {
      if (formats[fields[i]]) {
        return true;
      }
    }
    if (i === fields.length) {
      return state;
    }
  }
};