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

  districtShchema.methods.findDistrict = function(point) {
    // console.log(this)
    const docs = this.model('District').find({ geometry: { $nearSphere: point, $maxDistance: 10000 } })
    console.log(docs)
    return docs
    // const docs = this.model('District').find({ geo: { $nearSphere: this.geo, $maxDistance: 0.01} }, cb);
    // return isInPolygon(point, this.geometry)
  }

  console.log('District schema created')
  return mongoose.model('District', districtShchema)
}

module.exports = createModel
