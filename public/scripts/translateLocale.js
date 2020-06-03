const fs = require('fs').promises
const path = require('path')
const LanguageTranslatorV3 = require('ibm-watson/language-translator/v3')
const { IamAuthenticator } = require('ibm-watson/auth')
const enTranslations = require('../locales/en/translations.json')

/* *
 *
 * Select the language that you want to translate into
 * The script will take english translations.json, go key by key, translate, and write back
 * to corresponding namespace in locales (/public/locales/{language}/translations.json)
 *
 */

const LANGUAGE = 'xx'

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
    const translations = { ...enTranslations }

    for await (const [key, value] of Object.entries(enTranslations)) {
      const params = translateParams(value, LANGUAGE)
      const { result } = await languageTranslator.translate(params)

      if (result.translations) {
        translations[key] = result.translations[0].translation
        console.log(`${key} : ${translations[key]}`)
      } else {
        console.log(`No translation for key: ${key}`)
      }
    }

    const resourcePath = path.join(__dirname, '..', 'locales', LANGUAGE)

    await fs.mkdir(resourcePath, { recursive: true })
    await fs.writeFile(
      path.join(resourcePath, 'translations.json'),
      JSON.stringify(translations, null, 2)
    )

    console.log(`Successfully translated language: ${LANGUAGE}`)
  } catch (err) {
    console.log('Error: \n\n', err.message)
  }
})()
