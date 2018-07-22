const restify = require('restify')
const errors = require('restify-errors');
const createDb = require('./db')
const createModel = require('./model')
const isInPolygon = require('@turf/boolean-point-in-polygon').default

async function nativeSearch(model, point, res, next) {
  try {
    let doc = await model
      .findOne({ geometry: { $nearSphere: point, $maxDistance: 1000 }})
      .exec()

    if (doc && doc._id) {
      res.json({
        id: doc._id,
        ...doc.properties
      })
      return next()
    } else {
      return next(new errors.NotFoundError())
    }

  } catch (err) {
    return next(new errors.InternalError())
  }
}

async function accurateSearch(model, point, res, next) {
  try {
    let docs = await model
      .find({ geometry: { $nearSphere: point, $maxDistance: 10000 }}, {}, { limit: 5 })
      .exec()

    if (docs.length > 1) {
      docs = docs.filter(doc => isInPolygon(point, doc.geometry))
    }

    if (docs.length) {
      const doc = docs[0]

      res.json({
        id: doc._id,
        ...doc.properties
      })
      return next()
    } else {
      return next(new errors.NotFoundError())
    }

  } catch (err) {
    return next(new errors.InternalError())
  }
}

async function init() {
  const db = await createDb()
  const District = await createModel()

  async function getDistrict(req, res, next) {
    if (req.query.lng === undefined) {
      return next(new errors.BadRequestError('Missing required parameter "lng"'))
    }
    if (isNaN(+req.query.lng) || +req.query.lng > 180 || +req.query.lng < -180) {
       return next(new errors.BadRequestError('Parameter "lng" must be number between -180 and 180'))
    }
    if (req.query.lat === undefined) {
       return next(new errors.BadRequestError('Missing required parameter "lat"'))
    }
    if (isNaN(+req.query.lat) || +req.query.lat > 90 || +req.query.lat < -90) {
       return next(new errors.BadRequestError('Parameter "lat" must be number between -90 and 90'))
    }
    const point = [req.query.lng, req.query.lat]

    // return await accurateSearch(District, point, res, next)
    return await nativeSearch(District, point, res, next)
  }

  const server = restify.createServer()
  server.use(restify.plugins.queryParser())
  server.get('/district', getDistrict)
  server.head('/district', getDistrict)
  server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url)
  })
}

init()
