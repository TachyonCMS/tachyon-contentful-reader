'use strict'
const fs = require('fs-extra')

const Reader = function () {};

// Return list of dirs
Reader.prototype.getDirs = async function (path) {

   return fs.readdir(path)
}

// Return list of JSON file
Reader.prototype.getJsonFiles = async function (path) {

    return fs.readdir(path)
}

// Return a parsed JSON file
Reader.prototype.json = async function (path) {

    const rawdata = await fs.readFile(path);
    return JSON.parse(rawdata);
 }



module.exports = exports = new Reader();