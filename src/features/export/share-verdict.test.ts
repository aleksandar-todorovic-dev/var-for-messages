import { describe, expect, it, vi } from 'vitest'
import {
  getShareCapability,
  shareVerdictFile,
  type ShareNavigator,
} from './share-verdict'

const file = {
  name: 'var-verdict-dry01.png',
  type: 'image/png',
} as File

describe('shareVerdictFile', () => {
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

  it('treats a cancelled share as a normal user outcome', async () => {
    const cancellation = Object.assign(
      new Error('cancelled'),
      { name: 'AbortError' },
    )

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
  })
})
