const CodeToKey = require("./keys").CodeToKey;

const lineSeparater = "\n";
const beginningOfLineIndex = 0;

const defaultOptions = {suppressErrors: false};

exports.parse = function parseCode128(str, options = defaultOptions) {
  const props = {};
  const lines = str.trim().split(lineSeparater);
  let started;
  lines.slice(0, -1).forEach(line => {
    if (!started) {
      if (line.indexOf("ANSI ") === beginningOfLineIndex) {
        started = true;
      }
      return;
    }

    let code = getCode(line);
    let value = getValue(line);
    let key = getKey(code);
    if (!key) {
      if (options.suppressErrors) {
        return;
      } else {
        throw new Error("unknown code: " + code);
      }
    }

    if (isSexField(code)) value = getSex(code, value);

    props[key] = isDateField(key) ? getDateFormat(value) : value;
  });

  return props;
};

const getCode = line => line.slice(0, 3);
const getValue = line => line.slice(3);
const getKey = code => CodeToKey[code];

const isSexField = code => code === "DBC";

const getSex = (code, value) => (value === "1" ? "M" : "F");

const isDateField = key => key.indexOf("date") === beginningOfLineIndex;

const getDateFormat = value => {
  const parts = [value.slice(0, 2), value.slice(2, 4), value.slice(4)];
  return parts.join("/");
};
