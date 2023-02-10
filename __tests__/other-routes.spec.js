import supertest from 'supertest'
import { expect, it, describe } from 'vitest'

import { app } from '../src/app.js'

describe('other routes', () => {
  it('should be able to return route not found', async () => {
    const response = await supertest(app).get('/not-found-route')

    expect(response.statusCode).toEqual(404)
    expect(response.header).toContain({ 'content-type': 'application/json' })
    expect(response.body).toEqual('')
  })
})
