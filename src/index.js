const { createDictionaryBookmarks } = require('./dictionaryBookmarks');
const { getMisspelledWords, locateAndReplaceMisspelledWords } = require('./handleRottenFile');
const { checkGrammar } = require('./dictionary');

async function doIt() {
  await createDictionaryBookmarks();
  let misspeledWords = await getMisspelledWords();
  const wordsWithSuggestions = await checkGrammar(misspeledWords);

  locateAndReplaceMisspelledWords(wordsWithSuggestions);
}

doIt();
