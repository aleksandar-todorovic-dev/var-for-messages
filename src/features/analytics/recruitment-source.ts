import {
  recruitmentSources,
  type RecruitmentSource,
} from './analytics-events'

type InitialLocation = {
  pathname: string
  search: string
}

type InitialHistory = {
  replaceState: (
    data: unknown,
    unused: string,
    url?: string | URL | null,
  ) => void
}

export function parseRecruitmentSource(
  search: string,
): RecruitmentSource | undefined {
  const params = new URLSearchParams(search)
  const sourceValues = params.getAll('src')

  if (sourceValues.length !== 1) {
    return undefined
  }

  const [source] = sourceValues

  return recruitmentSources.find(
    (candidate) => candidate === source,
  )
}

export function consumeRecruitmentSource(
  locationLike: InitialLocation,
  historyLike: InitialHistory,
): RecruitmentSource | undefined {
  const source = parseRecruitmentSource(
    locationLike.search,
  )

  if (locationLike.search) {
    try {
      historyLike.replaceState(
        null,
        '',
        locationLike.pathname || '/',
      )
    } catch {
      // URL cleanup is best-effort and must not interrupt the app.
    }
  }

  return source
}
