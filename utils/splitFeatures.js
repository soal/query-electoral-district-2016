const fs = require('fs')
const featureEach = require('@turf/meta').featureEach

const filePath = __dirname + '/../data/districts_full_converted.geojson'
const listDirPath = __dirname + '/../data/list/'

function save(feature) {
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

fs.readFile(filePath, (err, data) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  const parsed = JSON.parse(data)

  const funcs = []
  featureEach(parsed, async (feature, index) => {
    funcs.push(save(feature))
  })
  Promise.all(funcs)
    .then(res => {
      console.log('All saved!')
      process.exit(0)
    })
    .catch(err => {
      if (err) {
        console.error('ERORR!')
        process.exit(1)
      }
    })
})
