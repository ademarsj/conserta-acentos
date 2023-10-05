const fs = require('fs');
const path = require('path');
const readline = require('readline');
const {BREAK_LINE_CHAR} = require('./constants');

const BUFFER_BYTES_SYZE = 64;

const DICTIONARY_FILE_PATH = path.resolve(__dirname, 'assets','pt-BR.dic');
const BOOKMARK_PATH = path.resolve(__dirname, 'assets', 'bookmarks.txt');

function getNextRegexpObject(currLetter) {
  let newLetter = String.fromCharCode((String(currLetter).charCodeAt(0) + 1)); //122 = 'z'
  let regexpPattern = `${BREAK_LINE_CHAR}${newLetter}.*`;
  return {
    letter: newLetter,
    regexp: new RegExp(regexpPattern,'gi')
  };
}

async function createDictionaryBookmarks() {
  return new Promise((resolve, reject) => {
    //open only in "read" mode
    fs.open(DICTIONARY_FILE_PATH, 'r', async (err, fd) => {
    
      if (err) {
        throw {
          msg: `Error at opening dictionary searching in: ${DICTIONARY_FILE_PATH}`,
          error: err
        } 
      }

      //Working with a simple array with 26 positions its better, improve later
      let positionObject = {
        'a': 0,
      };
    
      try {
        fileStatus = fs.statSync(DICTIONARY_FILE_PATH);
        fileSize = fileStatus.size;

        currRegexp = getNextRegexpObject('a');

        let positionOffset = 0;
        let currText = '';

        while (positionOffset < fileSize) {
          currText = await readChunk(fd, positionOffset);

          if(currText.match(currRegexp.regexp)) {
            positionObject[currRegexp.letter] = positionOffset;
            currRegexp = getNextRegexpObject(currRegexp.letter);
          }
          positionOffset += BUFFER_BYTES_SYZE - 4; //Pick whole words that may have been cut before
        }

        await saveBookmarks(positionObject);
        resolve(true);
      }
      catch(err) {
        reject({
          msg: `Error at reading dictionary file`,
          error: err
        }); 
      }
    });
  });
}

function readChunk(fd, positionOffset) {
  let destBuffer = Buffer.alloc(BUFFER_BYTES_SYZE);

  return new Promise((resolve, reject) => {
    fs.read(fd, destBuffer, 0, BUFFER_BYTES_SYZE, positionOffset, (err) => {
      if(err) {
        reject(err);
      } else {
        resolve(destBuffer.toString('utf-8'));
      }
    });
  });
}

async function saveBookmarks(bookmarkObject) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(BOOKMARK_PATH)) {
      fs.rmSync(BOOKMARK_PATH);
    }
  
    const writeStream = fs.createWriteStream(BOOKMARK_PATH, {
      encoding: 'utf-8',
      flags: 'a' //append
    });
      
    Object.keys(bookmarkObject).forEach(async key => {
      writeStream.write(`${key}=${bookmarkObject[key]}\n`)
    });
    
    resolve(true);
  });
}

function getBookmarks() {
  return new Promise((resolve, reject) => {
    try {
      let dictionaryBookmarks = [];
  
      const rl = readline.createInterface({
        input: fs.createReadStream(BOOKMARK_PATH),
        crlfDelay: Infinity
      });
      
      rl.on('line', (currLine) => {
        if(currLine.trim()) {
          let currBookmark = currLine.split('=');
          dictionaryBookmarks[currBookmark[0]] = currBookmark[1];
        }
      });
      
      rl.on('close', () => {
        resolve(dictionaryBookmarks);
      });
    } 
    catch (err) {
      reject({
        msg: `Error at loading bookmarks...`,
        error: err
      });
    }
  });
}

function getWordsByBookmark(initialBookmark, finalBookmark) {
  return new Promise((resolve, reject) => {
    initialBookmark = Number(initialBookmark);
    finalBookmark = Number(finalBookmark);
    
      fs.open(DICTIONARY_FILE_PATH, 'r', async (err, fd) => {
        if (err) {
          throw {
            msg: `{getWordsByBookmark} Error at opening dictionary searching in: ${DICTIONARY_FILE_PATH}`,
            error: err
          } 
        }
       
        try {
          let positionOffset = initialBookmark;
          let currText = '';
    
          while ((positionOffset) < (finalBookmark + BUFFER_BYTES_SYZE)) {
            currText += await readChunk(fd, positionOffset); 
            positionOffset += BUFFER_BYTES_SYZE;
          }
          resolve(currText);
        }
        catch(err) {
          reject({
            msg: `Error at reading dictionary file`,
            error: err
          }) 
        }
      });
  });
}


module.exports = {
  createDictionaryBookmarks,
  getBookmarks,
  getWordsByBookmark
}