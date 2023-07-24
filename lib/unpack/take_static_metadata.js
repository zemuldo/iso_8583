"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(self, incoming) {
    if (!self.metaData)
        return incoming;
    const metaDataLength = self.metaData.length;
    return incoming.slice(metaDataLength, incoming.length);
}
exports.default = default_1;
;
