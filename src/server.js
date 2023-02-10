import dotenv from 'dotenv'
import http from 'node:http'

dotenv.config()

const server = http.createServer((request, response) => {
  return response.writeHead(200).end()
})

server.listen(process.env.PORT).on('listening', () => console.log(`server running at ${process.env.PORT}`))

process.on('uncaughtException', (error) => logger.info(`uncaughtException happened: ${error.stack ?? error}`))
process.on('unhandledRejection', (error) => logger.info(`unhandledRejection happened: ${error.stack ?? error}`))
