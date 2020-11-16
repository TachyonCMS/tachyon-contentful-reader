'use strict'

const path = require('path')
const oboe = require('oboe')

var typesCount = 0;
var tagsCount = 0;
var assetsCount = 0;
var localesCount = 0;
var entriesCount = 0;

const cf = require('./Contentful.js')
const writer = require('./Writer.js');

var Streamer = function () {};

let outputs = {}

Streamer.prototype.contentful = function (filehandle, outputDir='cms-files', spaceId='space', account='') {
    
    let rootDir = path.join(outputDir)
    let typeDir = ''
    let fileName = ''

    oboe(filehandle)
    .node('editorInterfaces', oboe.drop)
    .node('roles', oboe.drop)
    .node('webhooks', oboe.drop)
    .node('contentTypes.*', function(data){
        return oboe.drop;
        outputs = cf.contentType(data)
        // Write the sys and fields output elements to separate JSON files in the `contentTypes` subdirectory.
        // Both files go in a subdirectory named after the contentType.
        if(outputDir !== 'console') {
            

            for (const [fullPath, fileData] of Object.entries(outputs)) {
                writer.local(fullPath, fileData)
            }
        } else {
            // Allow output to console for dry-run and debugging.
            console.log(outputs)
        }
        typesCount++
        return oboe.drop;
    })
    .node('tags.*', function(data){
        //cf.tag(data)
        tagsCount++
        return oboe.drop;
    })
    .node('assets.*', function(data){
        //cf.asset(data)
        assetsCount++
        return oboe.drop;
    })
    .node('locales.*', function(data){
        //cf.locale(data)
        localesCount++
        return oboe.drop;
    })
    .node('entries.*', function(data){
        /*outputs = cf.entry(data)
        // Write the sys and fields output elements to separate JSON files in the `contentType` subdirectory.
        // Both files go in a subdirectory named after the contentType.
        if(outputDir !== 'console') {
            // The directory where all files for this content type will go.
            dir = path.join(rootDir, '/entries/',  data.sys.id, '/')

            for (const [fileName, fileData] of Object.entries(outputs)) {
                let fullPath = dir + fileName + '.json'
                writer.local(fullPath, fileData)
            }
        } else {
            // Allow output to console for dry-run and debugging.
            console.log(outputs)
        }
        */
        entriesCount++
        return oboe.drop;
    }).done(function( finalJson ){

        // all the nodes have been dropped
        console.log( finalJson );  
        console.log(entriesCount)
     })
}

module.exports = exports = new Streamer();
