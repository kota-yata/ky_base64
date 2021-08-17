import { base64Chars } from "./common.ts";

const base64ToUint8Array = (base64Str: string): Uint8Array => {
  const strArray = base64Str.replace(/=/g, "").split("");
  const lengthAs8Bits = (strArray.length * 6 / 8);
  const result = new Uint8Array(lengthAs8Bits);
  let connection = 0;
  let uintIterator = 0; // Because not every process in the loop below pushes to result array.
  for (let i = 0; i < strArray.length; i++) {
    const tableIndex = base64Chars.indexOf(strArray[i]);
    const mod = i % 4;
    if (mod === 0 || mod === 4) {
      connection = tableIndex << 2;
      continue;
    }
    const bitsToShift = 6 - mod * 2;
    connection += tableIndex >>> bitsToShift;
    result[uintIterator] = connection;
    uintIterator++;
    const extra = tableIndex << (8 - bitsToShift);
    connection = extra % 256;
  }
  return result;
};

export const decode = (encodedStr: string) => {
  const uint8Array = base64ToUint8Array(encodedStr);
  const decoder = new TextDecoder();
  const result = decoder.decode(uint8Array);
  return result;
};
