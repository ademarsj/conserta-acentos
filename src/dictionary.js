const { ROTTEN_CHAR, breakLineSingleton, REGEXP_HAVE_ACCENTUATION } = require('./constants');
const { getBookmarks, getWordsByBookmark } = require('./dictionaryBookmarks');

async function getSuggestions(word, wordsToSearch) {
  try {
    let regexpForWord = createRegexpByWord(word);

    let suggestions = [];
    wordsToSearch.split(breakLineSingleton.dic_break_line).forEach(item => {
      if(item.match(regexpForWord)) {
        suggestions.push(item);
      }
    });

    return suggestions;
  }
  catch(err) {
    throw {
      msg: 'Error at {getSuggestions}',
      error: err
    };
  }
}

function createRegexpByWord(word) {
  let regexpPattern = String(word);

  while(regexpPattern.indexOf(ROTTEN_CHAR) != -1) {
    regexpPattern = regexpPattern.replace(ROTTEN_CHAR, '.{1}');
  }

  regexpPattern = `^${regexpPattern}$`;
  return (new RegExp(regexpPattern, 'gi'));
}

function filterSuggestions(suggestions) {
  suggestionsFiltered = suggestions.filter(item => item.match(REGEXP_HAVE_ACCENTUATION)); 
  return suggestionsFiltered;
}

async function checkGrammar(rottenWords) {
  let currBookmark = '';
  let bookmarkStart = '';
  let bookmarkEnd = 'z';
  let wordsToSearch = '';
  let searchedWord = '';
  let bookmarks = await getBookmarks();
  let suggestions = [];
  let filteredSuggestions = [];

  let arrayWithSuggestions = [];
  rottenWords.sort();

  for (currWord of rottenWords) {
    searchedWord = String(currWord).toLowerCase();
    bookmarkStart = bookmarks[searchedWord[0]];

    
    if(bookmarkStart != currBookmark) {
      currBookmark = bookmarkStart;
      bookmarkEnd = bookmarks[String.fromCharCode((String(searchedWord).charCodeAt(0)+1))]; 
      wordsToSearch = await getWordsByBookmark(bookmarkStart, bookmarkEnd);
    }
  
    suggestions = await getSuggestions(searchedWord, wordsToSearch);
    filteredSuggestions = filterSuggestions(suggestions);
  
    let obj = {
      word: currWord,
      suggestions: filteredSuggestions,
      uncertain: filteredSuggestions.length > 1 
    };
    arrayWithSuggestions.push(obj);
  }

  return arrayWithSuggestions;
}

module.exports = {
  checkGrammar,
}