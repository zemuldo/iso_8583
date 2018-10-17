

module.exports = {
  isXML: (data) => {
    const sample = data.toString()[data.length - 4] + data.toString()[data.length - 3] + data.toString()[data.length - 2];
    if (sample === 'Xml') {
      return true;
    }
    return false;
  },
};
