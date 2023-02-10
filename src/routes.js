export const routes = [
  {
    method: 'POST',
    path: '/tasks',
    handler: (request, response) => {
      return response.end('ok')
    },
  },
]
