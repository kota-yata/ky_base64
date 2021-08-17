import { base64Chars } from "./common.ts";

interface splitted {
  mainBits: number;
  extraBits: number;
}

const splitNum = (num: number, i: number): splitted => {
  let bitsToShift = 0;
  const mod = i % 3;
  if (mod === 0 || mod === 3) {
    bitsToShift = 2;
  } else if (mod === 1) {
    bitsToShift = 4;
  } else if (mod === 2) {
    bitsToShift = 6;
  }
  const mainBits = (num >>> bitsToShift);
  const extraBits = (num << (6 - bitsToShift)) % 64;
  return { mainBits, extraBits };
};

const convert8to6 = (uint8Array: Uint8Array) => {
  let extra = 0;
  const new6BitsArray: number[] = [];
  for (let i = 0; i < uint8Array.length; i++) {
    const num = uint8Array[i];
    const splitted: splitted = splitNum(num, i);
    const main = splitted.mainBits + extra;
    new6BitsArray.push(main);
    if (i % 3 === 2 || i === uint8Array.length - 1) {
      new6BitsArray.push(splitted.extraBits);
      extra = 0;
    } else {
      extra = splitted.extraBits;
    }
  }
  return new6BitsArray;
};

const generateEncodeResult = (new6BitsArray: number[]): string => {
  const mod4 = new6BitsArray.length % 4 === 0
    ? 0
    : 4 - (new6BitsArray.length % 4);
  let result = "";
  new6BitsArray.map((bits: number) => {
    result += base64Chars[bits];
  });
  result += "=".repeat(mod4);
  return result;
};

// encoding with TypedArray
export const encode = (str: string) => {
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(str);
  const new6BitsArray = convert8to6(uint8Array);
  const result = generateEncodeResult(new6BitsArray);
  return result;
};
