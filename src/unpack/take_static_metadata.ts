export default function (self: any, incoming: Buffer) {
  if (!self.metaData) return incoming;
  const metaDataLength = self.metaData.length;

  return incoming.slice(metaDataLength, incoming.length);
};