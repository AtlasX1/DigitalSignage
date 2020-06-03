import i18n from '../i18n'

export const getLanguage = () => {
  const language = localStorage.getItem('language')
  return language || 'en'
}

export const setLanguage = async language => {
  await i18n.changeLanguage(language)
  localStorage.setItem('language', language)
}
