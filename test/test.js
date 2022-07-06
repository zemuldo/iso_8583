const m = {
    "0": "0200",
    "2": "4761739001010465",
    "3": "501000",
    "4": "210000",
    "7": "202194610",
    "11": "116337",
    "127": "2='000000116337'; 3='                      002424002424            '; 22='221ThirdPartyBillPayment3125<ThirdPartyBillPayment><BillPaymentRequest><ReferenceId>1022436062</ReferenceId></BillPaymentRequest></ThirdPartyBillPayment>230ThirdPartyBillPaymentExtension3225<ThirdPartyBillPaymentExtension><BillPaymentRequestExtension><CustomerId>1022436062</CustomerId><ProductCode>5000000</ProductCode><ItemCode>08125438953</ItemCode></BillPaymentRequestExtension></ThirdPartyBillPaymentExtension>211MediaTotals3211<MediaTotals><Totals><Amount>99300000</Amount><Currency>566</Currency><MediaClass>Cash</MediaClass></Totals><Totals><Amount>0</Amount><Currency>000</Currency><MediaClass>Cards</MediaClass></Totals></MediaTotals>218Postilion:MetaData3141221ThirdPartyBillPayment111230ThirdPartyBillPaymentExtension111211MediaTotals111212MediaBatchNr111217AdditionalEmvTags111214AdditionalInfo111212MediaBatchNr16198916217AdditionalEmvTags3344<AdditionalEmvTags><EmvTag><TagId>50</TagId><TagValue>5645525645</TagValue></EmvTag><EmvTag><TagId>81</TagId><TagValue>004C4B40</TagValue></EmvTag><EmvTag><TagId>5F36</TagId><TagValue>00</TagValue></EmvTag><EmvTag><TagId>5F34</TagId><TagValue>02</TagValue></EmvTag><EmvTag><TagId>9B</TagId><TagValue>6800</TagValue></EmvTag></AdditionalEmvTags>214AdditionalInfo3449<AdditionalInfo><Transaction><OpCode> D B  CC</OpCode><BufferB>08125438953</BufferB><BufferC>1022436062</BufferC><CfgExtendedTrxType>9701</CfgExtendedTrxType><CfgReceivingInstitutionIDCode>011</CfgReceivingInstitutionIDCode></Transaction><Download><ATMConfigID>5006</ATMConfigID><AtmAppConfigID>5006</AtmAppConfigID><LoadsetGroup>FEP Wincor EMV+VISA</LoadsetGroup><DownloadApp>2020_HYOSUNG_DWNLD_SWT_ETZ_PAY</DownloadApp></Download></AdditionalInfo>'; 25='<?xml version=\"1.0\" encoding=\"UTF-8\"?> <IccData><IccRequest><AmountAuthorized>000000210000</AmountAuthorized><AmountOther>000000000000</AmountOther><ApplicationInterchangeProfile>3800</ApplicationInterchangeProfile><ApplicationTransactionCounter>002D</ApplicationTransactionCounter><Cryptogram>93E957223EF23846</Cryptogram><CryptogramInformationData>80</CryptogramInformationData><CvmResults>420300</CvmResults><IssuerApplicationData>06010A03A0A802</IssuerApplicationData><TerminalCapabilities>E040C8</TerminalCapabilities><TerminalCountryCode>566</TerminalCountryCode><TerminalType>22</TerminalType><TerminalVerificationResult>0000040000</TerminalVerificationResult><TransactionCurrencyCode>566</TransactionCurrencyCode><TransactionDate>220202</TransactionDate><TransactionType>00</TransactionType><UnpredictableNumber>39EB665C</UnpredictableNumber></IccRequest></IccData>'",
    "70": "001"
}

let customFormats = {
    '123': {
        ContentType: 'ans',
        Label: 'Reserved for private use',
        LenType: 'llllllvar',
        MaxLen: 999999
    },
    '123.1': {
        ContentType: 'ans',
        Label: 'Len',
        LenType: 'fixed',
        MaxLen: 15
    },
    '123.2': {
        ContentType: 'ans',
        Label: 'Card data input capability',
        LenType: 'fixed',
        MaxLen: 15
    },
    '123.3': {
        ContentType: 'ans',
        Label: 'Cardholder authentication capability',
        LenType: 'fixed',
        MaxLen: 15
    },
    '123.4': {
        ContentType: 'ans',
        Label: 'Card capture capability',
        LenType: 'fixed',
        MaxLen: 15
    },
    '123.5': {
        ContentType: 'ans',
        Label: 'Operating environment',
        LenType: 'fixed',
        MaxLen: 15
    },
    '123.6': {
        ContentType: 'ans',
        Label: 'Cardholder is present',
        LenType: 'fixed',
        MaxLen: 15
    },
    '123.7': {
        ContentType: 'ans',
        Label: 'Card is present',
        LenType: 'fixed',
        MaxLen: 15
    },
    '123.8': {
        ContentType: 'ans',
        Label: 'Card data input mode',
        LenType: 'fixed',
        MaxLen: 15
    },
    '123.9': {
        ContentType: 'ans',
        Label: 'Cardholder authentication method',
        LenType: 'fixed',
        MaxLen: 15
    },
    '123.10': {
        ContentType: 'ans',
        Label: 'Cardholder authentication entity',
        LenType: 'fixed',
        MaxLen: 15
    },
    '123.11': {
        ContentType: 'ans',
        Label: 'Card data output capability',
        LenType: 'fixed',
        MaxLen: 15
    },
    '123.12': {
        ContentType: 'ans',
        Label: 'Terminal output capability',
        LenType: 'fixed',
        MaxLen: 15
    },
    '123.13': {
        ContentType: 'ans',
        Label: 'PIN capture capability',
        LenType: 'fixed',
        MaxLen: 15
    },
    '123.14': {
        ContentType: 'ans',
        Label: 'Terminal operator',
        LenType: 'fixed',
        MaxLen: 15
    },
    '123.15': {
        ContentType: 'ans',
        Label: 'Terminal type',
        LenType: 'fixed',
        MaxLen: 15
    },
    '127.50': {
        ContentType: 'ans',
        Label: 'Integrated circuit card (ICC) Data',
        LenType: 'llllvar',
        MaxLen: 8000,
        MinLen: 10
    },
    '4': {
        ContentType: 'n',
        Label: 'Amount, transaction',
        LenType: 'fixed',
        MaxLen: 6,
    },
    '7': {
        ContentType: 'n',
        Label: 'Transmission date & time',
        LenType: 'fixed',
        MaxLen: 9
    },
};


const ISO8583 = require('../lib/8583');

const i = new ISO8583(m, customFormats);
i.field127Encoding = 'key_value_encoded'

const b = i.getBufferMessage()

console.log(b.toString())


console.log(i.getIsoJSON(b))
