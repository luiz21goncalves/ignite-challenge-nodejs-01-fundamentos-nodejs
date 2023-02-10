import dotenv from 'dotenv'
import http from 'node:http'

dotenv.config()

const server = http.createServer((request, response) => {
  return response.writeHead(200).end()
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
