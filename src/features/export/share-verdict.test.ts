import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import {
  getShareCapability,
  shareVerdictFile,
  type ShareNavigator,
} from './share-verdict'

const file = {
  name: 'var-verdict-dry01.png',
  type: 'image/png',
} as File

function installVisibilityHarness(
  initialState: DocumentVisibilityState,
) {
  let visibilityState = initialState
  let visibilityListener: (() => void) | undefined
  let frameCallback: FrameRequestCallback | undefined
  const removeEventListener = vi.fn()
  const requestAnimationFrame = vi.fn(
    (callback: FrameRequestCallback) => {
      frameCallback = callback
      return 1
    },
  )

  vi.stubGlobal('document', {
    get visibilityState() {
      return visibilityState
    },
    addEventListener(
      _type: string,
      listener: EventListenerOrEventListenerObject,
    ) {
      visibilityListener = listener as () => void
    },
    removeEventListener,
  })
  vi.stubGlobal('window', { requestAnimationFrame })

  return {
    removeEventListener,
    requestAnimationFrame,
    paint() {
      const callback = frameCallback
      frameCallback = undefined
      callback?.(0)
    },
    show() {
      visibilityState = 'visible'
      visibilityListener?.()
    },
  }
}

describe('shareVerdictFile', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('detects native file sharing support', () => {
    const navigatorLike: ShareNavigator = {
      share: vi.fn(),
      canShare: () => true,
    }

    expect(
      getShareCapability(navigatorLike, file),
    ).toBe('files')
  })

  it('returns unsupported when only text sharing is available', async () => {
    const navigatorLike: ShareNavigator = {
      share: vi.fn(),
      canShare: () => false,
    }

    const result = await shareVerdictFile({
      navigatorLike,
      file,
      title: 'VAR for Messages',
      text: 'Yellow card',
    })

    expect(result).toEqual({
      status: 'unsupported',
      capability: 'text',
    })
    expect(navigatorLike.share).not.toHaveBeenCalled()
  })

  it('shares the prepared PNG file', async () => {
    const share = vi.fn().mockResolvedValue(undefined)
    const navigatorLike: ShareNavigator = {
      share,
      canShare: () => true,
    }

    const result = await shareVerdictFile({
      navigatorLike,
      file,
      title: 'VAR for Messages',
      text: 'Yellow card',
    })

    expect(result.status).toBe('shared')
    expect(share).toHaveBeenCalledWith({
      files: [file],
      title: 'VAR for Messages',
      text: 'Yellow card',
    })
  })

  it('waits for Chrome to become visible after native sharing', async () => {
    const lifecycle = installVisibilityHarness('hidden')
    const share = vi.fn().mockResolvedValue(undefined)

    let settled = false
    const resultPromise = shareVerdictFile({
      navigatorLike: {
        share,
        canShare: () => true,
      },
      file,
      title: 'VAR for Messages',
      text: 'Yellow card',
    }).then((result) => {
      settled = true
      return result
    })

    await Promise.resolve()
    expect(settled).toBe(false)

    lifecycle.show()
    await Promise.resolve()
    expect(settled).toBe(false)

    lifecycle.paint()

    await expect(resultPromise).resolves.toEqual({
      status: 'shared',
      capability: 'files',
    })
    expect(lifecycle.removeEventListener).toHaveBeenCalledOnce()
  })

  it('settles on the next frame when sharing stays visible', async () => {
    const lifecycle = installVisibilityHarness('visible')
    let settled = false
    const resultPromise = shareVerdictFile({
      navigatorLike: {
        share: vi.fn().mockResolvedValue(undefined),
        canShare: () => true,
      },
      file,
      title: 'VAR for Messages',
      text: 'Yellow card',
    }).then((result) => {
      settled = true
      return result
    })

    await Promise.resolve()

    expect(settled).toBe(false)

    lifecycle.paint()

    await expect(resultPromise).resolves.toEqual({
      status: 'shared',
      capability: 'files',
    })
  })

  it('treats a cancelled share as a normal user outcome', async () => {
    const cancellation = Object.assign(
      new Error('cancelled'),
      { name: 'AbortError' },
    )

    const lifecycle = installVisibilityHarness('hidden')
    const navigatorLike: ShareNavigator = {
      share: vi.fn().mockRejectedValue(cancellation),
      canShare: () => true,
    }

    const result = await shareVerdictFile({
      navigatorLike,
      file,
      title: 'VAR for Messages',
      text: 'Yellow card',
    })

    expect(result.status).toBe('cancelled')
    expect(lifecycle.requestAnimationFrame).not.toHaveBeenCalled()
  })
})
