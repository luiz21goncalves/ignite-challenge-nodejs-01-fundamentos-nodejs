import supertest from 'supertest'
import { expect, it, describe } from 'vitest'
import { faker } from '@faker-js/faker'

import { app } from '../src/app'

describe('Create task', () => {
  it('should be able to create a task', async () => {
    const title = faker.lorem.words()
    const description = faker.lorem.words()

    const response = await supertest(app).post('/tasks').send({
      title,
      description,
    })

    expect(response.statusCode).toEqual(201)
    expect(response.header).toContain({ 'content-type': 'application/json' })
    expect(response.body).toStrictEqual({
      id: expect.any(String),
      title,
      description,
      completed_at: null,
      created_at: expect.any(String),
      updated_at: expect.any(String),
    })
  })
})
