'use strict'
const path = require('path')
const writer = require('./Writer.js');
const reader = require('./Reader.js');

const References = function () {};

References.prototype.hydrate = async function (directory) {

    // Get subdirs  of provided directory
    const envDirs = await reader.getDirs(directory)

    envDirs.forEach(envDir => {
        const envPath = path.join(directory, envDir)
        _hydrateEnv(envPath)
    });

    return {  }
}

module.exports = exports = new References();

// Private functions

async function _hydrateEnv(dirPath) {
    await _hydrateEntries(dirPath)
}

async function _hydrateEntries(dirPath) {

    const entryRefDir = path.join(dirPath, 'refs', 'entry')
    const refFiles = await reader.getJsonFiles(entryRefDir)
    refFiles.forEach(async refFile => {
        const filePath = path.join(entryRefDir, refFile)
        await _processRefFile(filePath, dirPath)
    });

}

async function _processRefFile(refFile, rootDir) {

    const refContents = await reader.json(refFile)
    const parentEntry = await _getParentFromFilename(refFile)
    console.log('Parent: ' + parentEntry)
    if(refContents.Entry) {
       await _processEntryRefs(refContents.Entry, parentEntry, rootDir)
    }

}

async function _processEntryRefs(data, entryId, rootDir) {

    for (const [refType, entryIds] of Object.entries(data)) {
        console.log(refType)
        console.log(entryIds)
    }
    // Each object property has an array of 
}

async function _getParentFromFilename(file) {
    return path.basename(file).slice(0, -5)
}