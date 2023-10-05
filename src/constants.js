const os = require('os');

let BREAK_LINE_CHAR = '\n';

if (os.platform() == 'win32') {
  BREAK_LINE_CHAR = '\r\n';
} else if (os.platform() == 'darwin') {
  BREAK_LINE_CHAR = '\r';
}

module.exports = {
  BREAK_LINE_CHAR
}