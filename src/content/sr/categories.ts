import type { CategoryDefinition } from '../content-types'

export const srCategories = [
  {
    id: 'time_wasting',
    locale: 'sr',
    label: 'Krađa vremena',
    description: 'Dolazak je najavljen. Kretanje nije potvrđeno.',
    example: 'Evo me za pet minuta.',
  },
  {
    id: 'dry_texting',
    locale: 'sr',
    label: 'Odgovor bez pulsa',
    description: 'Odgovor je stigao. Znak života još nije potvrđen.',
    example: 'Važi.',
  },
  {
    id: 'suspicious_excuse',
    locale: 'sr',
    label: 'Providan alibi',
    description: 'Loš izgovor koji snimak lako obara.',
    example: 'Tek sad vidim poruku.',
  },
  {
    id: 'planning_foul',
    locale: 'sr',
    label: 'Svejedno, ali ne to',
    description: 'Izbor je prepušten grupi. Pravo veta je zadržano.',
    example: 'Meni je svejedno.',
  },
  {
    id: 'emotional_offside',
    locale: 'sr',
    label: 'Emotivni ofsajd',
    description: 'Emotivna linija je povučena pre nego što je igra počela.',
    example: 'A šta smo mi?',
  },
  {
    id: 'missed_chance',
    locale: 'sr',
    label: 'Promašen zicer',
    description: 'Pitanje je bilo otvoreno. Odgovor je završio pored gola.',
    example: 'Odgovor na sve osim na pitanje.',
  },
] as const satisfies readonly CategoryDefinition[]
