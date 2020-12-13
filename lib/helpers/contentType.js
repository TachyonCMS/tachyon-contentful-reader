const path = require('path')
const _ = require('lodash')

// The directory where all files for this content type will go.
const root = 'contentTypes'

function sys(root, data) {
   console.log(data)
   const out = {}
   const item = {}
   const fileName = path.join(root, 'sys.json')

   item.id = data.id
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
console.log(data)
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
      if(element.type == 'Link') {
         el.linkType = element.linkType ? element.linkType : undefined
      }
      fields[element.id] = el
   });

   out[fileName] = fields

   return out
}

function schema(sys, fields) {

   const [ properties, required ] = fieldsToProperties(sys.displayField, fields)

   const schema = { type: 'object'}
   schema.title = sys.title
   schema.description = sys.description
   schema.displayField = sys.displayField
   schema.properties = properties
   schema.required = required
   return schema

}

const cfMapTypes = {
   'Array': 'array',
   'Boolean': 'boolean',
   'Date': 'string',
   'Integer': 'number',
   'Link': '$ref',
   'Location': 'object',
   'Number': 'number',
   'Object': 'object',
   'RichText': 'string',
   'Symbol': 'string',
   'Text': 'string'
}

function fieldsToProperties(displayField, fields) {

   const properties = {}
   const requiredFields = []

   

   fields.forEach(field => {
      const prop = {}
      const key = field.id

      const type = cfMapTypes[field.type]
    
      switch(type) {
         case 'array':
         case 'string':
         case 'boolean':
         case 'object':
         case 'number':
            prop.description = field.description ? field.description : null
            prop.type = type
            prop.sourceType = field.type
            if(type == 'array') {
               prop.items = resolveItems(field.items)
            }
            if(type == 'object') {
               prop['anyOf'] = ['#/definitions/' +  field.name + '.json']
            }
         break

         case '$ref':
            let valid = _.find(field.validations, 'linkContentType')
            if(valid) {
               prop['$ref'] = '#/definitions/' + valid  + '.json'
            } else {
               prop['$ref'] = '#/definitions/' + field.linkType  + '.json'
            }
         break
      }
      

      if(field.required) {
         requiredFields.push(key)
      }

      // Todo Parse Validations

      properties[key] = prop
   }) 
   
   return [properties,requiredFields]
}

function resolveItems(items) {

   const out = {}
   const type = cfMapTypes[items.type]

   switch(type) {
      case 'string':
      case 'number':
         out.type = type
      break

      case '$ref':

         if(items.validations.length) {
            let validTypes = _.find(items.validations, 'linkContentType')
            let typeSchemas = []
            validTypes.linkContentType.forEach(vType => {
               let schemaLink = path.join('#', 'definitions', vType + '.json')
               typeSchemas.push(schemaLink)
            })

            out['$ref'] = {
               'anyOf': typeSchemas
            }

         } else {
            out['$ref'] = path.join('#', 'definitions', items.linkType + '.json')
         }

      break

      case 'array':
         out.type = type
         //items.items =
      break

      case 'object':

      break
   }

   return out

}

module.exports.sys = sys
module.exports.fields = fields

module.exports.schema = schema

