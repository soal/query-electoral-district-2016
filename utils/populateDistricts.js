const fs = require('fs')
const createDb = require('../db')
const createModel = require('../model')

function save(filePath, District) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      const feature = JSON.parse(data)
      console.log(`Saving ${feature.properties.wiki_name}...`)
      const district = new District(feature)
      district.save(err => {
        if (err) {
          console.error('################ ERROR ####################')
          console.error(`FeatureId: ${feature.properties.okrug}, Name: ${feature.properties.wiki_name}`)
          console.error('###########################################')
          console.error(err)
          reject(err)
        }
        resolve()
      })
    })
  })
}

async function populate(filesDir) {
  console.log('Populating database...')
  const db = await createDb()
  const District = await createModel()

  const fileList = fs.readdirSync(filesDir)

  const funcs = []
  fileList.forEach(file => {
    funcs.push(save(filesDir + file, District))
  })
  return Promise.all(funcs)
    .then(res => {
      console.log('Database populated')
      db.close()
      return res
    })
    .catch(err => {
      if (err) {
        console.error('ERORR!')
        db.close()
        process.exit(1)
      }
    })
}

module.exports = populate
