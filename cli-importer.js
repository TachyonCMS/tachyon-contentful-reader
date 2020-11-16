// Require the core node modules.
const fs = require( 'fs' )
const yargs = require('yargs')
const Streamer = require('./index.js')

const argv = yargs
    .option('account', {
        alias: 'a',
        description: 'The owner account id',
        type: 'string',
        required: true,
        default: 'default'
    })
    .option('file', {
        alias: 'f',
        description: 'The file to import',
        type: 'string',
        required: true
    })
    .option('output', {
        alias: 'o',
        description: 'The directory to output the files.',
        type: 'string',
        required: true,
        default: 'console'
    })
    .help()
    .alias('help', 'h')
    .argv

var source = fs.createReadStream(argv.file)

Streamer.contentful(source, argv.output)
