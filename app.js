require('dotenv').config()
const express = require('express')
const app = express()
const port = 3000
const { google } = require('googleapis')
const scopes = 'https://www.googleapis.com/auth/analytics.readonly'
const jwt = new google.auth.JWT(process.env.CLIENT_EMAIL, null, process.env.PRIVATE_KEY, scopes)
const view_id = '8264765'
async function getData() {
  const response = await jwt.authorize()
  const result = await google.analytics('v3').data.ga.get({
    'auth': jwt,
    'ids': 'ga:' + view_id,
    'start-date': '2020-12-27',
    'end-date': '2020-12-28',
    'metrics': 'ga:visitors',
    'dimensions': 'ga:pagePath,ga:pageTitle',
    'sort': '-ga:visitors',
    'filters': 'ga:pageTitle!=(not set)',
    'max-results': '8'
  })
  return result
  console.dir(result)
}
app.get('/', async (req, res) => {
  const response = await getData()
  res.send(response.data.rows)
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})