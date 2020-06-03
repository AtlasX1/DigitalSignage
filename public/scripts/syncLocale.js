const fs = require('fs').promises
const path = require('path')
const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3')
const { IamAuthenticator } = require('ibm-watson/auth')
const en = require('../locales/en/translations.json')

const languages = [
  {
    translations: require('../locales/ar/translations.json'),
    code: 'ar'
  },
  {
    translations: require('../locales/cs/translations.json'),
    code: 'cs'
  },
  {
    translations: require('../locales/de/translations.json'),
    code: 'de'
  },
  {
    translations: require('../locales/es/translations.json'),
    code: 'es'
  },
  {
    translations: require('../locales/fi/translations.json'),
    code: 'fi'
  },
  {
    translations: require('../locales/fr/translations.json'),
    code: 'fr'
  },
  {
    translations: require('../locales/hr/translations.json'),
    code: 'hr'
  },
  {
    translations: require('../locales/hu/translations.json'),
    code: 'hu'
  },
  {
    translations: require('../locales/id/translations.json'),
    code: 'id'
  },
  {
    translations: require('../locales/it/translations.json'),
    code: 'it'
  },
  {
    translations: require('../locales/ja/translations.json'),
    code: 'ja'
  },
  {
    translations: require('../locales/ko/translations.json'),
    code: 'ko'
  },
  {
    translations: require('../locales/lt/translations.json'),
    code: 'lt'
  },
  {
    translations: require('../locales/nl/translations.json'),
    code: 'nl'
  },
  {
    translations: require('../locales/pl/translations.json'),
    code: 'pl'
  },
  {
    translations: require('../locales/pt/translations.json'),
    code: 'pt'
  },
  {
    translations: require('../locales/ru/translations.json'),
    code: 'ru'
  },
  {
    translations: require('../locales/sv/translations.json'),
    code: 'sv'
  },
  {
    translations: require('../locales/tr/translations.json'),
    code: 'tr'
  }
]

/* *
 *
 * The script will loop over all the languages, compare which keys are not translated yet,
 * translate only those, and merge with the rest
 *
 */

const languageTranslator = new LanguageTranslatorV3({
  version: '2018-05-01',
  authenticator: new IamAuthenticator({
    apikey: process.env.WATSON_TRANSLATION_KEY
  }),
  url: process.env.WATSON_TRANSLATION_URL
})

const translateParams = (text, target) => ({
  source: 'en',
  text,
  target
})

;(async () => {
  try {
    for await (const { code, translations } of languages) {
      const mergedTranslations = { ...translations }
      const difference = Object.keys(en).filter(key => !translations[key])

      for await (const key of difference) {
        const params = translateParams(en[key], code)
        const { result } = await languageTranslator.translate(params)

        if (result.translations) {
          mergedTranslations[key] = result.translations[0].translation
          console.log(`${key} : ${mergedTranslations[key]}`)
        } else {
          console.log(`No translation for key: ${key}`)
        }
      }

      const resourcePath = path.join(__dirname, '..', 'locales', code)

      await fs.mkdir(resourcePath, { recursive: true })
      await fs.writeFile(
        path.join(resourcePath, 'translations.json'),
        JSON.stringify(mergedTranslations, null, 2)
      )

      console.log(`Successfully updated translations for language: ${code}`)
    }
  } catch (err) {
    console.log('Error: \n\n', err.message)
  }
})()
