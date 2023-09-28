const NON_ALPHABETICAL_CHARS = ['\n', ' ', '.', '\\', '//', '{', '-', '\'', '\"', '(', ')', ':', ',', '!', '/'];

const ROTTEN_CHAR = '�';

function getLastDelimiterIndex(line) {
  let lastIndexFound = -1;
  //Dont use trim, because it can give wrong results later

  for(currChar of NON_ALPHABETICAL_CHARS) {
    currIndex = String(line).lastIndexOf(currChar);
    if (currIndex >= 0) {
      // console.log(`LAST Achou "${currChar}" em ${currIndex}`);
    }
    if(currIndex >= 0 && currIndex > lastIndexFound) {
      lastIndexFound = currIndex;
    }
  }

  return lastIndexFound != -1 ? lastIndexFound : 0;
}

function getFirstDelimiterIndex(line) {
  let firstIndexFound = 999;
  line = line.trim();
  // console.log(`line == ${line}`);
  
  for(currChar of NON_ALPHABETICAL_CHARS) {
    currIndex = String(line).indexOf(currChar)
    if (currIndex >= 0) {
      // console.log(`Achou "${currChar}" em ${currIndex}`);
    }
    if(currIndex >= 0 && currIndex < firstIndexFound) {
      firstIndexFound = currIndex;
    }
  }
  return firstIndexFound != 999 ? firstIndexFound : 0;
}

function removeNonAlphabeticalChar(word) {
  for(currChar of NON_ALPHABETICAL_CHARS) {
    word = word.replaceAll(currChar, '');
  }

  return word;
}

function findMisspelledWordIfExists(currString, arrayMisspeledWords) {
  currString = currString.trim();
  let rottenCharIndex = String(currString).indexOf(ROTTEN_CHAR);

  while(rottenCharIndex > -1) {
    leftStringIndex = rottenCharIndex - 15; 

    if (leftStringIndex < 0) {
      leftStringIndex = 0;
    }

    // line: " sem precis�o alguma"

    // " sem precis"
    let leftStringOfRottenChar = currString.slice(leftStringIndex, rottenCharIndex); 
    // index of the white space before "prec..."
    let leftDelimiterIndex = getLastDelimiterIndex(leftStringOfRottenChar) + leftStringIndex;

    // "precis�o alguma"
    let wordToRight = currString.slice(leftDelimiterIndex+1, rottenCharIndex+15);
    // index of the white space after the end of the word "precis�o"    
    let rightDelimiterIndex = getFirstDelimiterIndex(wordToRight) + leftDelimiterIndex;
    
    // "precis�o"
    let misspelledWord = currString.slice(leftDelimiterIndex + 1, rightDelimiterIndex+1).trim();    
    misspelledWord = removeNonAlphabeticalChar(misspelledWord);

    if(misspelledWord) {
      // Yes, i could use Set
      if(misspelledWord.includes(ROTTEN_CHAR) && !arrayMisspeledWords.includes(misspelledWord)) {
        arrayMisspeledWords.push(misspelledWord);
      }
    }

    currString = String(currString).replace(ROTTEN_CHAR, 'REPLACED');
    rottenCharIndex = String(currString).indexOf(ROTTEN_CHAR);
  }
}


module.exports = {
  findMisspelledWordIfExists,
}