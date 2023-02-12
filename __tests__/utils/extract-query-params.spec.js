import { expect, it, describe } from 'vitest'

import { extractQueryParams } from '../../src/utils/extract-query-params.js'

const QUERY_PARAMS = '?title=lorem&description=ipsum'

describe('extractQueryParams', () => {
  it('should be able to extract query params', () => {
    const query = extractQueryParams(QUERY_PARAMS)

    expect(query).toStrictEqual({ title: 'lorem', description: 'ipsum' })
  })

  it('should not be able to extract query params non-existent', () => {
    const query = extractQueryParams('')

    expect(query).toStrictEqual({})
  })
})
