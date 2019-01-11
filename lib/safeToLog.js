const defaultUnsafeToLogField = {
  '2': 'Primary Account Number',
  '34': 'Primary account number, extended',
  '35': 'Track 2 Data',
  '36': 'Track 3 Data',
  '45': 'Track 1 Data',
  '52': 'Personal identification number data (Pin Block)',
  '53': 'Security related control information',
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
    MaxLen: 16,
  },
  '127.25.2': {
    ContentType: 'n',
    Label: 'Amount Authorized',
    LenType: 'fixed',
    MaxLen: 12,
  },
  '127.25.3': {
    ContentType: 'n',
    Label: 'Amount Other',
    LenType: 'fixed',
    MaxLen: 12,
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
    MaxLen: 4,
  },
  '127.25.6': {
    ContentType: 'ans',
    Label: 'Application Transaction Counter',
    LenType: 'fixed',
    MaxLen: 4,
  },
  '127.25.7': {
    ContentType: 'ans',
    Label: 'Application Interchange Profile',
    LenType: 'fixed',
    MaxLen: 4,
  },
  '127.25.8': {
    ContentType: 'an',
    Label: 'Authorization Response Code',
    LenType: 'fixed',
    MaxLen: 2,
  },
  '127.25.9': {
    ContentType: 'n',
    Label: 'Card Authentication Reliability Indicator',
    LenType: 'fixed',
    MaxLen: 1,
  },
  '127.25.10': {
    ContentType: 'ans',
    Label: 'Card Authentication Result Code',
    LenType: 'fixed',
    MaxLen: 1,
  },
  '127.25.11': {
    ContentType: 'n',
    Label: 'Chip Condition Code',
    LenType: 'fixed',
    MaxLen: 1,
  },
  '127.25.12': {
    ContentType: 'ans',
    Label: 'Cryptogram',
    LenType: 'fixed',
    MaxLen: 16,
  },
  '127.25.13': {
    ContentType: 'ans',
    Label: 'Cryptogram Information Data',
    LenType: 'fixed',
    MaxLen: 2,
  },
  '127.25.14': {
    ContentType: 'ans',
    Label: 'Cvm List',
    LenType: 'lllvar',
    MaxLen: 504,
  },
  '127.25.15': {
    ContentType: 'ans',
    Label: 'Cvm Results',
    LenType: 'fixed',
    MaxLen: 6,
  },
  '127.25.16': {
    ContentType: 'an',
    Label: 'Interface Device Name',
    LenType: 'fixed',
    MaxLen: 8,
  },
  '127.25.17': {
    ContentType: 'ans',
    Label: 'Issuer Action Code',
    LenType: 'fixed',
    MaxLen: 11,
  },
  '127.25.18': {
    ContentType: 'ans',
    Label: 'Issuer Application Data',
    LenType: 'llvar',
    MaxLen: 64,
  },
  '127.25.19': {
    ContentType: 'ans',
    Label: 'Issuer Script Results',
    LenType: 'lllvar',
    MaxLen: 507,
  },
  '127.25.20': {
    ContentType: 'ans',
    Label: 'Terminal Application Version Number',
    LenType: 'fixed',
    MaxLen: 4,
  },
  '127.25.21': {
    ContentType: 'ans',
    Label: 'Terminal Capabilities',
    LenType: 'fixed',
    MaxLen: 6,
  },
  '127.25.22': {
    ContentType: 'n',
    Label: 'Terminal Country Code',
    LenType: 'fixed',
    MaxLen: 3,
  },
  '127.25.23': {
    ContentType: 'n',
    Label: 'Terminal Type',
    LenType: 'fixed',
    MaxLen: 2,
  },
  '127.25.24': {
    ContentType: 'ans',
    Label: 'Terminal Verification Results',
    LenType: 'fixed',
    MaxLen: 10,
  },
  '127.25.25': {
    ContentType: 'ans',
    Label: 'Transaction Category Code',
    LenType: 'fixed',
    MaxLen: 1,
  },
  '127.25.26': {
    ContentType: 'n',
    Label: 'Transaction Currency Code',
    LenType: 'fixed',
    MaxLen: 3,
  },
  '127.25.27': {
    ContentType: 'n',
    Label: 'Transaction Date',
    LenType: 'fixed',
    MaxLen: 6,
  },
  '127.25.28': {
    ContentType: 'n',
    Label: 'Transaction Sequence Counter',
    LenType: 'lvar',
    MaxLen: 8,
  },
  '127.25.29': {
    ContentType: 'n',
    Label: 'Transaction Type',
    LenType: 'fixed',
    MaxLen: 2,
  },
  '127.25.30': {
    ContentType: 'ans',
    Label: 'Unpredicatable Number',
    LenType: 'fixed',
    MaxLen: 8,
  },
  '127.25.31': {
    ContentType: 'ans',
    Label: 'Issuer Authentication Data',
    LenType: 'llvar',
    MaxLen: 32,
  },
  '127.25.32': {
    ContentType: 'ans',
    Label: 'Issuer Script Template 1',
    LenType: 'llllvar',
    MaxLen: 3354,
  },
  '127.25.33': {
    ContentType: 'ans',
    Label: 'Issuer Script Template 2',
    LenType: 'llllvar',
    MaxLen: 3354,
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
    MaxLen: 1,
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
    MaxLen: 4,
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

module.exports = function (config, data, panMaskFormat) {
  const obj = data || this.Msg;
  const toSafeConfig = config || defaultUnsafeToLogField;
  const msg = Object.assign(obj);
  for (const field in toSafeConfig) {
    if (field === '2') {
      const maskedPan = this.maskPan(msg[field], panMaskFormat || '**4', '*');
      msg[field] = maskedPan;
    } else delete msg[field];
  }
  return msg;
};