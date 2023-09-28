const { createDictionaryBookmarks } = require('./dictionaryBookmarks');
const { getMisspelledWords } = require('./readfile');

// createDictionaryBookmarks();


async function doIt() {
 const rottenWords = await getMisspelledWords();
 console.log(rottenWords);
}

doIt();