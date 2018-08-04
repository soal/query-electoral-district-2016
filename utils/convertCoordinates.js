const toWgs84 = require('@turf/projection').toWgs84
const fs = require('fs')

function convert(filePath, convertedPath) {
  console.log('Converting coordinates...')
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error(err)
        reject(err)
      }
      const parsed = JSON.parse(data)
      const converted = toWgs84(parsed, { mutate: true })
      fs.writeFile(convertedPath, JSON.stringify(converted), err => {
        if (err) {
          console.error(err)
          reject(err)
        }
        console.log('Coordinates converted.')
        resolve(convertedPath)
      })
    })
  })
}


module.exports = convert
