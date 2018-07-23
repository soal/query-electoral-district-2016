const fs = require('fs')
const createDb = require('../db')
const createModel = require('../model')

const filesDir = __dirname + '/../data/list/'

function save(filePath, District) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      const feature = JSON.parse(data)
      const district = new District(feature)
      district.save(err => {
        if (err) {
          console.error('################ ERROR ####################')
          console.error(`FeatureId: ${feature.properties.okrug}, Name: ${feature.properties.wiki_name}`)
          console.error('###########################################')
          console.error(err)
          reject(err)
        }
        return resolve()
      })
    })
  })
}

async function populate(filesDir) {
  const db = await createDb()
  const District = await createModel()

  const fileList = fs.readdirSync(filesDir)

  const funcs = []
  fileList.forEach(file => {
    funcs.push(save(filesDir + file, District))
  })
  return Promise.all(funcs)
    .then(res => {
      console.log('All saved!')
      db.close()
      process.exit(0)
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
