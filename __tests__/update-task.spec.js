import fs from 'node:fs/promises'
import { randomUUID } from 'node:crypto'

import supertest from 'supertest'
import { expect, describe, it, beforeEach } from 'vitest'

import { ROUTES } from '../src/constants/routes.js'
import { ENV } from '../src/constants/env.js'
import { app } from '../src/app.js'

describe('Update task', () => {
  beforeEach(async () => {
    await fs.writeFile(ENV.DB_PATH, JSON.stringify({}))
  })

  it('should be able to update a task', async () => {
    const INITIAL_TITLE = 'task 1 title'
    const INITIAL_DESCRIPTION = 'task 1 description'

    const UPDATED_TITLE = 'task 1 updated title'
    const UPDATED_DESCRIPTION = 'task 1 updated description'

    await supertest(app).post(ROUTES.TASK).send({
      title: INITIAL_TITLE,
      description: INITIAL_DESCRIPTION,
    })

    const { body: tasks } = await supertest(app).get(ROUTES.TASK)
    const task = tasks[0]

    await supertest(app).put(`${ROUTES.TASK}/${task.id}`).send({
      title: UPDATED_TITLE,
      description: UPDATED_DESCRIPTION,
    })

    const { body: updatedTasks, statusCode } = await supertest(app).get(
      ROUTES.TASK,
    )
    const updatedTask = updatedTasks[0]

    expect(updatedTask).toStrictEqual({
      id: task.id,
      title: UPDATED_TITLE,
      description: UPDATED_DESCRIPTION,
      completed_at: null,
      created_at: task.created_at,
      updated_at: expect.any(String),
    })
    expect(updatedTask.updated_at).not.toEqual(task.updated_at)
    expect(statusCode).toEqual(204)
  })

  it('should be able to update only the field title of a task', async () => {
    const INITIAL_TITLE = 'task 1 title'
    const INITIAL_DESCRIPTION = 'task 1 description'

    const UPDATED_TITLE = 'task 1 updated title'

    await supertest(app).post(ROUTES.TASK).send({
      title: INITIAL_TITLE,
      description: INITIAL_DESCRIPTION,
    })

    const { body: tasks } = await supertest(app).get(ROUTES.TASK)
    const task = tasks[0]

    await supertest(app).put(`${ROUTES.TASK}/${task.id}`).send({
      title: UPDATED_TITLE,
    })

    const { body: updatedTasks, statusCode } = await supertest(app).get(
      ROUTES.TASK,
    )
    const updatedTask = updatedTasks[0]

    expect(updatedTask).toStrictEqual({
      id: task.id,
      title: UPDATED_TITLE,
      description: task.description,
      completed_at: null,
      created_at: task.created_at,
      updated_at: expect.any(String),
    })
    expect(updatedTask.updated_at).not.toEqual(task.updated_at)
    expect(statusCode).toEqual(204)
  })

  it('should be able to update only the field description of a task', async () => {
    const INITIAL_TITLE = 'task 1 title'
    const INITIAL_DESCRIPTION = 'task 1 description'

    const UPDATED_DESCRIPTION = 'task 1 updated description'

    await supertest(app).post(ROUTES.TASK).send({
      title: INITIAL_TITLE,
      description: INITIAL_DESCRIPTION,
    })

    const { body: tasks } = await supertest(app).get(ROUTES.TASK)
    const task = tasks[0]

    await supertest(app).put(`${ROUTES.TASK}/${task.id}`).send({
      description: UPDATED_DESCRIPTION,
    })

    const { body: updatedTasks, statusCode } = await supertest(app).get(
      ROUTES.TASK,
    )
    const updatedTask = updatedTasks[0]

    expect(updatedTask).toStrictEqual({
      id: task.id,
      title: task.title,
      description: UPDATED_DESCRIPTION,
      completed_at: null,
      created_at: task.created_at,
      updated_at: expect.any(String),
    })
    expect(updatedTask.updated_at).not.toEqual(task.updated_at)
    expect(statusCode).toEqual(204)
  })

  it('should not be able to update a non-existent task', async () => {
    const response = await supertest(app)
      .put(`${ROUTES.TASK}/${randomUUID()}`)
      .send({
        title: 'title',
        description: 'description',
      })

    expect(response.statusCode).toEqual(400)
    expect(response.body).toStrictEqual({ message: 'Task not found.' })
  })

  it('should not be able to update a task without submitting a title or description', async () => {
    const INITIAL_TITLE = 'task 1 title'
    const INITIAL_DESCRIPTION = 'task 1 description'

    await supertest(app).post(ROUTES.TASK).send({
      title: INITIAL_TITLE,
      description: INITIAL_DESCRIPTION,
    })

    const { body: tasks } = await supertest(app).get(ROUTES.TASK)
    const task = tasks[0]

    const response = await supertest(app)
      .put(`${ROUTES.TASK}/${task.id}`)
      .send({})

    expect(response.statusCode).toEqual(400)
    expect(response.body).toStrictEqual({
      message: 'Send a title or description to update a task.',
    })
  })
})
