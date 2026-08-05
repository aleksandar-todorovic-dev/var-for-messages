import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from 'react'
import {
  createVerdictImage,
  type VerdictImageResult,
} from './create-verdict-image'

export type VerdictImageStatus =
  | 'idle'
  | 'preparing'
  | 'ready'
  | 'error'

export function useVerdictImage(
  nodeRef: RefObject<HTMLElement | null>,
  caseId: string,
) {
  const mountedRef = useRef(true)
  const resultRef = useRef<VerdictImageResult | null>(null)
  const promiseRef =
    useRef<Promise<VerdictImageResult> | null>(null)

  const [status, setStatus] =
    useState<VerdictImageStatus>('idle')
  const [error, setError] = useState<Error | null>(null)
  const [result, setResult] =
    useState<VerdictImageResult | null>(null)

  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
    }
  }, [])

  const prepare = useCallback(
    async (force = false) => {
      if (force) {
        resultRef.current = null
        promiseRef.current = null
      }

      if (resultRef.current) {
        return resultRef.current
      }

      if (promiseRef.current) {
        return promiseRef.current
      }

      const node = nodeRef.current

      if (!node) {
        throw new Error('Export canvas is not available.')
      }

      if (mountedRef.current) {
        setStatus('preparing')
        setError(null)
      }

      const preparation = createVerdictImage(node, caseId)
        .then((nextResult) => {
          resultRef.current = nextResult

          if (mountedRef.current) {
            setResult(nextResult)
            setStatus('ready')
          }

          return nextResult
        })
        .catch((nextError: unknown) => {
          const normalizedError =
            nextError instanceof Error
              ? nextError
              : new Error('PNG export failed.')

          if (mountedRef.current) {
            setError(normalizedError)
            setStatus('error')
          }

          throw normalizedError
        })
        .finally(() => {
          promiseRef.current = null
        })

      promiseRef.current = preparation

      return preparation
    },
    [caseId, nodeRef],
  )

  useEffect(() => {
    void prepare().catch(() => {
      // The visible verdict view owns the recoverable error state.
    })
  }, [prepare])

  return {
    status,
    error,
    result,
    prepare,
    retry: () => prepare(true),
  }
}
