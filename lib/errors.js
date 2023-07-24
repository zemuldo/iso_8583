"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultError = void 0;
class DefaultError extends Error {
    constructor(message) {
        super(message);
        this.error = 'Unknown error';
        this.error = message;
    }
}
exports.DefaultError = DefaultError;
