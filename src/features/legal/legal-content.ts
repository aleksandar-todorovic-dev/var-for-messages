import type { Locale } from '../../shared/types/domain'

export const OPERATOR_NAME = 'Aleksandar Todorović'
export const PRIVACY_CONTACT = 'hello@varformessages.com'
export const COMMISSIONER_URL =
  'https://poverenik.rs/en/about-us/commissioners-jurisdiction/'

export const feedbackUrlByLocale = {
  sr: 'https://tally.so/r/KYr5yV',
  en: 'https://tally.so/r/ja86AE',
} as const satisfies Readonly<Record<Locale, string>>

export type LegalSection = {
  heading: string
  paragraphs?: readonly string[]
  items?: readonly string[]
}

type LegalNotice = {
  title: string
  updated: string
  intro: string
  sections: readonly LegalSection[]
  commissionerLink: string
}

type LegalCopy = {
  footerLabel: string
  privacyLink: string
  termsLink: string
  contactLink: string
  noticesLink: string
  feedbackLink: string
  affiliation: string
  close: string
  controllerLabel: string
  countryLabel: string
  country: string
  contactLabel: string
  privacy: LegalNotice
  terms: Omit<LegalNotice, 'commissionerLink'>
}

const srPrivacySections: readonly LegalSection[] = [
  {
    heading: 'Šta je aplikacija',
    paragraphs: [
      'VAR for Messages je besplatna, nezavisna humoristička/parodijska aplikacija koja poruku pretvara u izmišljenu fudbalsku VAR presudu za privatno deljenje.',
    ],
  },
  {
    heading: 'Sadržaj koji ostaje u browseru',
    paragraphs: [
      'Tekst poruke i opciono ime igrača obrađuju se u tvom browseru. Ne šaljemo ih namerno analitici niti udaljenom skladištu, a aplikacija nema backend za poruke, imena ili istoriju presuda.',
      'Kartica i PNG slika prave se na uređaju, u browseru. Ti odlučuješ da li ćeš preuzeti ili dalje podeliti rezultat.',
    ],
  },
  {
    heading: 'Hosting',
    paragraphs: [
      'Sajt hostuje Vercel. Da bi prikazao i zaštitio sajt, Vercel nužno obrađuje uobičajene tehničke podatke o zahtevima i infrastrukturi, kao što mogu biti IP adresa, vreme zahteva, podaci o browseru/uređaju i bezbednosni ili infrastrukturni logovi. Poruka i ime igrača nisu deo URL-a niti zahteva koji aplikacija šalje Vercelu.',
    ],
  },
  {
    heading: 'Izbor jezika',
    paragraphs: [
      'Aplikacija čuva samo izbor SR ili EN u localStorage-u, i to tek kada izričito promeniš jezik. Početno automatsko prepoznavanje jezika browsera se ne čuva.',
    ],
  },
  {
    heading: 'Ograničena pilot analitika',
    paragraphs: [
      'Koristimo Umami Cloud u EU regionu samo za analitiku sa minimizovanim podacima tokom ograničenog pilota i merenje osnovnog ponašanja proizvoda. Naša integracija ne poziva umami.identify(), ne prosleđuje korisnički Distinct ID, ne uvodi analitičke kolačiće i ne koristi reprodukciju sesije, heatmap-e niti praćenje performansi.',
      'Umami događaji mogu sadržati samo fiksni naziv događaja, jezik, fiksnu kategoriju incidenta, fiksnu vrednost pouzdanosti „high” samo za događaj predloga kategorije i, samo za dolazak na sajt, jednu od unapred dozvoljenih oznaka izvora. Ne šaljemo poruku, ime igrača, tekst presude, prekršaj, sankciju, obrazloženje, kaznu, broj slučaja, sliku, primaoca ili odredište deljenja, odgovor iz formulara, niti drugi slobodan tekst. URL query, URL hash fragment i referrer se ne šalju u našim analitičkim payload-ima.',
      'Poštujemo Do Not Track. Za analitiku sesije/lokacije, Umami ipak može iz uobičajenih mrežnih podataka i podataka browsera, kao što su IP adresa, user agent i ID sajta, izvesti tehničke informacije o sesiji ili hash. Zato sesije ne opisujemo kao apsolutno anonimne. Pilot analitiku čuvamo samo koliko je razumno potrebno da procenimo pilot, a zatim je brišemo ili svodimo na agregirane dokaze.',
      'U meri u kojoj se propisi o zaštiti podataka primenjuju, ovu ograničenu obradu sprovodimo zbog legitimnog interesa da procenimo i zaštitimo besplatni nekomercijalni pilot, uz opisane mere minimizacije i pravo na prigovor gde je primenljivo.',
    ],
  },
  {
    heading: 'Opcione povratne informacije preko Tally-ja',
    paragraphs: [
      'Link za povratne informacije vodi na Tally, odvojenog eksternog provajdera, i otvara kratak SR ili EN formular. Formular ne traži ime učesnika, email, telefon, društveni nalog, originalnu poruku, ime igrača, screenshot, audio ili video.',
      'Tally može napraviti tehničke identifikatore podnošenja (Submission) i ispitanika (Respondent) i koristiti sopstveno skladište browsera. Njegov Respondent ID može ostati u localStorage-u kroz više formulara u istom Tally workspace-u. VAR ne koristi te identifikatore da utvrdi stvarni identitet učesnika niti da pravi profil. Podacima iz formulara rukuje Tally kao eksterni provajder.',
      'Nakon što napravimo zbirne dokaze, sirove povratne informacije brišemo iz aktivnog istraživačkog skupa najkasnije 30 dana posle odluke o pilotu. Ne obećavamo brisanje iz rezervnih kopija eksternog provajdera izvan onoga što možemo da kontrolišemo.',
    ],
  },
  {
    heading: 'Međunarodni pilot i tvoja prava',
    paragraphs: [
      'Testeri mogu učestvovati iz različitih država. U zavisnosti od propisa koji se primenjuju, možeš tražiti pristup, ispravku, brisanje, ograničenje obrade ili uložiti prigovor. Pošto ne koristimo identitet i ne šaljemo sadržaj poruke u analitiku, možda nećemo moći da povežemo događaj analitike sa tobom bez prikupljanja dodatnih podataka, što nećemo raditi samo radi identifikacije zahteva.',
      `Za pitanja ili zahteve piši na ${PRIVACY_CONTACT}. Možeš se obratiti i Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti u Srbiji. Ovo nije tvrdnja da je Poverenik nadležan za svaki međunarodni slučaj.`,
    ],
  },
  {
    heading: 'Izmene obaveštenja',
    paragraphs: [
      'Ovo obaveštenje možemo ažurirati ako se promene tok podataka, provajderi ili funkcije. Datum na vrhu pokazuje poslednju izmenu.',
    ],
  },
]

const enPrivacySections: readonly LegalSection[] = [
  {
    heading: 'What the app is',
    paragraphs: [
      'VAR for Messages is a free, independent humor/parody application that turns a message into a fictional football-style VAR ruling for private sharing.',
    ],
  },
  {
    heading: 'Content that stays in the browser',
    paragraphs: [
      'The message text and optional player name are processed in your browser. We do not intentionally send them to analytics or remote storage, and the app has no message, name, or verdict-history backend.',
      'The card and PNG image are produced on your device, in the browser. You decide whether to download or share the result onward.',
    ],
  },
  {
    heading: 'Hosting',
    paragraphs: [
      'Vercel hosts the site. To serve and protect it, Vercel necessarily processes ordinary technical request and infrastructure information, which may include IP address, request time, browser/device information, and security or infrastructure logs. The app does not put your message or player name in the URL or in a request sent to Vercel.',
    ],
  },
  {
    heading: 'Language choice',
    paragraphs: [
      'The app stores only your SR or EN choice in localStorage, and only after you explicitly change the language. Initial browser-language detection is not stored.',
    ],
  },
  {
    heading: 'Limited pilot analytics',
    paragraphs: [
      'We use Umami Cloud in the EU region only for privacy-minimized analytics to evaluate the limited pilot and measure basic product behavior. Our setup does not call umami.identify(), does not supply a user Distinct ID, introduces no analytics cookies, and uses no session replay, heatmaps, or performance monitoring.',
      'Umami events may contain only a fixed event name, locale, fixed incident category, the fixed confidence value “high” only for the category-suggestion event and, for the landing event only, one pre-approved recruitment-source label. We do not send the message, player name, verdict wording, offense, sanction, explanation, penalty text, case ID, image, recipient or share destination, form answer, or any other free text. URL query string, URL hash fragment, and referrer are not sent in our analytics payloads.',
      'We respect Do Not Track. For session/location analytics, Umami may still derive technical session information or a hash from ordinary network and browser information such as IP address, user agent, and website ID. We therefore do not describe sessions as absolutely anonymous. We keep pilot analytics only as long as reasonably needed to evaluate the pilot, then delete it or reduce it to aggregate evidence.',
      'To the extent data-protection law applies, we conduct this limited processing for the legitimate interest of evaluating and securing a free, non-commercial pilot, subject to the minimization measures described here and any applicable right to object.',
    ],
  },
  {
    heading: 'Optional feedback through Tally',
    paragraphs: [
      'The feedback link opens a short SR or EN form on Tally, a separate external provider. The form does not ask for a participant name, email, phone number, social handle, original message, player name, screenshot, audio, or video.',
      'Tally may create technical Submission and Respondent identifiers and use its own browser storage. Its Respondent ID may persist in localStorage across forms in the same Tally workspace. VAR does not use those identifiers to determine a participant’s real identity or build a profile. Form data is handled by Tally as the external provider.',
      'After producing aggregate evidence, we delete raw feedback from the active research dataset within 30 days after the pilot decision. We cannot promise deletion from an external provider’s backups beyond what we control.',
    ],
  },
  {
    heading: 'International pilot and your rights',
    paragraphs: [
      'Testers may participate internationally. Depending on the law that applies, you may request access, correction, deletion, restriction, or object to processing. Because we do not use identity and do not send message content to analytics, we may be unable to connect an analytics event to you without collecting more data; we will not collect extra data solely to identify a request.',
      `For privacy questions or requests, email ${PRIVACY_CONTACT}. You may also contact the Serbian Commissioner for Information of Public Importance and Personal Data Protection. This does not claim that the Commissioner has jurisdiction over every international case.`,
    ],
  },
  {
    heading: 'Changes to this notice',
    paragraphs: [
      'We may update this notice if data flows, providers, or features change. The date at the top shows the latest update.',
    ],
  },
]

const srTermsSections: readonly LegalSection[] = [
  {
    heading: 'Priroda usluge',
    paragraphs: [
      'VAR presude su humoristički/parodijski rezultati, a ne činjenični nalazi, stručne procene ili zvanične sportske odluke. VAR for Messages je besplatan eksperimentalni pilot; funkcije se mogu promeniti ili usluga može biti obustavljena. Ne uvodimo komercijalne uslove, plaćanje, oglase ili sponzorstvo.',
    ],
  },
  {
    heading: 'Tvoj izbor i deljenje',
    paragraphs: [
      'Ti biraš unos i kontrolišeš svako dalje deljenje. Kontekst je važan i nije svaka šala primerena svakoj osobi. Koristi samo poruke i sadržaj koji smeš da koristiš i deliš. Ne otkrivaj osetljive, intimne, identifikujuće ili na drugi način privatne podatke druge osobe.',
      'Obična nepristojna ili vulgarna poruka nije zabranjena samo zato što je nepristojna, ali ne sme biti deo štetne ili nezakonite upotrebe navedene ispod.',
    ],
  },
  {
    heading: 'Zabranjena upotreba',
    paragraphs: [
      'Ne koristi aplikaciju za sledeće:',
    ],
    items: [
      'pretnje, uznemiravanje, ciljano zlostavljanje, proganjanje ili doxxing;',
      'ucenu, iznudu, prevaru, obmanu ili lažno predstavljanje;',
      'ozbiljne klevetničke optužbe predstavljene kao činjenice ili tvrdnje o krivičnom delu;',
      'medicinske ili psihološke dijagnoze;',
      'diskriminatorno zlostavljanje na osnovu zaštićenih ličnih svojstava;',
      'seksualno ponižavanje ili intimni sadržaj bez pristanka;',
      'otkrivanje privatnih kontakt, finansijskih, medicinskih ili pravnih podataka;',
      'neprimeren sadržaj koji uključuje maloletnike;',
      'drugi nezakonit sadržaj ili nezakonitu svrhu.',
    ],
  },
  {
    heading: 'Odgovornost i zakonska prava',
    paragraphs: [
      'Odgovoran/na si za sadržaj koji unosiš, kontekst u kome koristiš rezultat i način na koji ga deliš. Eksperimentalna usluga može biti nedostupna ili sadržati greške.',
      'Ništa u ovim uslovima ne isključuje niti ograničava zakonska prava ili odgovornost koja se po važećem pravu ne može isključiti ili ograničiti.',
    ],
  },
  {
    heading: 'Nezavisnost i kontakt',
    paragraphs: [
      `Aplikacijom upravlja ${OPERATOR_NAME} iz Srbije. VAR for Messages nije povezan sa FIFA, UEFA, IFAB, fudbalskim savezima, ligama, klubovima ili televizijskim emiterima. Za pitanja piši na ${PRIVACY_CONTACT}.`,
    ],
  },
]

const enTermsSections: readonly LegalSection[] = [
  {
    heading: 'Nature of the service',
    paragraphs: [
      'VAR rulings are humorous/parodic outputs, not factual findings, professional assessments, or official sports decisions. VAR for Messages is a free experimental pilot; features may change or the service may be stopped. These terms introduce no commercial terms, payment, advertising, or sponsorship.',
    ],
  },
  {
    heading: 'Your input and sharing choices',
    paragraphs: [
      'You choose the input and control every onward share. Context matters, and not every joke is appropriate for every recipient. Use only messages and content you are entitled to use and share. Do not disclose sensitive, intimate, identifying, or otherwise private information about another person.',
      'Ordinary rude or profane input is not prohibited merely for being rude, but it must not form part of a harmful or unlawful use listed below.',
    ],
  },
  {
    heading: 'Prohibited uses',
    paragraphs: ['Do not use the app for:'],
    items: [
      'threats, harassment, targeted abuse, stalking, or doxxing;',
      'blackmail, extortion, fraud, deception, or impersonation;',
      'serious defamatory accusations presented as fact or claims of criminal conduct;',
      'medical or psychological diagnosis;',
      'discriminatory abuse based on protected characteristics;',
      'sexual degradation or non-consensual intimate content;',
      'exposing private contact, financial, medical, or legal information;',
      'inappropriate content involving minors;',
      'any other illegal content or unlawful purpose.',
    ],
  },
  {
    heading: 'Responsibility and statutory rights',
    paragraphs: [
      'You remain responsible for the content you enter, the context in which you use the output, and how you share it. The experimental service may be unavailable or contain errors.',
      'Nothing in these terms excludes or restricts statutory rights or responsibility that applicable law does not allow to be excluded or restricted.',
    ],
  },
  {
    heading: 'Independence and contact',
    paragraphs: [
      `The app is operated by ${OPERATOR_NAME} in Serbia. VAR for Messages is not affiliated with FIFA, UEFA, IFAB, any football association, league, club, or broadcaster. Questions may be sent to ${PRIVACY_CONTACT}.`,
    ],
  },
]

export const legalCopyByLocale = {
  sr: {
    footerLabel: 'Pravne informacije i povratne informacije',
    privacyLink: 'Privatnost',
    termsLink: 'Uslovi korišćenja',
    contactLink: 'Kontakt',
    noticesLink: 'Obaveštenja trećih strana',
    feedbackLink: 'Povratne informacije',
    affiliation:
      'VAR for Messages je nezavisna humoristička/parodijska aplikacija. Nije povezana sa FIFA, UEFA, IFAB, fudbalskim savezima, ligama, klubovima ili televizijskim emiterima.',
    close: 'Zatvori',
    controllerLabel: 'Rukovalac / operator',
    countryLabel: 'Država',
    country: 'Srbija',
    contactLabel: 'Kontakt za privatnost',
    privacy: {
      title: 'Obaveštenje o privatnosti',
      updated: 'Poslednje ažuriranje: 19. avgust 2026.',
      intro:
        'Ovo obaveštenje važi za trenutni besplatni, nekomercijalni udaljeni pilot aplikacije VAR for Messages.',
      sections: srPrivacySections,
      commissionerLink: 'Zvanični sajt Poverenika',
    },
    terms: {
      title: 'Uslovi korišćenja i prihvatljiva upotreba',
      updated: 'Poslednje ažuriranje: 19. avgust 2026.',
      intro:
        'Korišćenjem trenutnog besplatnog pilota prihvataš ova kratka pravila korišćenja.',
      sections: srTermsSections,
    },
  },
  en: {
    footerLabel: 'Legal information and feedback',
    privacyLink: 'Privacy',
    termsLink: 'Terms of use',
    contactLink: 'Contact',
    noticesLink: 'Third-party notices',
    feedbackLink: 'Feedback',
    affiliation:
      'VAR for Messages is an independent humor/parody application. It is not affiliated with FIFA, UEFA, IFAB, any football association, league, club, or broadcaster.',
    close: 'Close',
    controllerLabel: 'Controller / operator',
    countryLabel: 'Country',
    country: 'Serbia',
    contactLabel: 'Privacy contact',
    privacy: {
      title: 'Privacy Notice',
      updated: 'Last updated: 19 August 2026',
      intro:
        'This notice applies to the current free, non-commercial remote pilot of VAR for Messages.',
      sections: enPrivacySections,
      commissionerLink: 'Official website of the Serbian Commissioner',
    },
    terms: {
      title: 'Terms and Acceptable Use',
      updated: 'Last updated: 19 August 2026',
      intro:
        'By using the current free pilot, you agree to these short rules of use.',
      sections: enTermsSections,
    },
  },
} as const satisfies Readonly<Record<Locale, LegalCopy>>
