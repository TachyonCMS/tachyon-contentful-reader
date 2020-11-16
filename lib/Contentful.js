'use strict'
const path = require('path')

const typeHelper = require('./helpers/contentType.js')
const entryHelper = require('./helpers/entry.js')

const Contentful = function () {};

Contentful.prototype.contentType = function (data) {

    // Root dir for all files for this contentType
    const root = path.join('contentTypes', data.sys.id)

    // The sys data and filename
    const sys = typeHelper.sys(root, data)

    // The fields data and filename
    const fields = typeHelper.fields(root, data.fields)

    Object.assign(sys, fields)

    return sys
}

Contentful.prototype.entry = function (data) {

    // The directory where all files for this content type will go.
    let root = path.join('entries',  data.sys.id)

    // Store the alias so its easier to access
    const eId = data.sys.id;
    // This entry's contentType
    const contentType = data.sys.contentType.sys.id

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

