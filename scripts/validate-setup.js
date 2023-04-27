// - use -f for only frontend, -b for only backend, like in publish.sh

import requirements from "./requirements.json" assert { type: "json", integrity: "sha384-ABC123" };
import fs from "fs";
console.log("validate project setup");

// console.log("files" + requirements.files.length);
let hasErrors = false;
requirements.files.forEach((file) => {
  const path = `..${file.name}`;
  console.log("check " + path);
  if (fs.existsSync(path)) {
    // console.log(` ${file.name} exists`);
    const data = fs.readFileSync(path,
      {encoding:'utf8', flag:'r'});

    if (typeof file.content === "string") {
      // console.log("check string" + file.content);

      if(!data.includes(file.content)){
        console.error(`Missing content ${file.content}`);
        hasErrors = true;
      }

    } else if (Array.isArray(file.content)) {
      // console.log("check array" + file.content[0]);
      file.content.forEach(content => {
        if(!data.includes(content)){
          console.error(`============Missing content ${content}==========`);
          hasErrors = true;
        }
      });
    }
  } else {
    console.error(`============Missing file ${path}==========`);
    hasErrors = true;
  }
});

console.log("");

if (hasErrors){
  console.error(`============ See Errors above ==========`);
} else {
  console.error(`============ No Error found ==========`);

}

console.log("");
console.log("");
