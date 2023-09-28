const { createDictionaryBreakpoints } = require('./dictionary');
const { getMisspelledWords } = require('./readfile');

// createDictionaryBreakpoints();


async function doIt() {
 const rottenWords = await getMisspelledWords();
 console.log(rottenWords);
}

doIt();