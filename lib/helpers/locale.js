const path = require('path')

// The directory where all files for this content type will go.
const root = 'entries'

function sys(root, data) {

    const output = {}

    const fileName = path.join(root,  'sys.json')

    const sys = {}
    sys.id = data.id
    sys.createdAt = data.createdAt
    sys.updatedAt = data.updatedAt
    sys.environment = data.environment.sys.id
    sys.createdBy = data.createdBy.sys.id
    sys.updatedBy = data.updatedBy.sys.id
    sys.version = data.version

    output[fileName] = sys

    return output
}

function fields(root, code, data) {

    const output = {}

    const fileName = path.join(root, code, 'fields.json')

    output[fileName] = data

    if(data.default === true) {
        const defaultLangFileName = path.join(root, 'default.json')

        output[defaultLangFileName] = { code: data.code }
    }

    if(data.fallbackCode) {
        const fallbackLangFileName = path.join(root, code, 'fallback.json')

        output[fallbackLangFileName] = { code: data.fallbackCode }
    }

    if(data.optional === false) {

        const fileName = code + '.json'
        const requiredLangFileName = path.join(root, 'required', fileName)

        output[requiredLangFileName] = { code: data.code }
    }

    return output
}

module.exports.sys = sys
module.exports.fields = fields
