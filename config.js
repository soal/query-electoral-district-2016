const DB_URL = process.env['DB_URL'] || 'localhost'
const DB_PORT = process.env['DB_PORT'] || '27017'
const DB_NAME = process.env['DB_NAME'] || 'districts'
const DB_USERNAME = process.env['DB_USER'] || 'soal'
const DB_PASSWORD = process.env['DB_PASSWORD'] || 'alunit'

module.exports = {
  DB_URL,
  DB_NAME,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD
}
