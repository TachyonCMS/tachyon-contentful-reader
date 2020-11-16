// Require the core node modules.
const fs = require( 'fs' );
const Streamer = require('index.js')

const argv = yargs
    .option('file', {
        alias: 'f',
        description: 'The file to import',
        type: 'string',
    })
    .help()
    .alias('help', 'h')
    .argv

var source = fs.createReadStream(argv.file);

Streamer.contentful(source)
