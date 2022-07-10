import { KeyValueStringT } from "./t";

interface MaskingFormats {
  [key: string]: KeyValueStringT;
}

const maskingFormats: MaskingFormats = {
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

export default function (pan: string, format: string, masker?: string) {
  let p = pan;
  const m = masker || '*';
  if (!maskingFormats[format]) return { error: 'unknown pan masking format' };
  const pre = parseInt(format[0], 10);
  const mid = parseInt(format[1], 10);
  const post = parseInt(format[2], 10);
  let fill;
  if (pre && !mid && post) {
    fill = m.repeat(p.length - (pre + post));
    p = p.slice(0, pre) + fill + p.slice(p.length - post, p.length);
  } else if (!pre && !mid && post) {
    fill = m.repeat(p.length - post);
    p = fill + p.slice(p.length - post , p.length);
  } else if (pre && !mid && !post) {
    fill = m.repeat(p.length - pre);
    p = p.slice(0, pre) + fill;
  } else if (!pre && mid && !post ) {
    const lu = Math.floor((p.length - mid) / 2);
    fill = m.repeat(lu);
    p = fill + p.slice(lu , p.length - lu) + fill;
  } else return { error: 'wrong pan configurations passed'};
  return p;
};
