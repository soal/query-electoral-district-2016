const {
  DB_URL,
  DB_USERNAME,
  DB_PASSWORD,
  DB_PORT,
  DB_NAME
} = require('./config')
const mongoose = require('mongoose')

async function dbConnect() {
  await mongoose.connect(
    `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_URL}:${DB_PORT}/${DB_NAME}`,
    { useNewUrlParser: true }
  )
  console.log('DB connection established')
  return mongoose.connection
}

module.exports = dbConnect
