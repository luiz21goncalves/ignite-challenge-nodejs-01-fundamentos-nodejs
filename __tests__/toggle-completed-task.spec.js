import { randomUUID } from 'node:crypto'

import { faker } from '@faker-js/faker'
import supertest from 'supertest'
import { expect, it, describe } from 'vitest'

import { app } from '../src/app.js'
import { ROUTES } from '../src/constants/routes.js'

describe('Toggle completed task', () => {
  it('should be able to mark a task completed', async () => {
    await supertest(app).post(ROUTES.TASK).send({
      title: faker.lorem.words(),
      description: faker.lorem.sentence(),
    })

    const { body: tasks } = await supertest(app).get(ROUTES.TASK)
    const task = tasks[0]

    const { statusCode } = await supertest(app).patch(
      `${ROUTES.TASK}/${task.id}/complete`,
    )

    const { body } = await supertest(app).get(ROUTES.TASK)
    const completedTask = body[0]

    expect(task.completed_at).toBeNull()
    expect(statusCode).toEqual(204)
    expect(completedTask).toStrictEqual({
      id: task.id,
      title: task.title,
      description: task.description,
      completed_at: expect.any(String),
      created_at: task.created_at,
      updated_at: expect.any(String),
    })
  })

  it('should be able to mark a task uncompleted', async () => {
    await supertest(app).post(ROUTES.TASK).send({
      title: faker.lorem.words(),
      description: faker.lorem.sentence(),
    })

    const { body: tasks } = await supertest(app).get(ROUTES.TASK)
    const task = tasks[1]

    await supertest(app).patch(`${ROUTES.TASK}/${task.id}/complete`)

    const { body: allTasks } = await supertest(app).get(ROUTES.TASK)
    const completedTask = allTasks[1]

    const { statusCode } = await supertest(app).patch(
      `${ROUTES.TASK}/${task.id}/complete`,
    )

    const { body } = await supertest(app).get(ROUTES.TASK)
    const uncompletedTask = body[1]

    expect(task.completed_at).toBeNull()
    expect(completedTask.completed_at).toBeDefined()
    expect(statusCode).toEqual(204)
    expect(uncompletedTask).toStrictEqual({
      id: task.id,
      title: task.title,
      description: task.description,
      completed_at: null,
      created_at: task.created_at,
      updated_at: expect.any(String),
    })
  })

  it('should not be able to mark a task complete if non-existing', async () => {
    const response = await supertest(app).patch(
      `${ROUTES.TASK}/${randomUUID()}/complete`,
    )

    expect(response.statusCode).toEqual(400)
    expect(response.body).toStrictEqual({ message: 'Task not found.' })
  })
})
