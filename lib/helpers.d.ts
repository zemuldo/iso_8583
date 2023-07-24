/**
 * This module has helper functions that are useful along side this library.
 */
/// <reference types="node" />
import { KeyValueStringT } from './t';
export declare const getPostillionLength: (buf: Buffer) => number;
export declare const extractPostillionData: (sent: Buffer) => Buffer;
export declare const attachPostillionLength: (_data: string | Buffer) => Buffer;
export declare const attachDiTimeStamps: (obj: KeyValueStringT) => KeyValueStringT;
export declare const findRequiredFields: (json: any, key: string, processing_code: string, message_code: string | null) => any;
export declare const matchValues: (required_fields: string[] | number[], iso_fields: string[] | number[]) => string[] | number[];
export declare const extractBits: (iso: KeyValueStringT) => number[];
