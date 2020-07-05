const request = require("request");
const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const userInput = process.argv.slice(2); // takes in URL and path to write in array

request(userInput[0], (error, response, body) => {
  
  if (response.statusCode !== 200) {
    console.log(error);
    process.exit;
  }
  // if file is not writable return error and exit
  if (fs.access(userInput[1], fs.constants.W_OK, (error) => {
    if (error) {
      console.log(`${userInput[1]} ${error}  is not writable`);
      process.exit();
    }
  }));

  if (fs.existsSync(userInput[1])) {
    console.log(`This file already exists.`);
    rl.question(`Type in 'y' followed by enter key <-- to overwrite this file`,
      (ans) => {
        if (ans !== "y") {
          console.log(`Exiting program now`);
          process.exit();
        } else {
          console.log(`Will now Overwrite the existing file`);
          writeFile(userInput[1], body);
        }
        rl.close();
      }
    );
  } else {
    writeFile(userInput[1], body);
  }
});

const writeFile = (createFile, body) => {
  fs.writeFile(createFile, body, (err) => {
    if (err) throw err;
    let fileStats = fs.statSync(createFile);
    let fileSizeBytes = fileStats["size"];
    console.log(`Downloaded and saved ${fileSizeBytes} bytes to ${createFile}`);
    process.exit();
  });
};