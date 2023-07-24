"use strict";
// @ts-nocheck
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (self) => {
    return self.metaData ? Buffer.alloc(self.metaData.length, self.metaData) : Buffer.alloc(0, null);
};
