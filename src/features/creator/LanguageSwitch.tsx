import type { Locale } from '../../shared/types/domain'

type LanguageSwitchProps = {
  locale: Locale
  label: string
  onChange: (locale: Locale) => void
}

export function LanguageSwitch({
  locale,
  label,
  onChange,
}: LanguageSwitchProps) {
  return (
    <div
      className="language-switch"
      role="group"
      aria-label={label}
    >
      <button
        className={
          locale === 'sr'
            ? 'language-switch__option language-switch__option--active'
            : 'language-switch__option'
        }
        type="button"
        aria-pressed={locale === 'sr'}
        onClick={() => onChange('sr')}
      >
        SR
      </button>

      <button
        className={
          locale === 'en'
            ? 'language-switch__option language-switch__option--active'
            : 'language-switch__option'
        }
        type="button"
        aria-pressed={locale === 'en'}
        onClick={() => onChange('en')}
      >
        EN
      </button>
    </div>
  )
}
