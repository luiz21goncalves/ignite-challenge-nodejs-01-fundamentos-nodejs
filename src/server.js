import { app } from './app.js'
import { ENV } from './constants/env.js'

app
  .listen(ENV.PORT)
  .on('listening', () => console.info(`server running at ${ENV.PORT}`))

process.on('uncaughtException', (error) =>
  console.info(`uncaughtException happened: ${error.stack ?? error}`),
)
process.on('unhandledRejection', (error) =>
  console.info(`unhandledRejection happened: ${error.stack ?? error}`),
)
