const fs = require('fs');
const readline = require('readline');
const { findMisspelledWordIfExists } = require('./wrongWordFinder');
const { ROTTEN_CHAR, ROTTEN_FILE_PATH, OUTPUT_PATH, breakLineSingleton } = require('./constants');

function getMisspelledWords() {
  return new Promise((resolve, reject) => {
    try {
      let rottenWords = [];
      console.time('readingTime');
      console.log('File reading process started...');
  
      const rl = readline.createInterface({
        input: fs.createReadStream(ROTTEN_FILE_PATH),
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

function createFileIfNotExists(currPath) {
  try {
    if(fs.existsSync(currPath)) {
      console.log(`File at ${currPath} already exists...`)
    } else {
      try {
        fs.openSync(currPath, 'w');
        
      } catch (error) {
        console.log('Ceta === ', error);
      }
    }
  } catch(err) {
    throw {
      msg: `Error at {createFileIfNotExists}`,
      error: err
    }
  }
}

function locateAndReplaceMisspelledWords(wordsWithSuggestions) {
  return new Promise((resolve, reject) => {
    try {
      createFileIfNotExists(OUTPUT_PATH);

      const writeFile = fs.createWriteStream(OUTPUT_PATH, {
        encoding: 'utf-8',
      })
      
      const rl = readline.createInterface({
        input: fs.createReadStream(ROTTEN_FILE_PATH),
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

          writeFile.write(currLine + breakLineSingleton.rot_break_line);
        } else {
          writeFile.write(currLine + breakLineSingleton.rot_break_line);
        }
      });
      
      rl.on('close', () => {
        resolve(true);
        console.log('---------------------- Done ----------------------')
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
