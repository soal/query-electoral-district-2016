const toWgs84 = require('@turf/projection').toWgs84
const fs = require('fs')

function conver(filePath, convertedPath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    const parsed = JSON.parse(data)
    const converted = toWgs84(parsed, { mutate: true })
    fs.writeFile(convertedPath, JSON.stringify(converted), err => {
      if (err) console.error(err)
    })
  })
}


module.exports = convert
