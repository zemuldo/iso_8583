module.exports = function (self){
  let metaDataBuf;
  if (self.metaData) {
    metaDataBuf = Buffer.alloc(self.metaData.length, self.metaData);
    return metaDataBuf;
  } else {
    metaDataBuf = Buffer.alloc(0, null);
    return metaDataBuf;
  }
};