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
  const db = await dbConnect()
  const DistrictShchema = mongoose.Schema({
    number: Number,
    title: String,
    shape: {
      type: 'Polygon',
      coordinates: [
        [[Number, Number]],
        [[Number, Number]]
      ]
    }
  })

  DistrictShchema.methods.checkPoint = function(point) {
    return isInPolygon(point, this.shape)
  }

  const District = mongoose.model('District', DistrictShchema);
  return { db, District }
}
// db.on('error', console.error.bind(console, 'connection error:'))
// db.once('open', () => {
//   console.log('DB connected!')
// })

mudule.export = createModel()
