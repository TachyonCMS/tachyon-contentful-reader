const path = require('path')

// The directory where all files for this content type will go.
const root = 'entries'

function sys(root, data, contentType) {

    const output = {}

    const fileName = path.join(root,  'sys.json')

    const sys = {}
    //sys.entryId = data.sys.id
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

function fields(entryId, env, data) {

    // Create field records
    const fieldData = _entryFields(entryId, env, data)
    
    let output = fieldData.output

    // Add the refs records
    Object.assign(output, _entryRefs(entryId, env, fieldData.linkedRefs))

    // Register under contentType

    return output
}

function _entryFields(entryId, env, data) {

    const output = {}

    const fileName = 'fields.json'

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
                        indexVal = fieldName + '::' + val
                        linkedRefs.push(indexVal)
                    } 
                })
                value = vals
            } else if(value && typeof value == 'object')
            {
                if(value.sys) {
                    value = value.sys.linkType + '::' + value.sys.id
                    indexVal = fieldName + '::' + value
                        linkedRefs.push(indexVal)
                } 
            }
            else {
               // console.log(entryId)
               // console.log(value)
            }
            localesObject[locale][fieldName] = value
        }
    }

    // Create localized output
    for (const [locale, fields] of Object.entries(localesObject)) {

        const fullFileName = path.join(env, 'entries', entryId, locale, fileName)
        output[fullFileName] = fields
    }

    return { output: output, linkedRefs: linkedRefs}
}

function _entryRefs(rootId, env, refs) {

    let ref = {}
    const output = {}
    let filePath = ''
    let fileName = ''

    const itemRefs = {}
    let itemRefKey = ''

    refs.forEach(linkedRef => {

        const [cType, linkType, linkId] = linkedRef.split('::')

        ref = {}
        ref.entryId = linkId
        ref.linkedId = rootId
        fileName = rootId + '.json'
        filePath = path.join(env, 'entries', linkId,'refBy', linkType, cType, fileName)
        output[filePath] = ref

        itemRefKey = linkType + ':' + cType

        if(! itemRefs[linkType]) {
            itemRefs[linkType] = {}
        }

        if(! itemRefs[linkType][cType]) {
            itemRefs[linkType][cType] = []
        }

        itemRefs[linkType][cType].push(linkId)
    })

    if(Object.keys(itemRefs).length > 0) {
        fileName =  rootId  + '.json'

        filePath = path.join(env, 'refs', 'entry', fileName)
        output[filePath] = itemRefs
    }

    return output

}

function _registerContentType(fields) {

    const output = {}

}

module.exports.sys = sys
module.exports.fields = fields
