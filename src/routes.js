import { randomUUID } from 'node:crypto'

export const routes = [
  {
    method: 'POST',
    path: '/tasks',
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

      return response.writeHead(201).end(JSON.stringify(task))
    },
  },
]
