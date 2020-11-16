'use strict'

const Contentful = function () {};

Contentful.prototype.contentType = function (data) {

    // The directory where all files for this content type will go.
    let dirRoot = path.join(rootDir, '/contentTypes/',  data.sys.id, '/')
    
    // An obj to hold the JSON that will make up the file bodies
    const output = {}

    // Get key elements
    const spaceId = data.sys.space.sys.id;

    // Store the alias so its easier to access
    const typeAlias = data.sys.id

    // Create two data sets
    // 1. "sys" for the Contentful sys data
    // 2. "flds" for the fields assigend to the content type
    output.sys = {}
    output.sys.createdAt = data.sys.createdAt
    output.sys.updatedAt = data.sys.updatedAt
    output.sys.environment = data.sys.environment.sys.id
    output.sys.publishedVersion = data.sys.publishedVersion
    output.sys.publishedAt = data.sys.publishedAt
    output.sys.firstPublishedAt = data.sys.firstPublishedAt
    output.sys.createdBy = data.sys.createdBy.sys.id
    output.sys.updatedBy = data.sys.updatedBy.sys.id
    output.sys.version = data.sys.version
    output.sys.publishedBy = data.sys.publishedBy.sys.id
    output.sys.displayField = data.displayField
    output.sys.name = data.name
    output.sys.description = data.description

    let el = {}
    let fields = {}
  
    data.fields.forEach(element => { 
        el = {}
        el.name = element.name
        el.type = element.type
        el.localized = element.localized ? element.localized : undefined
        el.required = element.required ? element.required : undefined
        el.validations = element.validations
        el.disabled = element.disabled ? element.disabled : undefined
        el.omitted = element.omitted ? element.omitted : undefined
        
        fields[element.id] =  el
    });

    Object.assign(output, {fields: fields})

    return output
}

Contentful.prototype.entry = function (data) {
    entriesCount++

    // Get key elements
    const spaceId = data.sys.space.sys.id;
    eId = data.sys.id;
    contentType = data.sys.contentType.sys.id

    const s3Root = 'cms-files/' + account + '/space/' + spaceId + '/entry/' + eId + '/'

    const pk = account + '#' + spaceId + '#' + eId

    // We create at least two files, and at least two DynamoDB items.
    // 1. A 'sys' entry with system  level info
    // 2. A 'flds' entry that maintains the field data for a given locale
    // There will be a field data row per locale if provided, as well as one additional Dynamo item.

    let entry = {}
    entry.pk = pk
    entry.sk = 'sys'
    entry.createdAt = data.sys.createdAt
    entry.updatedAt = data.sys.updatedAt
    entry.environment = data.sys.environment.sys.id
    entry.publishedVersion = data.sys.publishedVersion
    entry.publishedAt = data.sys.publishedAt
    entry.firstPublishedAt = data.sys.firstPublishedAt
    entry.createdBy = data.sys.createdBy.sys.id
    entry.updatedBy = data.sys.updatedBy.sys.id
    entry.publishedCounter = data.sys.publishedCounter
    entry.version = data.sys.version
    entry.publishedBy = data.sys.publishedBy.sys.id
    entry.contentType = contentType

    itemData = JSON.stringify(entry)
    uploadParams = {Bucket: bucket, Key: s3Root + 'sys.json', Body: itemData}
    s3Upload (uploadParams)

    let localesObject = {}
    let linkedRefs = []

    for (const [fieldName, fieldData] of Object.entries(data.fields)) {

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

        entry = {}
        entry.pk = account + '#' + spaceId + ''
        entry.sk = locale + '#flds'

        Object.assign(entry, fields)

        itemData = JSON.stringify(entry)
        uploadParams = {Bucket: bucket, Key: s3Root + locale + '/fields.json', Body: itemData}
        s3Upload (uploadParams)
    }

    //console.log(linkedRefs)
    // Create inverted index entries for references
    let ref = {}

    linkedRefs.forEach(linkedRef => {

        const [cType, linkType, linkId] = linkedRef.split('::')

        ref = {}
        ref.pk = account + '#' + spaceId + '#' + linkId
        ref.sk = 'refBy#' + linkType + '#' + cType + '#' + eId
        ref.entryId = linkId
        ref.linkedId = eId

        let s3Root = 'cms-files/' + account + '/space/' + spaceId + '/entry/' + linkId + '/refBy/' + linkType + '/' + cType + '/'

        itemData = JSON.stringify(ref)
        uploadParams = {Bucket: bucket, Key: s3Root + eId + '.json', Body: itemData}
        s3Upload (uploadParams)
    })

    // Register the entry under the contentType
    let ctS3Root = 'cms-files/' + account + '/space/' + spaceId + '/contentType/' + contentType + '/entries/'

    entry = {}
    entry.pk = account + '#' + spaceId 
    entry.sk ='ct#' + contentType + '#e#' + eId
    entry.contentType = contentType
    entry.entryId = eId
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