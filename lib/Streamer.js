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
const reader = require('./Reader.js');
const refProcessor = require('./References.js');

const Streamer = function () {};

const outputs = {}

const locales = {}
const reqLocales = {}

let writePath = ''
Streamer.prototype.contentful = function (filehandle, outputDir='cms-files', spaceId='space', account='', schemaDir=false) {

    let rootDir = path.join(outputDir)

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
                //console.dir(schema, { depth: null })
                let fileName = data.sys.id + '.json'
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
                //console.log(outputs)
                return oboe.drop;
            }
         })
    })
    .node('tags.*', function(data){
        cf.tag(data)
        tagsCount++
        return oboe.drop;
    })
    .node('assets.*', async function(data){
        cf.asset(data)
        .then(outputs => async function () {
            // Write the sys and fields output elements to separate JSON files in the `entries` subdirectory.
            // Both files go in a subdirectory named after the contentType.
            if(outputDir !== 'console') {
                for (const [cmsPath, fileData] of Object.entries(outputs)) {
                    writePath = path.join(rootDir, cmsPath)
                    writer.local(writePath, fileData)
                    .then(writeResult => {
                        assetsCount++
                        return oboe.drop;
                    })
                }
            } else {
                // Allow output to console for dry-run and debugging.
            }
        }
        )
        return oboe.drop;
    })
    .node('locales.*', function(data){

        const env = data.sys.environment.sys.id
        const code = data.code

        if(! locales.hasOwnProperty(env)) {
            locales[env] = []
        }
        locales[env].push(code)

        if(data.optional === false) {
            if(! reqLocales.hasOwnProperty(env)) {
                reqLocales[env] = []
            }
            reqLocales[env].push(code)
        }

        cf.locale(data)
        .then(outputs => {
            // Write the sys and fields output elements to separate JSON files in the `entries` subdirectory.
            // Both files go in a subdirectory named after the contentType.
            if(outputDir !== 'console') {
                for (const [cmsPath, fileData] of Object.entries(outputs)) {
                    writePath = path.join(rootDir, cmsPath)
                    writer.local(writePath, fileData)
                    .then(writeResult => {
                        localesCount++
                        return oboe.drop;
                    })
                }
            } else {
                // Allow output to console for dry-run and debugging.
            }
        }
    )
        localesCount++
        return oboe.drop;
    })
    .node('entries.*', function(data){
       const localizeDefFile = path.join(rootDir, data.sys.environment.sys.id, 'contentTypes', data.sys.contentType.sys.id, 'sys-localized.json')
       reader.json(localizeDefFile)
       .then(localized => {
           // return oboe.drop
            cf.entry(data, localized)
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
                    }
                }
            )
       })

    }).done(function( finalJson ){
        // all the nodes have been dropped

        // Write locale files
        cf.localesList(locales)
        .then(outputs => {
            // Write the sys and fields output elements to separate JSON files in the `entries` subdirectory.
            // Both files go in a subdirectory named after the contentType.
            if(outputDir !== 'console') {
                for (const [cmsPath, fileData] of Object.entries(outputs)) {
                    writePath = path.join(rootDir, cmsPath)
                    writer.local(writePath, fileData)
                }
            } else {
                // Allow output to console for dry-run and debugging.
            }
        })

        cf.reqLocalesList(reqLocales)
        .then(outputs => {
            // Write the sys and fields output elements to separate JSON files in the `entries` subdirectory.
            // Both files go in a subdirectory named after the contentType.
            if(outputDir !== 'console') {
                for (const [cmsPath, fileData] of Object.entries(outputs)) {
                    writePath = path.join(rootDir, cmsPath)
                    writer.local(writePath, fileData)
                }
            } else {
                // Allow output to console for dry-run and debugging.
            }
        })

        // Process each enviro in the output directory
        refProcessor.hydrate(rootDir)

     })
}

module.exports = exports = new Streamer();
