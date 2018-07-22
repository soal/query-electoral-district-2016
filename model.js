const mongoose = require('mongoose')
const isInPolygon = require('@turf/boolean-point-in-polygon')

async function createModel() {
  const districtShchema = mongoose.Schema({
    type: { type: String },
    properties: {
      wiki_name: String,
      wiki_pop: Number,
      okrug: Number,
      FID: String,
      wiki_terr: String
    },
    geometry: {
      type: { type: String },
      coordinates: [
        [[[Number, Number]]],
        [[[Number, Number]]]
      ]
    }
  })

  districtShchema.index({ 'geometry': '2dsphere' })

  districtShchema.methods.checkPoint = function(point) {
    return isInPolygon(point, this.shape)
  }

  console.log('District schema created')
  return mongoose.model('District', districtShchema)
}

module.exports = createModel
