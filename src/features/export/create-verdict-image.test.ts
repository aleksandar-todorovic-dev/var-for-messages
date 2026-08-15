import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  createVerdictFileName,
  downloadVerdictFile,
} from './create-verdict-image'

afterEach(() => {
  vi.unstubAllGlobals()
})

function stubDownloadEnvironment({
  appendError,
  clickError,
}: {
  appendError?: Error
  clickError?: Error
} = {}) {
  const remove = vi.fn()
  const revokeObjectURL = vi.fn()
  const click = vi.fn(() => {
    if (clickError) {
      throw clickError
    }
  })
  const link = {
    href: '',
    download: '',
    click,
    remove,
  }
  const append = vi.fn(() => {
    if (appendError) {
      throw appendError
    }
  })

  vi.stubGlobal('URL', {
    createObjectURL: vi.fn(() => 'blob:test'),
    revokeObjectURL,
  })
  vi.stubGlobal('document', {
    createElement: vi.fn(() => link),
    body: { append },
  })
  vi.stubGlobal('window', {
    setTimeout(callback: () => void) {
      callback()
      return 1
    },
  })

  return {
    append,
    click,
    link,
    remove,
    revokeObjectURL,
  }
}

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

  it('cleans up temporary download resources after a successful click', () => {
    const environment = stubDownloadEnvironment()

    expect(() =>
      downloadVerdictFile({ name: 'test.png' } as File),
    ).not.toThrow()
    expect(environment.append).toHaveBeenCalledWith(
      environment.link,
    )
    expect(environment.click).toHaveBeenCalledOnce()
    expect(environment.remove).toHaveBeenCalledOnce()
    expect(environment.revokeObjectURL).toHaveBeenCalledWith(
      'blob:test',
    )
  })

  it('cleans up temporary download resources when clicking fails', () => {
    const environment = stubDownloadEnvironment({
      clickError: new Error('download blocked'),
    })

    expect(() =>
      downloadVerdictFile({ name: 'test.png' } as File),
    ).toThrow('download blocked')
    expect(environment.remove).toHaveBeenCalledOnce()
    expect(environment.revokeObjectURL).toHaveBeenCalledWith(
      'blob:test',
    )
  })

  it('cleans up temporary download resources when appending fails', () => {
    const environment = stubDownloadEnvironment({
      appendError: new Error('append blocked'),
    })

    expect(() =>
      downloadVerdictFile({ name: 'test.png' } as File),
    ).toThrow('append blocked')
    expect(environment.click).not.toHaveBeenCalled()
    expect(environment.remove).toHaveBeenCalledOnce()
    expect(environment.revokeObjectURL).toHaveBeenCalledWith(
      'blob:test',
    )
  })
})
