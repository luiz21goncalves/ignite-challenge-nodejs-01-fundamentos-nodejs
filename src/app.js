import 'dotenv/config'

import http from 'node:http'

import { json } from './middlewares/json.js'
import { routes } from './routes.js'

const app = http.createServer(async (request, response) => {
  const { method, url } = request

  await json(request, response)

  const route = routes.find((route) => {
    return route.method === method && route.path === url
  })

  if (route) {
    return route.handler(request, response)
  }

  return response
    .setHeader('Content-type', 'application/json')
    .writeHead(404)
    .end()
})

export { app }