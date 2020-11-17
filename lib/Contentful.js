'use strict'
const path = require('path')

const typeHelper = require('./helpers/contentType.js')
const entryHelper = require('./helpers/entry.js')

const Contentful = function () {};

Contentful.prototype.contentType = function (data) {

    // Root dir for all files for this contentType
    const root = path.join('contentTypes', data.sys.id)

    // The sys data and filename
    const out = typeHelper.sys(root, data)

    // The fields data and filename
    const fields = typeHelper.fields(root, data.fields)

    Object.assign(out, fields)

    return out
}

Contentful.prototype.entry = async function (data) {

    if(data.sys && data.sys.id && data.sys.contentType && data.sys.contentType.sys && data.sys.contentType.sys.id) {
        const entryId = data.sys.id

        const contentType = data.sys.contentType.sys.id

        // Root dir for all files for this contentType
        const root = path.join('entries', entryId)

        // The sys data and filename
        const out = entryHelper.sys(root, data, contentType)

        // The fields data and filename
        const fields = entryHelper.fields(entryId, data.fields)

        Object.assign(out, fields)

        return out

    } else {
        return {}
    }

    
}

Contentful.prototype.tag = function (tag) {
    console.log(tag)
}

Contentful.prototype.asset = function (asset) {
    console.log(asset)
}

Contentful.prototype.locale = function (locale) {
    console.log(locale)
}

module.exports = exports = new Contentful();

