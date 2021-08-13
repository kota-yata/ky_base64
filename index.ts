import { base64Chars } from "./src/common.ts";
import { encode } from "./src/encode.ts";

// WIP
const decode = (encodedStr: string) => {
  const strArray = encodedStr.split('');
  let result: number[] = [];
  let extra = 0;
  strArray.map((letter) => {
    const index = base64Chars.indexOf(letter);
    if (index === -1) throw new Error(`Base64 conversion table doesn't have the letter '${letter}'`);

  });
};

console.log(encode("as;fijaお肉食べたい鯰𩸽"));

