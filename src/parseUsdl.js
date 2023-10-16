(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.Usdl = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    const exports = { };

    const CodeToKey = {
        DCT: 'firstNameAndMiddleName',
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
        DAA: 'CustomerFullName',
        DAB: 'CustomerLastName',
        DAR: 'LicenseClassificationCode',
        DAS: 'LicenseRestrictionCode',
        DAT: 'LicenseEndorsementsCode',
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
        DDL: 'veteran',
    };

    const lineSeparator = /\r|\n/;

    const defaultOptions = { suppressErrors: false }

    exports.parse = function parseCode128(str, options = defaultOptions) {
        const props = {}
        const rawLines = str.trim().split(lineSeparator)
        const lines = rawLines.map((rawLine) => sanitizeData(rawLine))
        let started
        lines.slice(0, -1).forEach((line) => {
            if (!started) {
                if (line.indexOf('ANSI ') === 0) {
                    started = true

                    // has DLDAQ
                    if (line.includes('DLDAQ')) {
                        const lineArray = line.split('DLDAQ')
                        line = 'DAQ' + lineArray[1]
                    } else {
                        return
                    }
                } else {
                    return
                }
            }

            let code = getCode(line)
            let value = getValue(line)
            let key = getKey(code)

            if (!key) {
                if (options.suppressErrors) {
                    return
                } else {
                    throw new Error('unknown code: ' + code)
                }
            }

            if (isSexField(code)) value = getSex(code, value)

            props[key] = value
        })

        if (!props.issuer) {
            // Set default issuer to USA, if no issuer is found
            props['issuer'] = "USA"
        }

        Object.entries(props).forEach(([key, value]) => {
            if (isDateField(key)) props[key] = getDateFormat(value, props.issuer)
        });

        return props
    }

    const sanitizeData = (rawLine) =>
        rawLine
            .match(/[\011\012\015\040-\177]*/g)
            .join('')
            .trim()

    const getCode = (line) => line.slice(0, 3)
    const getValue = (line) => line.slice(3)
    const getKey = (code) => CodeToKey[code]

    const isSexField = (code) => code === 'DBC'

    const getSex = (code, value) => (value === '1' ? 'M' : 'F')

    const isDateField = (key) => key.indexOf('date') === 0

    const getDateFormat = (value, issuer) => {
        if (issuer === "CAN") {
            const [yyyy, mm, dd] = [value.slice(0, 4), value.slice(4, 6), value.slice(6)]
            return `${yyyy}-${mm}-${dd}`
        } else {
            const [mm, dd, yyyy] = [value.slice(0, 2), value.slice(2, 4), value.slice(4)]
            return `${yyyy}-${mm}-${dd}`
        }
    }

    return exports;
}));
