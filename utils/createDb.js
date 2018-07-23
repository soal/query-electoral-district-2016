const convert = require('./convertCoordinates')
const split = require('./splitFeatures')
const populate = require('./populateDistricts')


const filePath = __dirname + '/../data/districts_full.geojson'
const convertedPath = __dirname + '/../data/districts_full_converted.geojson'
const listDirPath = __dirname + '/../data/list/'

async function init() {
  try {
    await convert(filePath, convertedPath)
    await split(convertedPath, listDirPath)
    await populate(listDirPath)
    process.exit(0)
  } catch(err) {
    console.error(err)
    process.exit(1)
  }

}

init()
