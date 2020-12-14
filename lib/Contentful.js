'use strict'
const path = require('path')

const typeHelper = require('./helpers/contentType.js')
const entryHelper = require('./helpers/entry.js')
const assetHelper = require('./helpers/asset.js')
const localeHelper = require('./helpers/locale.js')
const reader = require('./Reader.js')

const Contentful = function () {};

Contentful.prototype.contentType = async function (data) {

    // Root dir for all files for this contentType
    const root = path.join(data.sys.environment.sys.id, 'contentTypes', data.sys.id)

    // The sys data and filename
    const out = typeHelper.sys(root, data)

    // The fields data and filename
    const fields = typeHelper.fields(root, data.fields)

    const schemaSys = { type: 'object'}
    schemaSys.title = data.name
    schemaSys.description = data.description
    schemaSys.displayField = data.displayField

    // While were here we'll create a JSON schema object
    // for the contentType using part of the sys data and the fields.
    const schema  = typeHelper.schema(schemaSys, data.fields)

    return { out: Object.assign(out, fields), schema: schema }
}

Contentful.prototype.entry = async function (data, localized) {

    if(data.sys && data.sys.id && data.sys.contentType && data.sys.contentType.sys && data.sys.contentType.sys.id) {
        const entryId = data.sys.id

        const contentType = data.sys.contentType.sys.id

        const env = data.sys.environment.sys.id

        // Root dir for all files for this contentType
        const root = path.join(env, 'entries', entryId)

        // The sys data and filename
        const out = entryHelper.sys(root, data, contentType)

        // The fields data and filename
        const fields = entryHelper.fields(entryId, env, data.fields, localized)

        Object.assign(out, fields)

        return out

    } else {
        return {}
    }
}

Contentful.prototype.tag = function (tag) {
    //console.log(tag)
}

Contentful.prototype.asset =  async function (data) {
    if(data) {
        const entryId = data.sys.id

        const contentType = data.sys.contentType.sys.id

        // Root dir for all files for this contentType
        const root = path.join('assets', entryId)

        // The sys data and filename
        const out = assetHelper.sys(root, data, contentType)

        // The fields data and filename
        const fields = assetHelper.fields(entryId, data.fields)

        Object.assign(out, fields)

        return out

    } else {
        return {}
    }
}

Contentful.prototype.locale = async function (data) {
    if(data) {
        const localeId = data.sys.id

        const code = data.code

        const env = data.sys.environment.sys.id

        const root = path.join(env, 'locales')

        const sysRoot = path.join(root, code)

        const out = localeHelper.sys(sysRoot, data.sys)

        delete data.sys

        // The fields data and filename
        const fields = localeHelper.fields(root, code, data)

        Object.assign(out, fields)

        return out

    } else {
        return {}
    }

}

Contentful.prototype.localesList = async function (data) {
    if(data) {

        const out = {}

        const fileName = 'available.json'

        for (let [env, locales] of Object.entries(data)) {

            const filePath = path.join(env, 'locales', fileName)

            out[filePath] = { codes: locales }

        }

        return out

    } else {
        return {}
    }

}

Contentful.prototype.reqLocalesList = async function (data) {
    if(data) {

        const out = {}

        const fileName = 'required.json'

        for (let [env, locales] of Object.entries(data)) {

            const filePath = path.join(env, 'locales', fileName)

            out[filePath] = { codes: locales }

        }

        return out

    } else {
        return {}
    }

}

module.exports = exports = new Contentful();

