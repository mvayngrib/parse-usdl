import {UsdlData1, UsdlData2, UsdlData_error} from "./sample/index";
import {parse} from "../index";

describe("USDL Parser", () => {
  it("should parse correct values", () => {
    const parsedData = parse(UsdlData1);
    expect(parsedData.addressCity).toBe("YOUR CITY");
    expect(parsedData.addressPostalCode).toBe("123450000");
    expect(parsedData.addressState).toBe("NY");
    expect(parsedData.addressStreet).toBe("2345 ANYWHERE STREET");
    expect(parsedData.dateOfBirth).toBe(1377925200000);
    expect(parsedData.dateOfExpiry).toBe(1377925200000);
    expect(parsedData.dateOfIssue).toBe(1377925200000);
    expect(parsedData.documentDiscriminator).toBe("NONE");
    expect(parsedData.documentNumber).toBe("NONE");
    expect(parsedData.eyeColor).toBe("BRO");
    expect(parsedData.firstName).toBe("M");
    expect(parsedData.firstNameTruncated).toBe("N");
    expect(parsedData.height).toBe("064 in");
    expect(parsedData.issuer).toBe("USA");
    expect(parsedData.jurisdictionEndorsementCodes).toBe("NONE");
    expect(parsedData.jurisdictionRestrictionCodes).toBe("NONE");
    expect(parsedData.lastName).toBe("Michael");
    expect(parsedData.lastNameTruncated).toBe("N");
    expect(parsedData.middleName).toBe("Motorist");
    expect(parsedData.middleNameTruncated).toBe("N");
    expect(parsedData.sex).toBe("M");
  });

  it("should correctly identify female", () => {
    const parsedData = parse(UsdlData2);
    expect(parsedData.sex).toBe("F");

  });

  it("should not throw error if invalid code is passed and warming suppress is on", () => {
    function parseData() {
      return parse(UsdlData_error, {suppressErrors: true});
    }

    const parsedData = parseData();

    expect(parsedData.addressCity).toBe("YOUR CITY");
    expect(parsedData.addressPostalCode).toBe("123450000");
    expect(parsedData.addressState).toBe("NY");
    expect(parsedData.addressStreet).toBe("2345 ANYWHERE STREET");
    expect(parsedData.dateOfBirth).toBe(1377925200000);
    expect(parsedData.dateOfExpiry).toBe(1377925200000);
    expect(parsedData.dateOfIssue).toBe(1377925200000);
    expect(parsedData.documentDiscriminator).toBe("NONE");
    expect(parsedData.documentNumber).toBe("NONE");
    expect(parsedData.eyeColor).toBe("BRO");
    expect(parsedData.firstName).toBe("M");
    expect(parsedData.firstNameTruncated).toBe("N");
    expect(parsedData.height).toBe("064 in");
    expect(parsedData.issuer).toBe("USA");
    expect(parsedData.jurisdictionEndorsementCodes).toBe("NONE");
    expect(parsedData.jurisdictionRestrictionCodes).toBe("NONE");
    expect(parsedData.lastName).toBe("Michael");
    expect(parsedData.lastNameTruncated).toBe("N");
    expect(parsedData.middleName).toBe("Motorist");
    expect(parsedData.middleNameTruncated).toBe("N");
    expect(parsedData.sex).toBe("M");
  });

  it("should throw error if invalid code is passed", () => {
    function parseData() {
      parse(UsdlData_error);
    }

    expect(parseData).toThrow(/unknown code: ZZZ/);
  });
});
