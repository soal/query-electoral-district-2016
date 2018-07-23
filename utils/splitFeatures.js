const fs = require('fs')
const featureEach = require('@turf/meta').featureEach

function save(feature, listDirPath) {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      listDirPath + feature.properties.wiki_name.trim() + '.geojson',
      JSON.stringify(feature),
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
          console.log('All saved!')
          resolve()
          // process.exit(0)
        })
        .catch(err => {
          if (err) {
            console.error(err)
            reject(err)
            // process.exit(1)
          }
        })
    })
  })
}

module.exports = split
