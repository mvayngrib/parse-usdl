
# parse-usdl

parse Pdf417 barcode data from US driver licenses

## Usage

```js
import { parse } from 'parse-usdl'

const code =
`@

ANSI 636001070002DL00410392ZN04330047DLDCANONE
DCBNONE
DCDNONE
DBA08312013
DCSMichael
DACM
DADMotorist
DBD08312013
DBB08312013
DBC1
DAYBRO
DAU064 in
DAG2345 ANYWHERE STREET
DAIYOUR CITY
DAJNY
DAK123450000
DAQNONE
DCFNONE
DCGUSA
DDEN
DDFN
DDGN
`
const data = parse(code)
console.log(JSON.stringify(data, null, 2))

// {
//   "jurisdictionRestrictionCodes": "NONE",
//   "jurisdictionEndorsementCodes": "NONE",
//   "dateOfExpiry": 1377921600000,
//   "lastName": "Michael",
//   "firstName": "M",
//   "middleName": "Motorist",
//   "dateOfIssue": 1377921600000,
//   "dateOfBirth": 1377921600000,
//   "sex": "M",
//   "eyeColor": "BRO",
//   "height": "064 in",
//   "addressStreet": "2345 ANYWHERE STREET",
//   "addressCity": "YOUR CITY",
//   "addressState": "NY",
//   "addressPostalCode": "123450000",
//   "documentNumber": "NONE",
//   "documentDiscriminator": "NONE",
//   "issuer": "USA",
//   "lastNameTruncated": "N",
//   "firstNameTruncated": "N",
//   "middleNameTruncated": "N"
// }
// ~/Co
```

## Optional Parameters


#### suppressErrors
Prevent a hard error in the case of a bad code provided. All valid codes will be parsed and returned.

```javascript
const options = {
    suppressErrors: false
}
```
