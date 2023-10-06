const fs = require('fs');
const { readChunk } = require('./utils');
let instance;

class BreakLine {
  constructor(dic_path, rotten_file_path) {
    if (instance) {
      throw new Error('Trying to instance a Singleton again!');
    }

    this.dic_path = dic_path;
    this.rotten_file_path = rotten_file_path;

    this.rot_break_line = null;
    this.rot_break_line_string = null;
    this.dic_break_line = null;
    this.dic_break_line_string = null;
    instance = this;
  }

  async identifyBreakLineOnFiles() {
    let t1 = await this.identifyBreaklineChar(this.dic_path);
    this.dic_break_line = t1.breakLineChar;
    this.dic_break_line_string = t1.breakLineString;

    let t2 = await this.identifyBreaklineChar(this.rotten_file_path);
    this.rot_break_line = t2.breakLineChar;
    this.rot_break_line_string= t2.breakLineString;

  }

  identifyBreaklineChar(file_path) {
    return new Promise(async (resolve,reject) => {

      let breakLineChar, breakLineString, breakLineType;

      fs.open(file_path, 'r', async (err, fd) => {
        if (err) {
          throw {
            msg: `{identifyBreaklineChar} Error at opening: ${file_path}`,
            error: err
          }
        }
       
        try {
            let currText = '';
            currText += await readChunk(fd, 0);

            if (currText.indexOf('\r\n') > 0)  {
              breakLineChar = '\r\n';
              breakLineString = '\\r\\n';
              breakLineType = 'CRLF';
            } else if (currText.indexOf('\r') > 0) {
              breakLineChar = '\r';
              breakLineString = '\\r';
              breakLineType = 'CR';
            } else {
              breakLineChar = '\n';
              breakLineString = '\\n';
              breakLineType = 'LF';
            }

            console.log(`Breakline type "${breakLineType}" found in ${file_path}`)
    
          resolve({
            breakLineChar,
            breakLineString
          });
        }
        catch(err) {
          reject(err);
        }
      });
      
    });
  }
}

module.exports = BreakLine;