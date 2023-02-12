import { it, describe, expect } from 'vitest'

import { buildRoutePath } from '../../src/utils/build-route-path.js'
import { ROUTES } from '../../src/constants/routes.js'

const QUERY_PARAMS = '?title=lorem&description=ipsum'

describe('buildRoutePath', () => {
  it('should be able to build a route with a simple path', () => {
    const path = buildRoutePath(ROUTES.TASK)
    const match = path.test(ROUTES.TASK)
    const routeParams = ROUTES.TASK.match(path)
    const { query, ...params } = routeParams.groups

    expect(path).toHaveProperty('test')
    expect(match).toEqual(true)
    expect(query).toBeUndefined()
    expect(params).toStrictEqual({})
  })

  it('should be able to build a route with a simple path and query params', () => {
    const URL = `${ROUTES.TASK}${QUERY_PARAMS}`

    const path = buildRoutePath(ROUTES.TASK)
    const match = path.test(URL)
    const routeParams = URL.match(path)
    const { query, ...params } = routeParams.groups

    expect(path).toHaveProperty('test')
    expect(match).toEqual(true)
    expect(query).toEqual(QUERY_PARAMS)
    expect(params).toStrictEqual({})
  })

  it('should be able to build a route with a route param', () => {
    const URL = `${ROUTES.TASK}/some-id`

    const path = buildRoutePath(`${ROUTES.TASK}/:id`)
    const match = path.test(URL)
    const routeParams = URL.match(path)
    const { query, ...params } = routeParams.groups

    expect(path).toHaveProperty('test')
    expect(match).toEqual(true)
    expect(params).toStrictEqual({ id: 'some-id' })
    expect(query).toBeUndefined()
  })

  it('should be able to build a route with a route param and query params', () => {
    const URL = `${ROUTES.TASK}/some-id${QUERY_PARAMS}`

    const path = buildRoutePath(`${ROUTES.TASK}/:id`)
    const match = path.test(URL)
    const routeParams = URL.match(path)
    const { query, ...params } = routeParams.groups

    expect(path).toHaveProperty('test')
    expect(match).toEqual(true)
    expect(params).toStrictEqual({ id: 'some-id' })
    expect(query).toEqual(QUERY_PARAMS)
  })
})
