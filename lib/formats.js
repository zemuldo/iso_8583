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
let formats = {
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
  },
  '2': {
    ContentType: 'n',
    Label: 'Primary account number (PAN)',
    LenType: 'llvar',
    MaxLen: 19,
    MinLen: 1
  },
  '3': {
    ContentType: 'n',
    Label: 'Processing code',
    LenType: 'fixed',
    MaxLen: 6
  },
  '4': {
    ContentType: 'n',
    Label: 'Amount, transaction',
    LenType: 'fixed',
    MaxLen: 12
  },
  '5': {
    ContentType: 'n',
    Label: 'Amount, settlement',
    LenType: 'fixed',
    MaxLen: 12
  },
  '6': {
    ContentType: 'n',
    Label: 'Amount, cardholder billing',
    LenType: 'fixed',
    MaxLen: 12
  },
  '7': {
    ContentType: 'n',
    Label: 'Transmission date & time',
    LenType: 'fixed',
    MaxLen: 10
  },
  '8': {
    ContentType: 'n',
    Label: 'Amount, cardholder billing fee',
    LenType: 'fixed',
    MaxLen: 8
  },
  '9': {
    ContentType: 'n',
    Label: 'Conversion rate, settlement',
    LenType: 'fixed',
    MaxLen: 8
  },
  '10': {
    ContentType: 'n',
    Label: 'Conversion rate, cardholder billing',
    LenType: 'fixed',
    MaxLen: 8
  },
  '11': {
    ContentType: 'n',
    Label: 'System trace audit number',
    LenType: 'fixed',
    MaxLen: 6
  },
  '12': {
    ContentType: 'n',
    Label: 'Time, local transaction (hhmmss)',
    LenType: 'fixed',
    MaxLen: 6
  },
  '13': {
    ContentType: 'n',
    Label: 'Date, local transaction (MMDD)',
    LenType: 'fixed',
    MaxLen: 4
  },
  '14': {
    ContentType: 'n',
    Label: 'Date, expiration',
    LenType: 'fixed',
    MaxLen: 4
  },
  '15': {
    ContentType: 'n',
    Label: 'Date, settlement',
    LenType: 'fixed',
    MaxLen: 4
  },
  '16': {
    ContentType: 'n',
    Label: 'Date, conversion',
    LenType: 'fixed',
    MaxLen: 4
  },
  '17': {
    ContentType: 'n',
    Label: 'Date, capture',
    LenType: 'fixed',
    MaxLen: 4
  },
  '18': {
    ContentType: 'n',
    Label: 'Merchant type',
    LenType: 'fixed',
    MaxLen: 4
  },
  '19': {
    ContentType: 'n',
    Label: 'Acquiring institution country code',
    LenType: 'fixed',
    MaxLen: 3
  },
  '20': {
    ContentType: 'n',
    Label: 'PAN extended, country code',
    LenType: 'fixed',
    MaxLen: 3
  },
  '21': {
    ContentType: 'n',
    Label: 'Forwarding institution. country code',
    LenType: 'fixed',
    MaxLen: 3
  },
  '22': {
    ContentType: 'n',
    Label: 'Point of service entry mode',
    LenType: 'fixed',
    MaxLen: 3
  },
  '23': {
    ContentType: 'n',
    Label: 'Application PAN sequence number',
    LenType: 'fixed',
    MaxLen: 3
  },
  '24': {
    ContentType: 'n',
    Label: 'Network International identifier (NII)',
    LenType: 'fixed',
    MaxLen: 3
  },
  '25': {
    ContentType: 'n',
    Label: 'Point of service condition code',
    LenType: 'fixed',
    MaxLen: 2
  },
  '26': {
    ContentType: 'n',
    Label: 'Point of service capture code',
    LenType: 'fixed',
    MaxLen: 2
  },
  '27': {
    ContentType: 'n',
    Label: 'Authorizing identification response length',
    LenType: 'fixed',
    MaxLen: 1
  },
  '28': {
    ContentType: 'x+n',
    Label: 'Amount, transaction fee',
    LenType: 'fixed',
    MaxLen: 9
  },
  '29': {
    ContentType: 'x+n',
    Label: 'Amount, settlement fee',
    LenType: 'fixed',
    MaxLen: 9
  },
  '30': {
    ContentType: 'x+n',
    Label: 'Amount, transaction processing fee',
    LenType: 'fixed',
    MaxLen: 9
  },
  '31': {
    ContentType: 'x+n',
    Label: 'Amount, settlement processing fee',
    LenType: 'fixed',
    MaxLen: 9
  },
  '32': {
    ContentType: 'n',
    Label: 'Acquiring institution identification code',
    LenType: 'llvar',
    MaxLen: 11
  },
  '33': {
    ContentType: 'n',
    Label: 'Forwarding institution identification code',
    LenType: 'llvar',
    MaxLen: 11
  },
  '34': {
    ContentType: 'ns',
    Label: 'Primary account number, extended',
    LenType: 'llvar',
    MaxLen: 28
  },
  '35': {
    ContentType: 'z',
    Label: 'Track 2 data',
    LenType: 'llvar',
    MaxLen: 37
  },
  '36': {
    ContentType: 'n',
    Label: 'Track 3 data',
    LenType: 'lllvar',
    MaxLen: 104
  },
  '37': {
    ContentType: 'anp',
    Label: 'Retrieval reference number',
    LenType: 'fixed',
    MaxLen: 12
  },
  '38': {
    ContentType: 'anp',
    Label: 'Authorization identification response',
    LenType: 'fixed',
    MaxLen: 6
  },
  '39': {
    ContentType: 'an',
    Label: 'Response code',
    LenType: 'fixed',
    MaxLen: 2
  },
  '40': {
    ContentType: 'n',
    Label: 'Service restriction code',
    LenType: 'fixed',
    MaxLen: 3
  },
  '41': {
    ContentType: 'ans',
    Label: 'Card acceptor terminal identification',
    LenType: 'fixed',
    MaxLen: 8
  },
  '42': {
    ContentType: 'ans',
    Label: 'Card acceptor identification code',
    LenType: 'fixed',
    MaxLen: 15
  },
  '43': {
    ContentType: 'ans',
    Label: 'Card acceptor name/location',
    LenType: 'fixed',
    MaxLen: 40
  },
  '44': {
    ContentType: 'ans',
    Label: 'Additional response data',
    LenType: 'llvar',
    MaxLen: 25
  },
  '45': {
    ContentType: 'ans',
    Label: 'Track 1 data',
    LenType: 'llvar',
    MaxLen: 76
  },
  '46': {
    ContentType: 'ans',
    Label: 'Additional data - ISO',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '47': {
    ContentType: 'ans',
    Label: 'Additional data - national',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '48': {
    ContentType: 'ans',
    Label: 'Additional data - private',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '49': {
    ContentType: 'n',
    Label: 'Currency code, transaction',
    LenType: 'fixed',
    MaxLen: 3
  },
  '50': {
    ContentType: 'an',
    Label: 'Currency code, settlement',
    LenType: 'fixed',
    MaxLen: 3
  },
  '51': {
    ContentType: 'n',
    Label: 'Currency code, cardholder billing',
    LenType: 'fixed',
    MaxLen: 3
  },
  '52': {
    ContentType: 'b',
    Label: 'Personal identification number data',
    LenType: 'fixed',
    MaxLen: 16
  },
  '53': {
    ContentType: 'b',
    Label: 'Security related control information',
    LenType: 'fixed',
    MaxLen: 96
  },
  '54': {
    ContentType: 'an',
    Label: 'Additional amounts',
    LenType: 'lllvar',
    MaxLen: 120
  },
  '55': {
    ContentType: 'ans',
    Label: 'Reserved ISO',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '56': {
    ContentType: 'ans',
    Label: 'Message Reason Code',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '57': {
    ContentType: 'ans',
    Label: 'Reserved national',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '58': {
    ContentType: 'n',
    Label: 'Reserved national',
    LenType: 'llvar',
    MaxLen: 11
  },
  '59': {
    ContentType: 'ans',
    Label: 'Reserved national',
    LenType: 'lllvar',
    MaxLen: 255
  },
  '60': {
    ContentType: 'ans',
    Label: 'Reserved national',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '61': {
    ContentType: 'ans',
    Label: 'Reserved private',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '62': {
    ContentType: 'ans',
    Label: 'Reserved private',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '63': {
    ContentType: 'ans',
    Label: 'Reserved private',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '64': {
    ContentType: 'b',
    Label: 'Message authentication code (MAC)',
    LenType: 'fixed',
    MaxLen: 8
  },
  '65': {
    ContentType: 'b',
    Label: 'Bitmap, extended',
    LenType: 'fixed',
    MaxLen: 1
  },
  '66': {
    ContentType: 'n',
    Label: 'Settlement code',
    LenType: 'fixed',
    MaxLen: 1
  },
  '67': {
    ContentType: 'n',
    Label: 'Extended payment code',
    LenType: 'fixed',
    MaxLen: 2
  },
  '68': {
    ContentType: 'n',
    Label: 'Receiving institution country code',
    LenType: 'fixed',
    MaxLen: 3
  },
  '69': {
    ContentType: 'n',
    Label: 'Settlement institution country code',
    LenType: 'fixed',
    MaxLen: 3
  },
  '70': {
    ContentType: 'n',
    Label: 'Network management information code',
    LenType: 'fixed',
    MaxLen: 3
  },
  '71': {
    ContentType: 'n',
    Label: 'Message number',
    LenType: 'fixed',
    MaxLen: 4
  },
  '72': {
    ContentType: 'n',
    Label: 'Message number, last',
    LenType: 'fixed',
    MaxLen: 4
  },
  '73': {
    ContentType: 'n',
    Label: 'Date, action (YYMMDD)',
    LenType: 'fixed',
    MaxLen: 6
  },
  '74': {
    ContentType: 'n',
    Label: 'Credits, number',
    LenType: 'fixed',
    MaxLen: 10
  },
  '75': {
    ContentType: 'n',
    Label: 'Credits, reversal number',
    LenType: 'fixed',
    MaxLen: 10
  },
  '76': {
    ContentType: 'n',
    Label: 'Debits, number',
    LenType: 'fixed',
    MaxLen: 10
  },
  '77': {
    ContentType: 'n',
    Label: 'Debits, reversal number',
    LenType: 'fixed',
    MaxLen: 10
  },
  '78': {
    ContentType: 'n',
    Label: 'Transfer number',
    LenType: 'fixed',
    MaxLen: 10
  },
  '79': {
    ContentType: 'n',
    Label: 'Transfer, reversal number',
    LenType: 'fixed',
    MaxLen: 10
  },
  '80': {
    ContentType: 'n',
    Label: 'Inquiries number',
    LenType: 'fixed',
    MaxLen: 10
  },
  '81': {
    ContentType: 'n',
    Label: 'Authorizations, number',
    LenType: 'fixed',
    MaxLen: 10
  },
  '82': {
    ContentType: 'n',
    Label: 'Credits, processing fee amount',
    LenType: 'fixed',
    MaxLen: 12
  },
  '83': {
    ContentType: 'n',
    Label: 'Credits, transaction fee amount',
    LenType: 'fixed',
    MaxLen: 12
  },
  '84': {
    ContentType: 'n',
    Label: 'Debits, processing fee amount',
    LenType: 'fixed',
    MaxLen: 12
  },
  '85': {
    ContentType: 'n',
    Label: 'Debits, transaction fee amount',
    LenType: 'fixed',
    MaxLen: 12
  },
  '86': {
    ContentType: 'n',
    Label: 'Credits, amount',
    LenType: 'fixed',
    MaxLen: 16
  },
  '87': {
    ContentType: 'n',
    Label: 'Credits, reversal amount',
    LenType: 'fixed',
    MaxLen: 16
  },
  '88': {
    ContentType: 'n',
    Label: 'Debits, amount',
    LenType: 'fixed',
    MaxLen: 16
  },
  '89': {
    ContentType: 'n',
    Label: 'Debits, reversal amount',
    LenType: 'fixed',
    MaxLen: 16
  },
  '90': {
    ContentType: 'n',
    Label: 'Original data elements',
    LenType: 'fixed',
    MaxLen: 42
  },
  '91': {
    ContentType: 'an',
    Label: 'File update code',
    LenType: 'fixed',
    MaxLen: 1
  },
  '92': {
    ContentType: 'an',
    Label: 'File security code',
    LenType: 'fixed',
    MaxLen: 2
  },
  '93': {
    ContentType: 'an',
    Label: 'Response indicator',
    LenType: 'fixed',
    MaxLen: 5
  },
  '94': {
    ContentType: 'an',
    Label: 'Service indicator',
    LenType: 'fixed',
    MaxLen: 7
  },
  '95': {
    ContentType: 'an',
    Label: 'Replacement amounts',
    LenType: 'fixed',
    MaxLen: 42
  },
  '96': {
    ContentType: 'b',
    Label: 'Message security code',
    LenType: 'fixed',
    MaxLen: 8
  },
  '97': {
    ContentType: 'x+n',
    Label: 'Amount, net settlement',
    LenType: 'fixed',
    MaxLen: 17
  },
  '98': {
    ContentType: 'ans',
    Label: 'Payee',
    LenType: 'fixed',
    MaxLen: 25
  },
  '99': {
    ContentType: 'n',
    Label: 'Settlement institution identification code',
    LenType: 'llvar',
    MaxLen: 11
  },
  '100': {
    ContentType: 'n',
    Label: 'Receiving institution identification code',
    LenType: 'llvar',
    MaxLen: 11
  },
  '101': {
    ContentType: 'ans',
    Label: 'File name',
    LenType: 'llvar',
    MaxLen: 17
  },
  '102': {
    ContentType: 'ans',
    Label: 'Account identification 1',
    LenType: 'llvar',
    MaxLen: 28
  },
  '103': {
    ContentType: 'ans',
    Label: 'Account identification 2',
    LenType: 'llvar',
    MaxLen: 28
  },
  '104': {
    ContentType: 'ans',
    Label: 'Transaction description',
    LenType: 'lllvar',
    MaxLen: 100
  },
  '105': {
    ContentType: 'ans',
    Label: 'Reserved for ISO use',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '106': {
    ContentType: 'ans',
    Label: 'Reserved for ISO use',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '107': {
    ContentType: 'ans',
    Label: 'Reserved for ISO use',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '108': {
    ContentType: 'ans',
    Label: 'Reserved for ISO use',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '109': {
    ContentType: 'ans',
    Label: 'Reserved for ISO use',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '110': {
    ContentType: 'ans',
    Label: 'Reserved for ISO use',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '111': {
    ContentType: 'ans',
    Label: 'Reserved for ISO use',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '112': {
    ContentType: 'ans',
    Label: 'Reserved for national use',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '113': {
    ContentType: 'ans',
    Label: 'Reserved for national use',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '114': {
    ContentType: 'ans',
    Label: 'Reserved for national use',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '115': {
    ContentType: 'ans',
    Label: 'Reserved for national use',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '116': {
    ContentType: 'ans',
    Label: 'Reserved for national use',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '117': {
    ContentType: 'ans',
    Label: 'Reserved for national use',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '118': {
    ContentType: 'n',
    Label: 'Reserved for national use',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '119': {
    ContentType: 'n',
    Label: 'Reserved for national use',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '120': {
    ContentType: 'n',
    Label: 'Reserved for private use',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '121': {
    ContentType: 'n',
    Label: 'Reserved for private use',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '122': {
    ContentType: 'n',
    Label: 'Reserved for private use',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '123': {
    ContentType: 'an',
    Label: 'Reserved for private use',
    LenType: 'lllvar',
    MaxLen: 999,
    MinLen: 15
  },
  '124': {
    ContentType: 'ans',
    Label: 'Reserved for private use',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '125': {
    ContentType: 'ans',
    Label: 'Reserved for private use',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '126': {
    ContentType: 'ans',
    Label: 'Reserved for private use',
    LenType: 'lllvar',
    MaxLen: 999
  },
  '127': {
    ContentType: 'ans',
    Label: 'Reserved for private use',
    LenType: 'llllllvar',
    MaxLen: 999999
  },
  '127.1': {
    ContentType: 'b',
    Label: 'Bitmap',
    LenType: 'fixed',
    MaxLen: 16
  },
  '127.2': {
    ContentType: 'n',
    Label: 'Switch Key',
    LenType: 'llvar',
    MaxLen: 32,
    MinLen: 12
  },
  '127.3': {
    ContentType: 'ans',
    Label: 'Routing Information',
    LenType: 'fixed',
    MaxLen: 48
  },
  '127.4': {
    ContentType: 'ans',
    Label: 'POS Data',
    LenType: 'fixed',
    MaxLen: 22
  },
  '127.5': {
    ContentType: 'ans',
    Label: 'Service Station Data',
    LenType: 'fixed',
    MaxLen: 73
  },
  '127.6': {
    ContentType: 'n',
    Label: 'Authorization Profile',
    LenType: 'fixed',
    MaxLen: 2
  },
  '127.7': {
    ContentType: 'ans',
    Label: 'Check Data',
    LenType: 'llvar',
    MaxLen: 50,
    MinLen: 10
  },
  '127.8': {
    ContentType: 'ans',
    Label: 'Retention Data',
    LenType: 'lllvar',
    MaxLen: 999,
    MinLen: 100
  },
  '127.9': {
    ContentType: 'ans',
    Label: 'Additional Node Data',
    LenType: 'lllvar',
    MaxLen: 255,
    MinLen: 100
  },
  '127.10': {
    ContentType: 'n',
    Label: 'CVV2',
    LenType: 'fixed',
    MaxLen: 3
  },
  '127.11': {
    ContentType: 'ans',
    Label: 'Original Key',
    LenType: 'llvar',
    MaxLen: 32,
    MinLen: 10
  },
  '127.12': {
    ContentType: 'ans',
    Label: 'Terminal Owner',
    LenType: 'llvar',
    MaxLen: 25,
    MinLen: 10
  },
  '127.13': {
    ContentType: 'ans',
    Label: 'POS Geographic Data',
    LenType: 'fixed',
    MaxLen: 17
  },
  '127.14': {
    ContentType: 'ans',
    Label: 'Sponsor Bank',
    LenType: 'fixed',
    MaxLen: 8
  },
  '127.15': {
    ContentType: 'ans',
    Label: 'Address Verification Data',
    LenType: 'llvar',
    MaxLen: 29,
    MinLen: 10
  },
  '127.16': {
    ContentType: 'ans',
    Label: 'Address Verification Result',
    LenType: 'fixed',
    MaxLen: 1
  },
  '127.17': {
    ContentType: 'ans',
    Label: 'Cardholder Information',
    LenType: 'llvar',
    MaxLen: 50,
    MinLen: 10
  },
  '127.18': {
    ContentType: 'ans',
    Label: 'Validation data',
    LenType: 'llvar',
    MaxLen: 50,
    MinLen: 10
  },
  '127.19': {
    ContentType: 'ans',
    Label: 'Bank details',
    LenType: 'fixed',
    MaxLen: 31
  },
  '127.20': {
    ContentType: 'n',
    Label: 'Originator / Authorizer date settlement',
    LenType: 'fixed',
    MaxLen: 8
  },
  '127.21': {
    ContentType: 'ans',
    Label: 'Record identification',
    LenType: 'llvar',
    MaxLen: 12,
    MinLen: 10
  },
  '127.22': {
    ContentType: 'ans',
    Label: 'Structured Data',
    LenType: 'lllllvar',
    MaxLen: 99999,
    MinLen: 10000
  },
  '127.23': {
    ContentType: 'ans',
    Label: 'Payee name and address',
    LenType: 'fixed',
    MaxLen: 253
  },
  '127.24': {
    ContentType: 'ans',
    Label: 'Payer account',
    LenType: 'llvar',
    MaxLen: 28,
    MinLen: 10
  },
  '127.25': {
    ContentType: 'ans',
    Label: 'Integrated circuit card (ICC) Data',
    LenType: 'llllvar',
    MaxLen: 8000,
    MinLen: 1000
  },
  '127.25.1': {
    ContentType: 'b',
    Label: 'Bitmap',
    LenType: 'fixed',
    MaxLen: 16
  },
  '127.25.2': {
    ContentType: 'n',
    Label: 'Amount Authorized',
    LenType: 'fixed',
    MaxLen: 12
  },
  '127.25.3': {
    ContentType: 'n',
    Label: 'Amount Other',
    LenType: 'fixed',
    MaxLen: 12
  },
  '127.25.4': {
    ContentType: 'ans',
    Label: 'Application Identifier',
    LenType: 'llvar',
    MaxLen: 32,
    MinLen: 10
  },
  '127.25.5': {
    ContentType: 'ans',
    Label: 'Application Interchange Profile',
    LenType: 'fixed',
    MaxLen: 4
  },
  '127.25.6': {
    ContentType: 'ans',
    Label: 'Application Transaction Counter',
    LenType: 'fixed',
    MaxLen: 4
  },
  '127.25.7': {
    ContentType: 'ans',
    Label: 'Application Interchange Profile',
    LenType: 'fixed',
    MaxLen: 4
  },
  '127.25.8': {
    ContentType: 'an',
    Label: 'Authorization Response Code',
    LenType: 'fixed',
    MaxLen: 2
  },
  '127.25.9': {
    ContentType: 'n',
    Label: 'Card Authentication Reliability Indicator',
    LenType: 'fixed',
    MaxLen: 1
  },
  '127.25.10': {
    ContentType: 'ans',
    Label: 'Card Authentication Result Code',
    LenType: 'fixed',
    MaxLen: 1
  },
  '127.25.11': {
    ContentType: 'n',
    Label: 'Chip Condition Code',
    LenType: 'fixed',
    MaxLen: 1
  },
  '127.25.12': {
    ContentType: 'ans',
    Label: 'Cryptogram',
    LenType: 'fixed',
    MaxLen: 16
  },
  '127.25.13': {
    ContentType: 'ans',
    Label: 'Cryptogram Information Data',
    LenType: 'fixed',
    MaxLen: 2
  },
  '127.25.14': {
    ContentType: 'ans',
    Label: 'Cvm List',
    LenType: 'lllvar',
    MaxLen: 504
  },
  '127.25.15': {
    ContentType: 'ans',
    Label: 'Cvm Results',
    LenType: 'fixed',
    MaxLen: 6
  },
  '127.25.16': {
    ContentType: 'an',
    Label: 'Interface Device Name',
    LenType: 'fixed',
    MaxLen: 8
  },
  '127.25.17': {
    ContentType: 'ans',
    Label: 'Issuer Action Code',
    LenType: 'fixed',
    MaxLen: 11
  },
  '127.25.18': {
    ContentType: 'ans',
    Label: 'Issuer Application Data',
    LenType: 'llvar',
    MaxLen: 64
  },
  '127.25.19': {
    ContentType: 'ans',
    Label: 'Issuer Script Results',
    LenType: 'lllvar',
    MaxLen: 507
  },
  '127.25.20': {
    ContentType: 'ans',
    Label: 'Terminal Application Version Number',
    LenType: 'fixed',
    MaxLen: 4
  },
  '127.25.21': {
    ContentType: 'ans',
    Label: 'Terminal Capabilities',
    LenType: 'fixed',
    MaxLen: 6
  },
  '127.25.22': {
    ContentType: 'n',
    Label: 'Terminal Country Code',
    LenType: 'fixed',
    MaxLen: 3
  },
  '127.25.23': {
    ContentType: 'n',
    Label: 'Terminal Type',
    LenType: 'fixed',
    MaxLen: 2
  },
  '127.25.24': {
    ContentType: 'ans',
    Label: 'Terminal Verification Results',
    LenType: 'fixed',
    MaxLen: 10
  },
  '127.25.25': {
    ContentType: 'ans',
    Label: 'Transaction Category Code',
    LenType: 'fixed',
    MaxLen: 1
  },
  '127.25.26': {
    ContentType: 'n',
    Label: 'Transaction Currency Code',
    LenType: 'fixed',
    MaxLen: 3
  },
  '127.25.27': {
    ContentType: 'n',
    Label: 'Transaction Date',
    LenType: 'fixed',
    MaxLen: 6
  },
  '127.25.28': {
    ContentType: 'n',
    Label: 'Transaction Sequence Counter',
    LenType: 'lvar',
    MaxLen: 8
  },
  '127.25.29': {
    ContentType: 'n',
    Label: 'Transaction Type',
    LenType: 'fixed',
    MaxLen: 2
  },
  '127.25.30': {
    ContentType: 'ans',
    Label: 'Unpredicatable Number',
    LenType: 'fixed',
    MaxLen: 8
  },
  '127.25.31': {
    ContentType: 'ans',
    Label: 'Issuer Authentication Data',
    LenType: 'llvar',
    MaxLen: 32
  },
  '127.25.32': {
    ContentType: 'ans',
    Label: 'Issuer Script Template 1',
    LenType: 'llllvar',
    MaxLen: 3354
  },
  '127.25.33': {
    ContentType: 'ans',
    Label: 'Issuer Script Template 2',
    LenType: 'llllvar',
    MaxLen: 3354
  },
  '127.26': {
    ContentType: 'ans',
    Label: 'Original Node',
    LenType: 'llvar',
    MaxLen: 12,
    MinLen: 10
  },
  '127.27': {
    ContentType: 'ans',
    Label: 'Card Verification Result',
    LenType: 'fixed',
    MaxLen: 1
  },
  '127.28': {
    ContentType: 'n',
    Label: 'American Express Card Identifier (CID)',
    LenType: 'fixed',
    MaxLen: 4
  },
  '127.29': {
    ContentType: 'b',
    Label: '3D Secure Data',
    LenType: 'fixed',
    MaxLen: 40
  },
  '127.30': {
    ContentType: 'ans',
    Label: '3D Secure Result',
    LenType: 'fixed',
    MaxLen: 1
  },
  '127.31': {
    ContentType: 'ans',
    Label: 'Issuer Network ID',
    LenType: 'llvar',
    MaxLen: 11,
    MinLen: 10
  },
  '127.32': {
    ContentType: 'b',
    Label: 'UCAF data',
    LenType: 'llvar',
    MaxLen: 33,
    MinLen: 10
  },
  '127.33': {
    ContentType: 'n',
    Label: 'Extended Transaction Type',
    LenType: 'fixed',
    MaxLen: 4
  },
  '127.34': {
    ContentType: 'n',
    Label: 'Account Type Qualifiers',
    LenType: 'fixed',
    MaxLen: 2
  },
  '127.35': {
    ContentType: 'ans',
    Label: 'Acquirer Network ID',
    LenType: 'llvar',
    MaxLen: 11,
    MinLen: 10
  },
  '127.36': {
    ContentType: 'ans',
    Label: 'Customer ID',
    LenType: 'llvar',
    MaxLen: 25,
    MinLen: 10
  },
  '127.37': {
    ContentType: 'an',
    Label: 'Extended Response Code',
    LenType: 'fixed',
    MaxLen: 4
  },
  '127.38': {
    ContentType: 'an',
    Label: 'Additional POS Data Code',
    LenType: 'llvar',
    MaxLen: 99,
    MinLen: 10
  },
  '127.39': {
    ContentType: 'an',
    Label: 'Original Response Code',
    LenType: 'fixed',
    MaxLen: 2
  },
  '128': {
    ContentType: 'b',
    Label: 'Message authentication code',
    LenType: 'fixed',
    MaxLen: 8
  }
};

module.exports = formats;
