module.exports =  self => {
  return self.metaData
    ? Buffer.alloc(self.metaData.length, self.metaData)
    : Buffer.alloc(0, null);
};

