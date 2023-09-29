const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { findMisspelledWordIfExists } = require('./wrongWordFinder');

const roittenFilePath = path.resolve(__dirname, 'assets/', 'rotten_file.txt');

function getMisspelledWords() {
  return new Promise((resolve, reject) => {
    try {
      let rottenWords = [];
      console.time('readingTime');
      console.log('File reading process started...');
  
      const rl = readline.createInterface({
        input: fs.createReadStream(roittenFilePath),
        crlfDelay: Infinity
      });
      
      rl.on('line', (currLine) => {
        findMisspelledWordIfExists(currLine, rottenWords) 
      });
      
      rl.on('close', () => {
        console.timeEnd('readingTime');
        console.log('File reading process finished...');
        resolve(rottenWords);
      });
    } 
    catch (err) {
      reject({
        msg: `Error at opening dictionary searching in: ${dictionaryPath}`,
        error: err
      });
    }
  })

}

module.exports = {
  getMisspelledWords,
}
