exports.parse = function parseCode128 (str) {
  const props = {}
  const lines = str.trim().split('\n')
  let started
  for (let i = 0; i < lines.length - 1; i++) {
    let line = lines[i]
    if (!started) {
      if (line.indexOf('ANSI ') === 0) {
        started = true
      }

      continue
    }

    let code = line.slice(0, 3)
    let value = line.slice(3)
    let key = CODE_TO_KEY[code]
    if (!key) throw new Error('unknown code: ' + code)

    if (code === 'DBC') {
      if (value === '1') {
        value = 'M'
      } else if (value === '2') {
        value = 'F'
      }
    }

    if (key.indexOf('date') === 0) {
      let parts = [value.slice(0, 2), value.slice(2, 4), value.slice(4)]
      value = new Date(parts.join('/')).getTime()
    }

    props[key] = value
  }

  return props
}

// Source: http://www.aamva.org/DL-ID-Card-Design-Standard/
const CODE_TO_KEY = {
  DCA: 'jurisdictionVehicleClass',
  DCB: 'jurisdictionRestrictionCodes',
  DCD: 'jurisdictionEndorsementCodes',
  DBA: 'dateOfExpiry',
  DCS: 'lastName',
  DAC: 'firstName',
  DAD: 'middleName',
  DBD: 'dateOfIssue',
  DBB: 'dateOfBirth',
  DBC: 'sex',
  DAY: 'eyeColor',
  DAU: 'height',
  DAG: 'addressStreet',
  DAI: 'addressCity',
  DAJ: 'addressState',
  DAK: 'addressPostalCode',
  DAQ: 'documentNumber',
  DCF: 'documentDiscriminator',
  DCG: 'issuer',
  DDE: 'lastNameTruncated',
  DDF: 'firstNameTruncated',
  DDG: 'middleNameTruncated',
  // optional
  DAZ: 'hairColor',
  DAH: 'addressStreet2',
  DCI: 'placeOfBirth',
  DCJ: 'auditInformation',
  DCK: 'inventoryControlNumber',
  DBN: 'otherLastName',
  DBG: 'otherFirstName',
  DBS: 'otherSuffixName',
  DCU: 'nameSuffix', // e.g. jr, sr
  DCE: 'weightRange',
  DCL: 'race',
  DCM: 'standardVehicleClassification',
  DCN: 'standardEndorsementCode',
  DCO: 'standardRestrictionCode',
  DCP: 'jurisdictionVehicleClassificationDescription',
  DCQ: 'jurisdictionEndorsementCodeDescription',
  DCR: 'jurisdictionRestrictionCodeDescription',
  DDA: 'complianceType',
  DDB: 'dateCardRevised',
  DDC: 'dateOfExpiryHazmatEndorsement',
  DDD: 'limitedDurationDocumentIndicator',
  DAW: 'weightLb',
  DAX: 'weightKg',
  DDH: 'dateAge18',
  DDI: 'dateAge19',
  DDJ: 'dateAge21',
  DDK: 'organDonor',
  DDL: 'veteran'
}
