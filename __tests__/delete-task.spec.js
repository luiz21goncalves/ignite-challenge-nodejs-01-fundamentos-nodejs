import { randomUUID } from 'node:crypto'

import supertest from 'supertest'
import { it, describe, expect } from 'vitest'
import { faker } from '@faker-js/faker'

import { app } from '../src/app.js'
import { ROUTES } from '../src/constants/routes.js'

describe('Delete task', () => {
  it('should be able to delete a task', async () => {
    await supertest(app).post(ROUTES.TASK).send({
      title: faker.lorem.word(),
      description: faker.lorem.sentence(),
    })

    const { body: tasks } = await supertest(app).get(ROUTES.TASK)
    const task = tasks[0]

    const { statusCode } = await supertest(app).delete(
      `${ROUTES.TASK}/${task.id}`,
    )

    const { body } = await supertest(app).get(ROUTES.TASK)

    expect(body).toHaveLength(0)
    expect(statusCode).toEqual(204)
  })

  it('should not be able to delete non-existing a task', async () => {
    const response = await supertest(app).delete(
      `${ROUTES.TASK}/${randomUUID()}`,
    )

    expect(response.statusCode).toEqual(400)
  })
})
