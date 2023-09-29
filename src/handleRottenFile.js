const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { findMisspelledWordIfExists, ROTTEN_CHAR } = require('./wrongWordFinder');

const rottenFilePath = path.resolve(__dirname, 'assets/', 'rotten_file.txt');
const newFile = path.resolve(__dirname, 'assets/', 'fixed_file.txt');

function getMisspelledWords() {
  return new Promise((resolve, reject) => {
    try {
      let rottenWords = [];
      console.time('readingTime');
      console.log('File reading process started...');
  
      const rl = readline.createInterface({
        input: fs.createReadStream(rottenFilePath),
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
        msg: `Error at {getMisspelledWords}`,
        error: err
      });
    }
  });
}

function locateAndReplaceMisspelledWords(wordsWithSuggestions) {
  return new Promise((resolve, reject) => {
    try {

      const writeFile = fs.createWriteStream(newFile, {
        encoding: 'utf-8',
      })
      
      const rl = readline.createInterface({
        input: fs.createReadStream(rottenFilePath),
        crlfDelay: Infinity
      });
      
      rl.on('line', (currLine) => {
        //
        if(currLine.includes(ROTTEN_CHAR)) {
          wordsWithSuggestions.forEach(item => {
            if(item.suggestions.length) {
              while (currLine.includes(item.word)) {
                console.log(`Find ${item.word} || replace ${item.suggestions[0]}`);
                currLine = currLine.replace(item.word, item.suggestions[0]);
              }
            } else {
              console.log(`COULD NOT FIND SUGGESTIONS FOR ${item.word}`)
            }
          });

          writeFile.write(currLine + '\n');
        } else {
          writeFile.write(currLine + '\n');
        }
      });
      
      rl.on('close', () => {
        resolve(true);
        console.log('---------------------- Finalizado ----------------------')
      });
    } 
    catch (err) {
      reject({
        msg: `Error at {locateAndReplaceMisspelledWords}`,
        error: err
      });
    }
  })
}

module.exports = {
  getMisspelledWords,
  locateAndReplaceMisspelledWords
}
