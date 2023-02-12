import { randomUUID } from 'node:crypto'

import { Database } from './database.js'
import { ROUTES } from './constants/routes.js'
import { TABLE_NAMES } from './constants/table-names.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath(ROUTES.TASK),
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
    method: 'PUT',
    path: buildRoutePath(`${ROUTES.TASK}/:id`),
    handler: (request, response) => {
      const { id } = request.params
      const { title = undefined, description = undefined } = request.body

      if (!title && !description) {
        return response.writeHead(400).end(
          JSON.stringify({
            message: 'Send a title or description to update a task.',
          }),
        )
      }

      const [task] = database.select(TABLE_NAMES.TASKS, { id })

      if (task) {
        const updatedTask = {
          ...task,
          title: title || task?.title,
          description: description || task?.description,
          updated_at: new Date(),
        }

        database.update(TABLE_NAMES.TASKS, id, updatedTask)

        return response.writeHead(200).end()
      }

      return response
        .writeHead(400)
        .end(JSON.stringify({ message: 'Task not found.' }))
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath(`${ROUTES.TASK}/:id`),
    handler: (request, response) => {
      const { id } = request.params

      const [task] = database.select(TABLE_NAMES.TASKS, { id })

      if (task) {
        database.delete(TABLE_NAMES.TASKS, id)

        return response.writeHead(200).end()
      }

      return response
        .writeHead(400)
        .end(JSON.stringify({ message: 'Task not found.' }))
    },
  },
  {
    method: 'GET',
    path: buildRoutePath(ROUTES.TASK),
    handler: (request, response) => {
      const search = request.query?.search

      const searchParams = search
        ? { title: search, description: search }
        : undefined

      const tasks = database.select(TABLE_NAMES.TASKS, searchParams)

      return response.end(JSON.stringify(tasks))
    },
  },
]
