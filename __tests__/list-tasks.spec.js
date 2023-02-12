import { faker } from '@faker-js/faker'
import supertest from 'supertest'
import { expect, it, describe } from 'vitest'

import { app } from '../src/app.js'
import { ROUTES } from '../src/constants/routes.js'

describe('List tasks', () => {
  it('should be able to list all tasks', async () => {
    const title = faker.lorem.words()
    const description = faker.lorem.sentence()

    await supertest(app).post(ROUTES.TASK).send({
      title,
      description,
    })

    const response = await supertest(app).get(ROUTES.TASK)

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          title,
          description,
          completed_at: null,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        }),
      ]),
    )
  })
})
