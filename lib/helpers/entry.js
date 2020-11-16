const path = require('path')

// The directory where all files for this content type will go.
const root = 'entries'

function sys(root, data, contentType) {

    const fileName = path.join(root,  'sys.json')
    const output = {}

    const sys = {}
    sys.createdAt = data.sys.createdAt
    sys.updatedAt = data.sys.updatedAt
    sys.environment = data.sys.environment.sys.id
    sys.publishedVersion = data.sys.publishedVersion
    sys.publishedAt = data.sys.publishedAt
    sys.firstPublishedAt = data.sys.firstPublishedAt
    sys.createdBy = data.sys.createdBy.sys.id
    sys.updatedBy = data.sys.updatedBy.sys.id
    sys.publishedCounter = data.sys.publishedCounter
    sys.version = data.sys.version
    sys.publishedBy = data.sys.publishedBy.sys.id
    sys.contentType = contentType

    output[fileName] = sys

    return output
}

function fields(root, data) {

    const fileName = 'fields.json'
    const output = {}

    let localesObject = {}
    let linkedRefs = []

    for (const [fieldName, fieldData] of Object.entries(data)) {

        for (let [locale, value] of Object.entries(fieldData)) {

            if(! localesObject[locale]) {
                localesObject[locale] = {}
            }

            if(Array.isArray(value)) {
                let vals = []
                value.forEach(linked => {
                    let val = ''
                    if(linked.sys) {
                        val = linked.sys.linkType + '::' + linked.sys.id
                        vals.push(val)
                        invertedVal = fieldName + '::' + val
                        linkedRefs.push(invertedVal)
                    } 
                })
                value = vals
            } else if(typeof value == 'object')
            {
                if(value.sys) {
                    value = value.sys.linkType + '::' + value.sys.id
                    invertedVal = fieldName + '::' + value
                        linkedRefs.push(invertedVal)
                } 
            }
            localesObject[locale][fieldName] = value
        }
    }

    for (const [locale, fields] of Object.entries(localesObject)) {

        const fullFileName = path.join(root, locale, fileName)
        output[fullFileName] = fields
    }

    return output
}

module.exports.sys = sys
module.exports.fields = fields