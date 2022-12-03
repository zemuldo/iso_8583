// @ts-nocheck

export default (self) => {
  return self.metaData ? Buffer.alloc(self.metaData.length, self.metaData) : Buffer.alloc(0, null);
};
