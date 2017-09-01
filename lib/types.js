'use strict';

let types = {};

types['a'] = function(options, data) {
    let state = false
    for (let i=0;i<data.length;i++){
        if(data[i].length === 1 && data[i].match(/[A-Z]/i)){
            state = true
        }
        else{
            return false
        }
    }
    return state
};

types['n'] = function(options, data) {
    let state = false
    for (let i=0;i<data.length;i++){
        if(data[i].match(/[0-9]/i)){
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
        if(data[i].length === 1 && data[i].match(/[0-9ABCDEF]/i)){
            state = true
        }
        else{
            return false
        }
    }
    return state
};
types['p'] = function(options, data) {
    let state = false
    for (let i=0;i<data.length;i++){
        if(data[i].length === 1 && data[i].match(/[*#]/i)){
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
        if(data[i].length === 1 && data[i].match(/[0-9a-z]/i)){
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
        if(data[i].length === 1 && (data[i].match(/[0-9a-z-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/ ]/i))){
            state = true
        }
        else{
            return false
        }
    }
    return state
};
types['ns'] = function(options, data) {
    let state = false
    for (let i=0;i<data.length;i++){
        if(data[i].length === 1 && (data[i].match(/[0-9-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/ ]/i))){
            state = true
        }
        else{
            return false
        }
    }
    return state
};
types['s'] = function(options, data) {
    let state = false
    for (let i=0;i<data.length;i++){
        if(data[i].length === 1 && (data[i].match(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/ ]/i))){
            state = true
        }
        else{
            return false
        }
    }
    return state
};

types['an'] = function(options, data) {
    let state = false
    for (let i=0;i<data.length;i++){
        if(data[i].length === 1 && (data[i].match(/[0-9a-z]/i))){
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
        if(data[i].length === 1 && (data[i].match(/[0-9a-z-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/ ]/i))){
            state = true
        }
        else{
            return false
        }
    }
    return state
};
types['anp'] = function(options, data) {
    let state = false
    for (let i=0;i<data.length;i++){
        if(data[i].length === 1 && (data[i].match(/[0-9a-z*#]/i) || data[i]==' ')){
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
    if(data[0].match(/[c,d]/i)){
        for (let i=2;i<data.length;i++){
            if(data[i].length === 1 && data[i].match(/[0-9a-z]/i)){
                state = true
            }
            else{
                return false
            }
        }
    }
    else {
        return false
    }

    return state
};

module.exports = function(options, data,field) {
    if (!types[options.ContentType]) {
       return {error:'type ' + options.ContentType + ' is not implemented on field ' + field};
    } else {
        let state = types[options.ContentType](options, data);
        if(!state){
            return {error:'type ' + options.ContentType + ' is not implemented on field ' + field};
        }
        else {
            return true
        }
    }
};
