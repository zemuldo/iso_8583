'use strict';

let types = {};

types['n'] = function(options, data) {
    let state = false
    for (let i=0;i<data.length;i++){
        if(data[i].length === 1 && data[i].match(/[0-9]/i)){
            state = true
        }
        else{
            return false
        }
    }
    return state
};

types['b'] = function(options, data) {
    let state = false
    for (let i=0;i<data.length;i++){
        if(data[i].length === 1 && data[i].match(/[0,1]/i)){
            state = true
        }
        else{
            return false
        }
    }
    return state
};

types['z'] = function(options, data) {
    return true
};

types['an'] = function(options, data) {
    let state = false
    for (let i=0;i<data.length;i++){
        if(data[i].length === 1 && data[i].match(/[0-9,a-z]/i)){
            state = true
        }
        else{
            return false
        }
    }
    return state
};

types['ans'] = function(options, data) {
    let state = false
    for (let i=0;i<data.length;i++){
        if(data[i].length === 1 && (data[i].match(/[0-9,a-z]/i) || data[i]==' ')){
            state = true
        }
        else{
            return false
        }
    }
    return state
};
types['x+n'] = function(options, data) {
    let state = false
    if(data[1].match(/[c,d]/i) || data[0].match(/[c,d]/i))
    for (let i=2;i<data.length;i++){
        if(data[i].length === 1 && data[i].match(/[0-9,a-z]/i)){
            state = true
        }
        else{
            return false
        }
    }
    return state
};

module.exports = function(options, data) {
    if (!types[options.ContentType]) {
        throw new Error('type ' + options.type + ' is not implemented on field ' + options.field);
    } else {
        return types[options.ContentType].apply(this, [options, data]);
    }
};
