import type { CategoryDefinition } from '../content-types'

export const enCategories = [
  {
    id: 'time_wasting',
    locale: 'en',
    label: 'On My Way',
    description: 'Arrival announced. Movement not confirmed.',
    example: 'I’m five minutes away.',
  },
  {
    id: 'dry_texting',
    locale: 'en',
    label: 'Dry Reply',
    description: 'A reply arrived. Signs of life remain under review.',
    example: 'K.',
  },
  {
    id: 'suspicious_excuse',
    locale: 'en',
    label: 'Yeah, Right',
    description: 'An excuse the replay is unlikely to support.',
    example: 'Sorry, just saw this.',
  },
  {
    id: 'planning_foul',
    locale: 'en',
    label: 'Anything But That',
    description: 'The choice was outsourced. Veto rights were retained.',
    example: 'Anything is fine.',
  },
  {
    id: 'emotional_offside',
    locale: 'en',
    label: 'Emotional Offside',
    description: 'The emotional line arrived before the match had settled.',
    example: 'So what are we?',
  },
  {
    id: 'missed_chance',
    locale: 'en',
    label: 'Missed Sitter',
    description: 'The chance was open. The reply went wide.',
    example: 'A reply to everything except the question.',
  },
] as const satisfies readonly CategoryDefinition[]
