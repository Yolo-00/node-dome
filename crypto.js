import { createHash, randomInt } from "node:crypto";

const hash = createHash("sha256");

hash.update("Hello, world!");

console.log(hash.digest("hex"));

for (let i = 0; i < 2; i++) {
  console.log(randomInt(100));
}
