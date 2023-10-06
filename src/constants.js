
const path = require('path');
const BreakLine = require('./breakLineSingleton');

const REGEXP_HAVE_ACCENTUATION = /[áàâãéèêíïóôõöúçñ]/gi;

const NON_ALPHABETICAL_CHARS = [
  '\r','\r\n','\n', ' ', '.', '\\', 
  '//', '{', '-', '\'', '\"', '(', ')', 
  ':', ',', '!', '/'
];

const ROTTEN_CHAR = '�';

const DICTIONARY_FILE_PATH = path.resolve(__dirname, 'assets','pt-BR.dic');
const BOOKMARK_FILE_PATH = path.resolve(__dirname, 'assets', 'bookmarks.txt');
const ROTTEN_FILE_PATH = path.resolve(__dirname, 'assets/', 'rotten_file.txt');
const OUTPUT_PATH = path.resolve(__dirname, '..', 'output/', 'fixed_file.txt');

let breakLineSingleton = new BreakLine(DICTIONARY_FILE_PATH, ROTTEN_FILE_PATH);

module.exports = {
  REGEXP_HAVE_ACCENTUATION,
  NON_ALPHABETICAL_CHARS,
  ROTTEN_CHAR,
  DICTIONARY_FILE_PATH,
  BOOKMARK_FILE_PATH,
  ROTTEN_FILE_PATH,
  OUTPUT_PATH,
  breakLineSingleton
}
