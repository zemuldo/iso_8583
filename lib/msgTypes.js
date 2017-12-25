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
  }    
};

module.exports = function(mti) {
  let msg_type = message_types['1987'][mti];
  if (!msg_type)
    msg_type = message_types['1993'][mti];

  return msg_type;
};
