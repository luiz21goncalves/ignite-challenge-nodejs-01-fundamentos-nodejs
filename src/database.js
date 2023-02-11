import fs from 'node:fs/promises'

import { ENV } from './constants/env'

export class Database {
  #database = {}

  constructor() {
    fs.readFile(ENV.DB_PATH, 'utf-8')
      .then((data) => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(ENV.DB_PATH, JSON.stringify(this.#database))
  }

  inset(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }
}
