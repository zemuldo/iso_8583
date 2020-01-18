module.exports = function (self, incoming){
  if (!self.metaData) return incoming;
  const metaDataLength = self.metaData.length;

  return incoming.slice(metaDataLength, incoming.length);
};