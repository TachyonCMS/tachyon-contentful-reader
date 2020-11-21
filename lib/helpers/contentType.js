const path = require('path')

// The directory where all files for this content type will go.
const root = 'contentTypes'

function sys(root, data) {

   const out = {}
   const item = {}
   const fileName = path.join(root, 'sys.json')

   item.createdAt = data.sys.createdAt
   item.updatedAt = data.sys.updatedAt
   item.environment = data.sys.environment.sys.id
   item.publishedVersion = data.sys.publishedVersion
   item.publishedAt = data.sys.publishedAt
   item.firstPublishedAt = data.sys.firstPublishedAt
   item.createdBy = data.sys.createdBy.sys.id
   item.updatedBy = data.sys.updatedBy.sys.id
   item.version = data.sys.version
   item.publishedBy = data.sys.publishedBy.sys.id
   item.displayField = data.displayField
   item.name = data.name
   item.description = data.description

   out[fileName] = item

   return out
}

function fields(root, data) {

   const out = {}
   const fileName = path.join(root, 'fields.json')
 
   const fields = {}

   data.forEach(element => {
      el = {}
      el.name = element.name
      el.type = element.type
      el.localized = element.localized ? element.localized : undefined
      el.required = element.required ? element.required : undefined
      el.validations = element.validations
      el.disabled = element.disabled ? element.disabled : undefined
      el.omitted = element.omitted ? element.omitted : undefined
      fields[element.id] = el
   });

   out[fileName] = fields

   return out
}

module.exports.sys = sys
module.exports.fields = fields
