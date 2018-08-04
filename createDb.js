const convert = require('./utils/convertCoordinates')
resolve = require('path').resolve
const fs = require('fs')
const split = require('./utils/splitFeatures')
const populate = require('./utils/populateDistricts')

function checkPaths(filePath, listDirPath, convertedPath) {
  try {
    fs.statSync(filePath)
  } catch (err) {
    console.error('Data file path error')
    console.error(err)
    pocess.exit(1)
  }

  try {
    fs.statSync(listDirPath)
  } catch (err) {
    if (err.code === 'ENOENT') {
      fs.mkdirSync(listDirPath)
    } else {
      console.error('Data directory error')
      console.error(err)
      pocess.exit(1)
    }
  }

  try {
    fs.statSync(convertedPath)
  } catch (err) {
    if (err.code === 'ENOENT') {
      fs.writeFileSync(convertedPath, '')
    } else {
      console.error('Converted data file error')
      console.error(err)
      process.exit(1)
    }
  }
}

async function init() {
  if (!process.argv[2]) {
    console.error(`
      Please provide path to data file:\n
      node createDb [path-to-file]
    `)
    process.exit(1)
  }
  const filePath = resolve(process.argv[2])
  const convertedPath = __dirname + '/districts_full_converted.geojson'
  const listDirPath = __dirname + '/data_splitted/'

  checkPaths(filePath, listDirPath, convertedPath)
  try {
    await convert(filePath, convertedPath)
    await split(convertedPath, listDirPath)
    await populate(listDirPath)
    console.log('All done!')
    process.exit(0)
  } catch(err) {
    console.error(err)
    process.exit(1)
  }
}

init()
