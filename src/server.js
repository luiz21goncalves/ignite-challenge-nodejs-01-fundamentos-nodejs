import { app } from './app.js'

app
  .listen(process.env.PORT)
  .on('listening', () => console.info(`server running at ${process.env.PORT}`))

process.on('uncaughtException', (error) =>
  console.info(`uncaughtException happened: ${error.stack ?? error}`),
)
process.on('unhandledRejection', (error) =>
  console.info(`unhandledRejection happened: ${error.stack ?? error}`),
)
