const path = require('path')

// The directory where all files for this content type will go.
const root = 'assets'

function sys(root, data, contentType) {

    const output = {}

    const fileName = path.join(root,  'sys.json')

    const sys = {}
    //sys.assetId = data.sys.id
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

function fields(assetId, data) {

    // Create field records
    const fieldData = _assetFields(assetId, data)
    
    let output = fieldData.output

    // Add the refs records
    Object.assign(output, _assetRefs(assetId, fieldData.linkedRefs))

    // Register under contentType

    return output
}

function _assetFields(assetId, data) {

    const output = {}

    const fileName = 'fields.json'

    let localesObject = {}
    let linkedRefs = []

    for (const [fieldName, fieldData] of Object.assets(data)) {

        for (let [locale, value] of Object.assets(fieldData)) {

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
               // console.log(assetId)
               // console.log(value)
            }
            localesObject[locale][fieldName] = value
        }
    }

    // Create localized output
    for (const [locale, fields] of Object.assets(localesObject)) {

        const fullFileName = path.join('assets', assetId, locale, fileName)
        output[fullFileName] = fields
    }

    return { output: output, linkedRefs: linkedRefs}
}

function _assetRefs(rootId, refs) {

    let ref = {}
    const output = {}
    let filePath = ''
    let fileName = ''

    const itemRefs = {}
    let itemRefKey = ''

    refs.forEach(linkedRef => {

        const [cType, linkType, linkId] = linkedRef.split('::')

        ref = {}
        ref.assetId = linkId
        ref.linkedId = rootId
        fileName = rootId + '.json'
        filePath = path.join('assets', linkId,'refBy', linkType, cType, fileName)
        output[filePath] = ref

        itemRefKey = linkType + ':' + cType

        if(! itemRefs[itemRefKey]) {
            itemRefs[itemRefKey] = []
        }

        itemRefs[itemRefKey].push(linkId)
    })

    if(Object.keys(itemRefs).length > 0) {
        fileName =  rootId  + '.json'

        filePath = path.join('refs', 'asset', fileName)
        output[filePath] = itemRefs
    }

    return output

}

function _registerContentType(fields) {

    const output = {}

}

module.exports.sys = sys
module.exports.fields = fields
