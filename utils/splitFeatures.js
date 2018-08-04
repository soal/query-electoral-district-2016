const fs = require('fs')
const featureEach = require('@turf/meta').featureEach

function save(feature, listDirPath) {
  return new Promise((resolve, reject) => {
    const stringified = JSON.stringify(feature).replace(/180.00000000000003/g, '180')
    fs.writeFile(
      listDirPath + feature.properties.wiki_name.trim() + '.geojson',
      stringified,
      err => {
        if (err) {
          reject(err)
          console.error(err)
        }
        resolve()
      })
  })
}

function split(filePath, listDirPath) {
  console.log('Splitting features in separate files...')
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error(err)
        process.exit(1)
      }
      const parsed = JSON.parse(data)

      const funcs = []
      featureEach(parsed, async (feature, index) => {
        funcs.push(save(feature, listDirPath))
      })
      return Promise.all(funcs)
        .then(res => {
          console.log('Features splitted.')
          resolve()
        })
        .catch(err => {
          if (err) {
            console.error(err)
            reject(err)
          }
        })
    })
  })
}

module.exports = split
