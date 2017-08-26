'use strict';

const assert = require('assert');

let types = {};

types['n'] = function(options, data) {
    let buf;
    if (options.LenType=="fixed") {
        assert(data.length === options.length, 'wrong length on fixed length data element ' + options.field);
        let arr = new Uint8Array(data.length);

        for (let i = 0; i < data.length; i++) {
            arr[i] = parseInt(data[i]);
        }

        buf = new Buffer(arr);
    } else {
        if (options.MaxLen) {
            assert(data.length <= options.MaxLen, 'wrong length on variable length element ' + options.field);
        }

        let arr = new Uint8Array(data.length);

        for (let i = 0; i < data.length; i++) {
            arr[i] = parseInt(data[i]);
        }

        // variable lengths need length attached
        let len = new Uint8Array(1);
        len[0] = arr.length;
        return Buffer.concat([Buffer(len), Buffer(arr)], arr.length + 1);
    }
    return buf;
};

types['b'] = function(options, data) {
    if (options.fixed) {
        // expect the data to be in hex
        assert((data.length * 2) === options.length, 'wrong length on fixed length binary data element ' + options.field);
        return new Buffer(data, 'hex');
    } else {
        // TODO fix this
        let arr = new Buffer(data);

        // variable lengths need length attached
        let len = new Uint8Array(1);
        len[0] = arr.length;
        return Buffer.concat([Buffer(len), arr], arr.length + 1);
    }
};

types['z'] = function(options, data) {
    return new Buffer(data);
};

types['an'] = function(options, data) {
    if (options.fixed) {
        assert(data.length === options.length, 'wrong length on fixed length an field ' + options.field);
        return new Buffer(data);
    } else {
        let arr = new Buffer(data);

        // variable lengths need length attached
        let len = new Uint8Array(1);
        len[0] = arr.length;
        return Buffer.concat([Buffer(len), arr], arr.length + 1);
    }
};

types['ans'] = function(options, data) {
    if (options.fixed) {
        assert(data.length === options.length, 'wrong length on fixed length ans field ' + options.field);
        return new Buffer(data);
    } else {
        let arr = new Buffer(data);

        // variable lengths need length attached
        let len = new Uint8Array(1);
        len[0] = arr.length;
        return Buffer.concat([Buffer(len), arr], arr.length + 1);
    }
};
types['x+n'] = function(options, data) {
    if (options.fixed) {
        assert(data.length === options.length, 'wrong length on fixed length ans field ' + options.field);
        return new Buffer(data);
    } else {
        let arr = new Buffer(data);

        // variable lengths need length attached
        let len = new Uint8Array(1);
        len[0] = arr.length;
        return Buffer.concat([Buffer(len), arr], arr.length + 1);
    }
};

module.exports = function(options, data) {
    if (!types[options.ContentType]) {
        throw new Error('type ' + options.type + ' is not implemented on field ' + options.field);
    } else {
        return types[options.ContentType].apply(this, [options, data]);
    }
};
