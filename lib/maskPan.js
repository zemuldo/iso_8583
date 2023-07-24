"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const maskingFormats = {
    '4*4': {
        input: '4756065863847844',
        example: '4756********7844',
    },
    '**4': {
        input: '4756065863847844',
        example: '************7844',
    },
    '4**': {
        input: '4756065863847844',
        example: '4756************',
    },
    '*4*': {
        input: '4756065863847844',
        example: '****06586384****',
    },
};
function default_1(pan, format, masker) {
    let p = pan;
    const m = masker || '*';
    if (!maskingFormats[format])
        return { error: 'unknown pan masking format' };
    const pre = parseInt(format[0], 10);
    const mid = parseInt(format[1], 10);
    const post = parseInt(format[2], 10);
    let fill;
    if (pre && !mid && post) {
        fill = m.repeat(p.length - (pre + post));
        p = p.slice(0, pre) + fill + p.slice(p.length - post, p.length);
    }
    else if (!pre && !mid && post) {
        fill = m.repeat(p.length - post);
        p = fill + p.slice(p.length - post, p.length);
    }
    else if (pre && !mid && !post) {
        fill = m.repeat(p.length - pre);
        p = p.slice(0, pre) + fill;
    }
    else if (!pre && mid && !post) {
        const lu = Math.floor((p.length - mid) / 2);
        fill = m.repeat(lu);
        p = fill + p.slice(lu, p.length - lu) + fill;
    }
    else
        return { error: 'wrong pan configurations passed' };
    return p;
}
exports.default = default_1;
;
