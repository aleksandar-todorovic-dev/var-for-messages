import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  createVerdictFileName,
  downloadVerdictFile,
} from './create-verdict-image'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('createVerdictFileName', () => {
  it('creates a neutral ASCII filename from the case ID', () => {
    expect(createVerdictFileName('#DRY01-02')).toBe(
      'var-verdict-dry01-02.png',
    )
  })

  it('never includes arbitrary user text', () => {
    expect(createVerdictFileName('#ČĆ / hello')).toBe(
      'var-verdict-hello.png',
    )
  })

  it('falls back when the case code is empty', () => {
    expect(createVerdictFileName('###')).toBe(
      'var-verdict-case.png',
    )
  })

  it('cleans up temporary download resources when clicking fails', () => {
    const remove = vi.fn()
    const revokeObjectURL = vi.fn()
    const link = {
      href: '',
      download: '',
      click: vi.fn(() => {
        throw new Error('download blocked')
      }),
      remove,
    }

    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:test'),
      revokeObjectURL,
    })
    vi.stubGlobal('document', {
      createElement: vi.fn(() => link),
      body: { append: vi.fn() },
    })
    vi.stubGlobal('window', {
      setTimeout(callback: () => void) {
        callback()
        return 1
      },
    })

    expect(() =>
      downloadVerdictFile({ name: 'test.png' } as File),
    ).toThrow('download blocked')
    expect(remove).toHaveBeenCalledOnce()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:test')
  })
})
