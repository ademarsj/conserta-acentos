const fs = require('fs');
const path = require('path');

const BUFFER_BYTES_SYZE = 64;

const dictionaryPath = path.resolve(__dirname, 'assets','pt-BR.dic');


function getNextRegexpObject(currLetter) {
  let newLetter = String.fromCharCode((String(currLetter).charCodeAt(0) + 1)); //122 = 'z'
  let regexpPattern = `\\n${newLetter}.*\\n`;
  return {
    letter: newLetter,
    regexp: new RegExp(regexpPattern,'gi')
  };
}


function createDictionaryBookmarks() {
  //open only in "read" mode
  fs.open(dictionaryPath, 'r', async (err, fd) => {
  
    if (err) {
      throw {
        msg: `Error at opening dictionary searching in: ${dictionaryPath}`,
        error: err
      } 
    }

    //Working with a simple array with 26 positions its better, improve later
    let positionObject = {
      'a': 0,
    };
   
    try {
      fileStatus = fs.statSync(dictionaryPath);
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

      saveBookmarks(positionObject);
    }
    catch(err) {
      throw {
        msg: `Error at reading dictionary file`,
        error: err
      } 
    }
  })
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
  })
}

function saveBookmarks(bookmarkObject) {
  const destFilePath = path.resolve(__dirname, 'assets', 'bookmarks.txt');
  
  if (fs.existsSync(destFilePath)) {
    fs.rmSync(destFilePath);
  }

  const writeStream = fs.createWriteStream(destFilePath, {
    encoding: 'utf-8',
    flags: 'a' //append
  });
    
  Object.keys(bookmarkObject).forEach(async key => {
    writeStream.write(`${key}=${bookmarkObject[key]}\n`)
  });
}

module.exports = {
  createDictionaryBookmarks,
}