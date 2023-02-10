import dotenv from 'dotenv'
import http from 'node:http'

import { json } from './middlewares/json.js'
import { routes } from './routes.js'

dotenv.config()

const server = http.createServer(async (request, response) => {
  const { method, url } = request

  await json(request, response)

  const route = routes.find((route) => {
    return route.method === method && route.path === url
  })

  if (route) {
    return route.handler(request, response)
  }

  return response.writeHead(404).end()
})

server
  .listen(process.env.PORT)
  .on('listening', () => console.info(`server running at ${process.env.PORT}`))

process.on('uncaughtException', (error) =>
  console.info(`uncaughtException happened: ${error.stack ?? error}`),
)
process.on('unhandledRejection', (error) =>
  console.info(`unhandledRejection happened: ${error.stack ?? error}`),
)
