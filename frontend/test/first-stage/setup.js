const path = require("path");
const fs = require("fs");

let html = '';
const content = fs.readFileSync(
  path.resolve("./frontend/src/first-stage/first-stage.html"),
  "utf-8"
);

const arrLines = content.split('\n')

for (let i = 2; i < arrLines.length-1; i++) {
  html += arrLines[i] + '\n'
}

document.documentElement.innerHTML = html