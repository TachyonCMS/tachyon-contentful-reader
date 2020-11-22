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

let writePath = ''
Streamer.prototype.contentful = function (filehandle, outputDir='cms-files', spaceId='space', account='', schemaDir=false) {

    let rootDir = path.join(outputDir)
console.log(outputDir)
    oboe(filehandle)
    .node('editorInterfaces', oboe.drop)
    .node('roles', oboe.drop)
    .node('webhooks', oboe.drop)
    .node('contentTypes.*', function(data){
        cf.contentType(data)
         .then(results => {
            const outputs = results['out']
            const schema = results['schema']
            if(schemaDir) {
                console.dir(schema, { depth: null })
                let fileName = data.name + '.json'
                writePath = path.join(schemaDir, fileName)
                    writer.local(writePath, schema)
            }
            // Write the sys and fields output elements to separate JSON files in the `contentTypes` subdirectory.
            // Both files go in a subdirectory named after the contentType.
            if(outputDir !== 'console') {
                for (const [cmsPath, fileData] of Object.entries(outputs)) {
                    writePath = path.join(rootDir, cmsPath)
                    writer.local(writePath, fileData)
                    .then(writeResult => {
                        typesCount++
                        return oboe.drop;
                    })
                }
            } else {
                // Allow output to console for dry-run and debugging.
                console.log(outputs)
                return oboe.drop;
            }
            
         })
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
        // return oboe.drop
        cf.entry(data)
        .then(outputs => {
            // Write the sys and fields output elements to separate JSON files in the `entries` subdirectory.
            // Both files go in a subdirectory named after the contentType.
            if(outputDir !== 'console') {
                for (const [cmsPath, fileData] of Object.entries(outputs)) {
                    writePath = path.join(rootDir, cmsPath)
                    writer.local(writePath, fileData)
                    .then(writeResult => {
                        entriesCount++
                        return oboe.drop;
                    })
                }
            } else {
                // Allow output to console for dry-run and debugging.
                console.log(outputs)
            }
        }
        )
        
    }).done(function( finalJson ){
        // all the nodes have been dropped
        //console.log( finalJson );  
        //console.log(entriesCount)
     })
}

module.exports = exports = new Streamer();
