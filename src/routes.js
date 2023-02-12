import { randomUUID } from 'node:crypto'

import { Database } from './database.js'
import { ROUTES } from './constants/routes.js'
import { TABLE_NAMES } from './constants/table-names.js'

const database = new Database()

export const routes = [
  {
    method: 'POST',
    path: ROUTES.TASK,
    handler: (request, response) => {
      const { title, description } = request.body

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      }

      database.inset(TABLE_NAMES.TASKS, task)

      return response.writeHead(201).end()
    },
  },
  {
    method: 'GET',
    path: ROUTES.TASK,
    handler: (request, response) => {
      const tasks = database.select(TABLE_NAMES.TASKS)

      return response.end(JSON.stringify(tasks))
    },
  },
]
