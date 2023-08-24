const CodeToKey = require('./keys').CodeToKey

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

    props[key] = isDateField(key) ? getDateFormat(value) : value
  })

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

const getDateFormat = (value) => {
  const [mm, dd, yyyy] = [value.slice(0, 2), value.slice(2, 4), value.slice(4)]
  return `${yyyy}-${mm}-${dd}`
}
