import { getFontEmbedCSS, toBlob } from 'html-to-image'

export const VERDICT_EXPORT_WIDTH = 1080
export const VERDICT_EXPORT_HEIGHT = 1350

export type VerdictImageResult = {
  blob: Blob
  file: File
  width: number
  height: number
}

function sanitizeCaseId(caseId: string) {
  const sanitized = caseId
    .replace(/^#/, '')
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return sanitized || 'case'
}

function waitForPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
}

async function readImageDimensions(blob: Blob) {
  const objectUrl = URL.createObjectURL(blob)

  try {
    const image = new Image()

    const dimensions = await new Promise<{
      width: number
      height: number
    }>((resolve, reject) => {
      image.onload = () => {
        resolve({
          width: image.naturalWidth,
          height: image.naturalHeight,
        })
      }

      image.onerror = () => {
        reject(new Error('PNG preview could not load.'))
      }

      image.src = objectUrl
    })

    return dimensions
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export async function createVerdictImage(
  node: HTMLElement,
  caseId: string,
): Promise<VerdictImageResult> {
  await document.fonts.ready
  await waitForPaint()

  const fontEmbedCSS = await getFontEmbedCSS(node)

  const blob = await toBlob(node, {
    width: VERDICT_EXPORT_WIDTH,
    height: VERDICT_EXPORT_HEIGHT,
    canvasWidth: VERDICT_EXPORT_WIDTH,
    canvasHeight: VERDICT_EXPORT_HEIGHT,
    pixelRatio: 1,
    backgroundColor: '#f1eadb',
    cacheBust: true,
    preferredFontFormat: 'woff2',
    fontEmbedCSS,
  })

  if (!blob) {
    throw new Error('PNG renderer returned an empty result.')
  }

  const dimensions = await readImageDimensions(blob)

  if (
    dimensions.width !== VERDICT_EXPORT_WIDTH ||
    dimensions.height !== VERDICT_EXPORT_HEIGHT
  ) {
    throw new Error(
      `Unexpected PNG size: ${dimensions.width} × ${dimensions.height}.`,
    )
  }

  const fileName = `var-verdict-${sanitizeCaseId(caseId)}.png`
  const file = new File([blob], fileName, {
    type: 'image/png',
    lastModified: Date.now(),
  })

  return {
    blob,
    file,
    width: dimensions.width,
    height: dimensions.height,
  }
}

export function downloadVerdictFile(file: File) {
  const objectUrl = URL.createObjectURL(file)
  const link = document.createElement('a')

  link.href = objectUrl
  link.download = file.name
  document.body.append(link)
  link.click()
  link.remove()

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl)
  }, 0)
}
