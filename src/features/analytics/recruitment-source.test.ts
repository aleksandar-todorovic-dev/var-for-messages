import { describe, expect, it, vi } from 'vitest'
import {
  consumeRecruitmentSource,
  parseRecruitmentSource,
} from './recruitment-source'

describe('recruitment source query handling', () => {
  it.each([
    'benchmark',
    'reddit-sideproject',
    'balkan-discord',
    'telegram',
  ] as const)('accepts the fixed %s source', (source) => {
    expect(
      parseRecruitmentSource(`?src=${source}`),
    ).toBe(source)
  })

  it('ignores unknown, differently-cased, and duplicate values', () => {
    expect(
      parseRecruitmentSource('?src=private-message'),
    ).toBeUndefined()
    expect(
      parseRecruitmentSource('?src=Telegram'),
    ).toBeUndefined()
    expect(
      parseRecruitmentSource(
        '?src=telegram&src=benchmark',
      ),
    ).toBeUndefined()
  })

  it('removes the complete query without copying arbitrary values', () => {
    const replaceState = vi.fn()
    const source = consumeRecruitmentSource(
      {
        pathname: '/pilot',
        search:
          '?src=telegram&leak=DO_NOT_LEAK_QUERY_55193',
      },
      { replaceState },
    )

    expect(source).toBe('telegram')
    expect(replaceState).toHaveBeenCalledWith(
      null,
      '',
      '/pilot',
    )
    expect(
      JSON.stringify(replaceState.mock.calls),
    ).not.toContain('DO_NOT_LEAK_QUERY_55193')
  })

  it('does not rewrite a URL that has no query', () => {
    const replaceState = vi.fn()

    expect(
      consumeRecruitmentSource(
        { pathname: '/', search: '' },
        { replaceState },
      ),
    ).toBeUndefined()
    expect(replaceState).not.toHaveBeenCalled()
  })

  it('keeps URL cleanup failures from breaking bootstrap', () => {
    expect(() =>
      consumeRecruitmentSource(
        { pathname: '/', search: '?src=benchmark' },
        {
          replaceState() {
            throw new Error('History unavailable')
          },
        },
      ),
    ).not.toThrow()
  })
})
