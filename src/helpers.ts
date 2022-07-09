import { KeyValueStringT } from './t';
// @ts-nocheck
/**
 * This module has helper functions that are useful along side this library.
 */
const formatd = require('date-fns');

 export const getPostillionLength = function (buf: Buffer) {
   let div = buf[0];
   let rem = buf[1];

   return 256 * div + rem;
 };

 export const extractPostillionData = function (sent: Buffer) {
   // the data is two bytes shorter than what is sent
   let buf = Buffer.alloc(sent.byteLength - 2);

   // the first to bytes represents the length, the rest is data
   for (let i = 2; i < sent.byteLength; i++) {
     buf[i - 2] = sent[i];
   }

   return buf;
 };

export const attachPostillionLength = function (_data: string | Buffer) {
   let data = Buffer.alloc(0);

   // make sure _data is a buffer, if it's a string convert
   if (!Buffer.isBuffer(_data)) {
     if (typeof _data === 'string') {
       data = Buffer.alloc(_data.length, _data);
     }
   } else {
     data = _data;
   }

   // data is represented by two bytes
   let length = Buffer.alloc(2);
   length[0] = data.length / 256;
   length[1] = data.length % 256;

   return Buffer.concat([length, data]);
 };

 export const attachDiTimeStamps = function (obj: KeyValueStringT) {
   if (!obj['7'] || !obj['12'] || !obj['13']) {
     let time = new Date();
     obj['7'] = formatd(time, 'MMDDhhmmss');
     obj['12'] = formatd(time, 'hhmmss');
     obj['13'] = formatd(time, 'MMDD');
   }
   return obj;
 };

 export const findRequiredFields = function (json: any = [], key: string, processing_code: string, message_code: string | null) {
   let requiredFields: any = [];

   for (let i = 0; i < json.length; i++) {
     if (json[i]['processing_code'] === processing_code) {
       requiredFields = json[i][key];

       if (typeof requiredFields[0] === 'object') {
         for (let key in requiredFields[0]) {
           if (key === message_code) {
             requiredFields = requiredFields[0][key];
           }
         }
       }
     }
   }

   return requiredFields;
 };

 export const matchValues = function (iso_fields: string[] | number[], required_fields: string[] | number[]) {
   let missing_fields = required_fields;

   // Refactory to use .filter()
   for (let b = 0; b < required_fields.length; b++) {
     for (let i = 0; i < iso_fields.length; i++) {
       if (required_fields[b] === iso_fields[i]) {
         missing_fields.splice(b, 1);
       }
     }
   }

   return missing_fields;
 };

 export const extractBits = function (iso: KeyValueStringT) {
   const bits = [];

   for (let key in iso) {
     bits.push(parseInt(key, 10));
   }

   return bits;
 };