const mongoose = require('mongoose')

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
    const docs = this.model('District').find({ geometry: { $nearSphere: point, $maxDistance: 10000 } })
    return docs
  }

  console.log('District schema created')
  return mongoose.model('District', districtShchema)
}

module.exports = createModel
