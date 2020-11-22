'use strict'
const fs = require('fs-extra')

const Writer = function () {};

Writer.prototype.local = async function (path, data) {
   // console.log({path: path, data: data})

   if(typeof data != 'String') {
       data = JSON.stringify(data, undefined, 2)
   }

   //return

   fs.outputFile(path, data)
   .then(() => {
       console.log('The file ' + path + ' was saved!');
   })
   .catch(err => {
       console.error(err)
   });
}

Writer.prototype.s3 = function (item, path, bucket) {
    console.log({item: item, path: path, bucket: bucket})
}

module.exports = exports = new Writer();