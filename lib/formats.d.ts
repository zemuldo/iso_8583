import { CustomFormatsT } from "./t";
/**
 * Default ISO 8583 field definitions. Can overridden by passing the custom formats to the Main's constructor
 *  <ul>
 * <h4>Field Config Options</h4>
 * <li>Content Type</li>
 * <li>Label</li>
 * <li>Length type</li></li>
 * <li>Maximum Length</li>
 * </ul>
 * <ul>
 * <h4>Field data types</h4>
 * <li>Binary fields i.e. fields 52, 53, 127.29 and 127.32, must be encoded in hexadecimal text format.</li>
 * <li>All other fields must be formatted as ASCII text.</li>
 *  <li> a --> Alphabetic characters, A through Z and a through z</li>
 *  <li> n --> Numeric digits, 0 through 9</li>
 *  <li> p --> Pad character, space</li>
 *  <li> s --> Special characters, i.e. other printable</li>
 *  <li> an --> Alphabetic and numeric characters</li>
 *  <li> as --> Alphabetic and special characters</li>
 *  <li> ns --> Numeric and special characters</li>
 *  <li> anp --> Alphabetic, numeric and pad characters</li>
 *  <li> ans --> Alphabetic, numeric and special characters</li>
 *  <li> YY --> Year, 00 through 99</li>
 *  <li> x --> C for credit, D for debit, always associated with a numeric amount field, i.e. x+n16 means a prefix of C or D followed by 16 numeric characters.</li>
 *  <li> b --> Binary representation of data</li>
 *  <li> z --> Track 2 as defined in ISO 7813</li>
 *  <li> ..17 --> Variable length up to 17 characters, containing an additional 2 or 3 characters at the start of the data indicating the number of characters following to the end of the field
 * </ul>
 * <ul>
 * <h4>Date Formats</h4>
 *  <li> CCYY --> Year, 0001 through 9999</li>
 *  <li> MM --> Month, 01 through 12</li>
 *  <li> DD --> Day, 01 through 31</li>
 *  <li> hh --> Hour, 00 through 23</li>
 *  <li> mm --> Minute, 00 through 59</li>
 *  <li> ss --> Second, 00 through 59</li>
 * </ul>
 * <ul>
 * <h4>Length Types</h4>
 *  <li> LL --> Length of variable data element that follows, 01 through 99</li>
 *  <li> LLL --> Length of variable data element that follows, 001 through 999</li>
 *  <li> LLLLL --> Length of variable data element that follows, 00001 through 99999</li>
 *  <li> LLLLLL --> Length of variable data element that follows, 000001 through 999999</li>
 *  <li> VAR --> Variable length data element
 *  <li> 3 --> Fixed length of 3 characters
 * </ul>
 * @module Formats
 * @example  {
  '0': {
    ContentType: 'n',
    Label: 'Message Type Indicator',
    LenType: 'fixed',
    MaxLen: 4
  },
  '1': {
    ContentType: 'b',
    Label: 'Bitmap',
    LenType: 'fixed',
    MaxLen: 8
  }
}
 */
declare const Formats: CustomFormatsT;
export default Formats;
