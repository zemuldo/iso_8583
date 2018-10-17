let private_common_types = {
  '9900': 'Private use, reserved by ISO, request, Acquirer',
  '9901': 'Private use, reserved by ISO, request, Acquirer repeat',
  '9902': 'Private use, reserved by ISO, request, Issuer',
  '9903': 'Private use, reserved by ISO, request, Issuer repeat',
  '9904': 'Private use, reserved by ISO, request, Other',
  '9905': 'Private use, reserved by ISO, request, Other repeat',

  '9910': 'Private use, reserved by ISO, request response, Acquirer',
  '9911': 'Private use, reserved by ISO, request response, Acquirer repeat',
  '9912': 'Private use, reserved by ISO, request response, Issuer',
  '9913': 'Private use, reserved by ISO, request response, Issuer repeat',
  '9914': 'Private use, reserved by ISO, request response, Other',
  '9915': 'Private use, reserved by ISO, request response, Other repeat',

  '9920': 'Private use, reserved by ISO, advice, Acquirer',
  '9921': 'Private use, reserved by ISO, advice, Acquirer repeat',
  '9922': 'Private use, reserved by ISO, advice, Issuer',
  '9923': 'Private use, reserved by ISO, advice, Issuer repeat',
  '9924': 'Private use, reserved by ISO, advice, Other',
  '9925': 'Private use, reserved by ISO, advice, Other repeat',

  '9930': 'Private use, reserved by ISO, advice response, Acquirer',
  '9931': 'Private use, reserved by ISO, advice response, Acquirer repeat',
  '9932': 'Private use, reserved by ISO, advice response, Issuer',
  '9933': 'Private use, reserved by ISO, advice response, Issuer repeat',
  '9934': 'Private use, reserved by ISO, advice response, Other',
  '9935': 'Private use, reserved by ISO, advice response, Other repeat',

  '9940': 'Private use, reserved by ISO, notification, Acquirer',
  '9941': 'Private use, reserved by ISO, notification, Acquirer repeat',
  '9942': 'Private use, reserved by ISO, notification, Issuer',
  '9943': 'Private use, reserved by ISO, notification, Issuer repeat',
  '9944': 'Private use, reserved by ISO, notification, Other',
  '9945': 'Private use, reserved by ISO, notification, Other repeat',

  '9950': 'Private use, reserved by ISO, notification response, Acquirer',
  '9951': 'Private use, reserved by ISO, notification response, Acquirer repeat',
  '9952': 'Private use, reserved by ISO, notification response, Issuer',
  '9953': 'Private use, reserved by ISO, notification response, Issuer repeat',
  '9954': 'Private use, reserved by ISO, notification response, Other',
  '9955': 'Private use, reserved by ISO, notification response, Other repeat',
};

let message_types = {
  1987: {
    '0100': 'Authorization request',
    '0110': 'Authorization request response',
    '0101': 'Authorization request repeat',
    '0120': 'Authorization advice',
    '0121': 'Authorization advice repeat',
    '0130': 'Authorization advice response',

    '0200': 'Financial request',
    '0201': 'Financial request repeat',
    '0202': 'Financial completion request',
    '0203': 'Financial completion request Repeat',
    '0210': 'Financial request response',
    '0212': 'Financial completion response',
    '0220': 'Financial Transaction Advice',
    '0221': 'Financial Transaction Advice Repeat',
    '0230': 'Financial Transaction advice response',

    '0320': 'Acquirer File Update Advice',
    '0321': 'Acquirer File Update Advice Repeat',
    '0322': 'Issuer file update advice',
    '0323': 'Issuer file update advice repeat',
    '0330': 'Acquirer File Update Advice Response',
    '0332': 'Issuer File Update Advice Response',

    '0400': 'Reversal request',
    '0401': 'Reversal request Repeat',
    '0410': 'Reversal request response',
    '0420': 'Reversal advice',
    '0421': 'Reversal advice Repeat',
    '0430': 'Reversal advice response',

    '0500': 'Acquirer reconciliation request',
    '0501': 'Acquirer reconciliation request Repeat',
    '0510': 'Acquirer reconciliation request response',
    '0520': 'Acquirer reconciliation advice',
    '0521': 'Acquirer reconciliation advice repeat',
    '0522': 'Card issuer reconciliation advice',
    '0532': 'Card issuer reconciliation advice response',
    '0523': 'Card issuer reconciliation advice repeat',
    '0530': 'Acquirer reconciliation advice response',

    '0600': 'Administration request',
    '0601': 'Administration request repeat',
    '0610': 'Administration response',
    '0620': 'Administration advice',
    '0621': 'Administration advice repeat',
    '0630': 'Administration advice response',

    '0800': 'Network Management request',
    '0801': 'Network Management request repeat',
    '0810': 'Network Management request response',
    '0820': 'Network Management advice'
  },

  1993: {
    '1100': 'Authorization request',
    '1110': 'Authorization request response',
    '1101': 'Authorization request repeat',
    '1120': 'Authorization advice',
    '1121': 'Authorization advice repeat',
    '1130': 'Authorization advice response',

    '1200': 'Financial request',
    '1201': 'Financial request repeat',
    '1202': 'Financial completion request',
    '1203': 'Financial completion request Repeat',
    '1210': 'Financial request response',
    '1212': 'Financial completion response',
    '1220': 'Financial Transaction Advice',
    '1221': 'Financial Transaction Advice Repeat',
    '1230': 'Financial Transaction advice response',

    '1320': 'Acquirer File Update Advice',
    '1321': 'Acquirer File Update Advice Repeat',
    '1322': 'Issuer file update advice',
    '1323': 'Issuer file update advice repeat',
    '1330': 'Acquirer File Update Advice Response',
    '1332': 'Issuer File Update Advice Response',

    '1400': 'Reversal request',
    '1401': 'Reversal request Repeat',
    '1410': 'Reversal request response',
    '1420': 'Reversal advice',
    '1421': 'Reversal advice Repeat',
    '1430': 'Reversal advice response',

    '1500': 'Acquirer reconciliation request',
    '1501': 'Acquirer reconciliation request Repeat',
    '1510': 'Acquirer reconciliation request response',
    '1520': 'Acquirer reconciliation advice',
    '1521': 'Acquirer reconciliation advice repeat',
    '1522': 'Card issuer reconciliation advice',
    '1532': 'Card issuer reconciliation advice response',
    '1523': 'Card issuer reconciliation advice repeat',
    '1530': 'Acquirer reconciliation advice response',

    '1600': 'Administration request',
    '1601': 'Administration request repeat',
    '1610': 'Administration response',
    '1620': 'Administration advice',
    '1621': 'Administration advice repeat',
    '1630': 'Administration advice response',

    '1800': 'Network Management request',
    '1801': 'Network Management request repeat',
    '1810': 'Network Management request response',
    '1820': 'Network Management advice'
  },
  2003: {
    '2100': 'Authorization request',
    '2110': 'Authorization request response',
    '2101': 'Authorization request repeat',
    '2120': 'Authorization advice',
    '2121': 'Authorization advice repeat',
    '2130': 'Authorization advice response',

    '2200': 'Financial request',
    '2201': 'Financial request repeat',
    '2202': 'Financial completion request',
    '2203': 'Financial completion request Repeat',
    '2210': 'Financial request response',
    '2212': 'Financial completion response',
    '2220': 'Financial Transaction Advice',
    '2221': 'Financial Transaction Advice Repeat',
    '2230': 'Financial Transaction advice response',

    '2320': 'Acquirer File Update Advice',
    '2321': 'Acquirer File Update Advice Repeat',
    '2322': 'Issuer file update advice',
    '2323': 'Issuer file update advice repeat',
    '2330': 'Acquirer File Update Advice Response',
    '2332': 'Issuer File Update Advice Response',

    '2400': 'Reversal request',
    '2401': 'Reversal request Repeat',
    '2410': 'Reversal request response',
    '2420': 'Reversal advice',
    '2421': 'Reversal advice Repeat',
    '2430': 'Reversal advice response',

    '2500': 'Acquirer reconciliation request',
    '2501': 'Acquirer reconciliation request Repeat',
    '2510': 'Acquirer reconciliation request response',
    '2520': 'Acquirer reconciliation advice',
    '2521': 'Acquirer reconciliation advice repeat',
    '2522': 'Card issuer reconciliation advice',
    '2532': 'Card issuer reconciliation advice response',
    '2523': 'Card issuer reconciliation advice repeat',
    '2530': 'Acquirer reconciliation advice response',

    '2600': 'Administration request',
    '2601': 'Administration request repeat',
    '2610': 'Administration response',
    '2620': 'Administration advice',
    '2621': 'Administration advice repeat',
    '2630': 'Administration advice response',

    '2800': 'Network Management request',
    '2801': 'Network Management request repeat',
    '2810': 'Network Management request response',
    '2820': 'Network Management advice'
  }
};

module.exports = function(mti) {
  let msg_type1987 = message_types['1987'][mti];
  let msg_type1993 = message_types['1993'][mti];
  let msg_type2003 = message_types['2003'][mti];
  let msg_typePrivate = private_common_types[mti];

  return msg_type2003 || msg_type1993 || msg_type1987 || msg_typePrivate;
};
