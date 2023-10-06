const fs = require('fs');
const BUFFER_BYTES_SYZE = 64;

async function readChunk(fd, positionOffset) {
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

module.exports = {
  readChunk
}