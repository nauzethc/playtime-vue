/*
  Server API example to test app on development

  Usage:

  $ npm i koa @koa/router koa-logger @koa/cors howlongtobeat-api
  $ node server.js

 */

const Koa = require('koa')
const Router = require('@koa/router')
const logger = require('koa-logger')
const cors = require('@koa/cors')
const howlongtobeat = require('howlongtobeat-api')

// Init
const PORT = process.env.API_PORT || 4000
const app = new Koa()
const router = new Router({ prefix: '/api' })

// Middleware
app.use(logger())
app.use(cors())
app.use(router.routes()).use(router.allowedMethods())

// Routes
router.get('/games/:id', async ctx => {
  try {
    const game = await howlongtobeat.get(parseInt(ctx.params.id))
    ctx.response.status = game ? 200 : 404
    ctx.response.body = game || 'Game not found by given ID'
  } catch (error) {
    ctx.response.status = 500
    ctx.response.body = `${error}`
  }
})
router.get('/games', async ctx => {
  try {
    const games = await howlongtobeat.find(ctx.request.query || {})
    ctx.response.status = 200
    ctx.response.body = games
  } catch (error) {
    ctx.response.status = 500
    ctx.response.body = `${error}`
  }
})

// Start
app.listen(PORT, () => console.log(`Listening at :${PORT}`))
