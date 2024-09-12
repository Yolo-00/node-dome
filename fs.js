"use strict";
import {
  readFile,
  readFileSync,
} from "node:fs";
import {
  access,
  constants,
  writeFile,
  appendFile,
  stat,
} from "node:fs/promises";

// console.log("BEGIN");

// try {
//   let s = readFileSync("package.json", "utf-8");
//   console.log(s);
//   console.log(JSON.stringify(s));
// } catch (err) {
//   console.log(err);
// }
// console.log("END");

// readFile("package.json", "utf-8", (err, data) => {
//   console.log(err);
//   if (err) {
//     console.error(err);
//   } else {
//     console.log(data);
//   }
// });

// try {
//   await access("index.txt", constants.F_OK | constants.R_OK | constants.W_OK);
//   console.log("文件存在，且可读可写");
//   await appendFile("index.txt", "\n我是追加的内容", "utf-8");
//   const res = await stat("index.txt");
//   console.log(res);
//   console.log("是否是目录", res.isDirectory());
//   console.log("创建时间:",new Date(res.birthtimeMs).toLocaleString());
//   console.log("修改时间:",new Date(res.mtimeMs).toLocaleString());
// } catch (err) {
//   writeFile("index.txt", "你好fs系统", "utf-8");
//   console.error(err, "文件不存在或者权限不足");
// }

