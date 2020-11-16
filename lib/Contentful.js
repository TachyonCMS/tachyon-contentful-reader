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

Contentful.prototype.entry = function (data) {

    // Root dir for all files for this contentType
    const root = path.join('entries', data.sys.id)

    // The sys data and filename
    //const sys = entryHelper.sys(root, data)

    console.log(data)
    console.log(root)
    console.log(sys)


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

