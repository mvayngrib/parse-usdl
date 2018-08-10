const CodeToKey = require("./keys").CodeToKey;

const lineSeparator = "\n";

const defaultOptions = {suppressErrors: false};

exports.parse = function parseDL(str, options = defaultOptions) {
  const props = {};
  const rawLines = str.trim().split(lineSeparator);
  const lines = rawLines.map(rawLine => sanitizeData(rawLine));
  let started;
  let iin;
  lines.forEach(line => {
    if (!started) {
      if (line.indexOf("ANSI ") === 0) {
        started = true;
        props["iin"] = line.slice(5,11); // 6-digit Issuer Identification Numbers
      }
      return;
    }

    let code = getCode(line);
    let value = getValue(line);
    let key = getKey(code);
    if (!key) {
      if (options.suppressErrors || code === "ZNZ") {
        return;
      } else {
        throw new Error("unknown code: " + code);
      }
    }

    if (isSexField(code)) value = getSex(code, value);
    props[key] = value;
  });

  // date format depends on issuer
  const issuer = props["issuer"] || "CAN";
  const getDateFormat = issuer === "USA" ? getDateFormatUSA : getDateFormatCAN;

  for (let key in props) {
    if (isDateField(key)) {
      props[key] = getDateFormat(props[key]);
    }
  }

  return props;
};

const sanitizeData = rawLine => rawLine.match(/[\011\012\015\040-\177]*/g).join('').trim();

const getCode = line => line.slice(0, 3);
const getValue = line => line.slice(3);
const getKey = code => CodeToKey[code];

const isSexField = code => code === "DBC";

const getSex = (code, value) => {
  if (value === "1" || value === "M") {
    return "M";
  } else if (value === "2" || value === "F") {
    return "F";
  }
  return "X";
};

const isDateField = key => key.indexOf("date") === 0;

const getDateFormatUSA = value => {
  const parts = [value.slice(0, 2), value.slice(2, 4), value.slice(4)];
  return parts.join("/");
};

const getDateFormatCAN = value => {
  const parts = [value.slice(0, 4), value.slice(4, 6), value.slice(6)];
  return parts.join("/");
};



