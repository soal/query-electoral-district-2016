const toWgs84 = require('@turf/projection').toWgs84
const fs = require('fs')

const filePath = __dirname + '/../data/districts_full.geojson'
const convertedPath = __dirname + '/../data/districts_full_converted.geojson'

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
