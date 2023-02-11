import fs from 'node:fs/promises'
import dotenv from 'dotenv'
import { afterAll } from 'vitest'

const env = dotenv.config({ path: '.env.test' })

afterAll(async () => {
  await fs.writeFile(env.parsed.DB_PATH, JSON.stringify({}))
})
