const {
  DB_URL,
  DB_USERNAME,
  DB_PASSWORD,
  DB_PORT,
  DB_NAME
} = require('./config')
const mongoose = require('mongoose')
const isInPolygon = require('@turf/boolean-point-in-polygon')

async function dbConnect() {
  await mongoose.connect(
    `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_URL}:${DB_PORT}/${DB_NAME}`,
    { useNewUrlParser: true }
  )
  return mongoose.connection
}

async function createModel() {
  const districtShchema = mongoose.Schema({
    number: Number,
    title: String,
    shape: {
      type: { type: String },
      coordinates: [
        [[Number, Number]],
        [[Number, Number]]
      ]
    }
  })

  districtShchema.index({ 'shape': '2dsphere' })

  districtShchema.methods.checkPoint = function(point) {
    return isInPolygon(point, this.shape)
  }

  const District = mongoose.model('District', districtShchema)
  // console.log('Model created')
  return District
}

async function init() {
  const db = await dbConnect()
  // console.log('DB connected!')
  const districtModel = await createModel()

  return { db, districtModel }
}
// db.on('error', console.error.bind(console, 'connection error:'))

// db.once('open', () => {
//   console.log('DB connected!')
// })
mudule.export = await init()
