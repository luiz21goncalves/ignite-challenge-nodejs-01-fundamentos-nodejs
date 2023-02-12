import fs from 'node:fs/promises'

import { faker } from '@faker-js/faker'
import supertest from 'supertest'
import { expect, it, describe, beforeEach } from 'vitest'

import { app } from '../src/app.js'
import { ROUTES } from '../src/constants/routes.js'
import { ENV } from '../src/constants/env.js'

describe('List tasks', () => {
  beforeEach(async () => {
    await fs.writeFile(ENV.DB_PATH, JSON.stringify({}))
  })

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

  it('should be able to list tasks filtered by title and description', async () => {
    const title = 'task title'
    const description = 'task description'

    await supertest(app).post(ROUTES.TASK).send({
      title,
      description,
    })

    await supertest(app).post(ROUTES.TASK).send({
      title: faker.lorem.words(),
      description: faker.lorem.sentence(),
    })

    const response = await supertest(app)
      .get(ROUTES.TASK)
      .query({ search: 'task' })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveLength(1)
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
