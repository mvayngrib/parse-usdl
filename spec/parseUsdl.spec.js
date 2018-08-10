const UsdlData1 = require('./sample/index').UsdlData1;
const UsdlData2 = require('./sample/index').UsdlData2;
const UsdlData3 = require('./sample/index').UsdlData3;
const UsdlData4 = require('./sample/index').UsdlData4;
const UsdlData_error = require('./sample/index').UsdlData_error;
const UsdlData_invalid_characters = require('./sample/index').UsdlData_invalid_characters;
const UsdlData_invalid_characters_2 = require('./sample/index').UsdlData_invalid_characters_2;
const default_fixture = require('./fixtures').default;
const canada_fixture = require('./fixtures').canada;

const parse = require("../index").parse;

describe("USDL Parser", () => {
  it("should parse correct values", () => {
    const parsedData = parse(UsdlData1);
    expect(parsedData).toEqual(default_fixture);
  });

  it("should correctly identify female", () => {
    const parsedData = parse(UsdlData2);
    expect(parsedData.sex).toBe("F");
  });

  it("should correctly identify unspecified gender", () => {
    const parsedData = parse(UsdlData3);
    expect(parsedData.sex).toBe("X");
  });

  it("should parse correct values", () => {
    const parsedData = parse(UsdlData4);
    expect(parsedData).toEqual(canada_fixture);
  });

  it("should not throw error if invalid code is passed and warming suppress is on", () => {
    function parseData() {
      return parse(UsdlData_error, {suppressErrors: true});
    }

    const parsedData = parseData();

    expect(parsedData).toEqual(default_fixture)
  });

  it("should throw error if invalid code is passed", () => {
    function parseData() {
      parse(UsdlData_error);
    }

    expect(parseData).toThrow(/unknown code: ZZZ/);
  });

  it("should remove invalid characters", () => {
    // Refer to https://www.neodynamic.com/Products/Help/BarcodeWinControl2.5/working_barcode_symbologies.htm#Pdf417
    const parsedData = parse(UsdlData_invalid_characters);

    expect(parsedData).toEqual(default_fixture)
  });

  it("should remove invalid characters and trim when sanitizing the data", () => {
    const parsedData = parse(UsdlData_invalid_characters_2);

    expect(parsedData).toEqual(default_fixture)
  });
});
