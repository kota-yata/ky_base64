import { base64Chars } from "./common.ts";

const base64ToUtf8 = (base64Str: string): number[] => {
  const strArray = base64Str.replace(/=/g, "").split("");
  const result: number[] = [];
  let connection = 0;
  for (let i = 0; i < strArray.length; i++) {
    const tableIndex = base64Chars.indexOf(strArray[i]);
    const mod = i % 4;
    if (mod === 0 || mod === 4) {
      connection = tableIndex << 2;
      continue;
    }
    const bitsToShift = 6 - mod * 2;
    connection += tableIndex >>> bitsToShift;
    result.push(connection);
    const extra = tableIndex << (8 - bitsToShift);
    connection = extra % 256;
  }
  return result;
};

const generateUtf8Str = (codeArray: number[]): string => {
  const utf16 = String.fromCharCode(...codeArray);
  const utf8 = decodeURIComponent(escape(utf16));
  return utf8;
};

const decodeUtf8 = (codeArray: number[]) => {
  const result: string[] = [];
  let index = 0;
  while (index < codeArray.length) {
    if (codeArray[index] >= 128 && codeArray[index] < 192) {
      throw new Error("Incorrect char code");
    }
    let increments = 0;
    if (codeArray[index] < 128) {
      increments = 1;
    } else if (codeArray[index] < 224) {
      increments = 2;
    } else if (codeArray[index] < 240) {
      increments = 3;
    } else if (codeArray[index] < 248) {
      increments = 4;
    }
    result.push(generateUtf8Str(codeArray.slice(index, index + increments)));
    index += increments;
  }
  return result.join("");
};

export const decode = (encodedStr: string) => {
  const utf8CodeArray = base64ToUtf8(encodedStr);
  const resultStr = decodeUtf8(utf8CodeArray);
  return resultStr;
};
