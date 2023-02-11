import { randomUUID } from 'node:crypto'

import { Database } from './database.js'
import { ROUTES } from './constants/routes'

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

      database.inset('tasks', task)

      return response.writeHead(201).end()
    },
  },
]
