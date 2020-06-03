import * as types from './index'

const getQuotesAction = params => ({
  type: types.GET_QUOTES,
  params
})

const clearGetQuotesAction = () => ({ type: types.CLEAR_GET_QUOTES_INFO })

const postQuoteAction = data => ({
  type: types.POST_QUOTE,
  data
})

const clearPostQuoteAction = () => ({ type: types.CLEAR_POST_QUOTE_INFO })

const getQuoteCategoriesAction = params => ({
  type: types.GET_QUOTE_CATEGORIES,
  params
})

const clearQuoteCategoriesAction = () => ({
  type: types.CLEAR_GET_QUOTE_CATEGORIES_INFO
})

export {
  getQuotesAction,
  clearGetQuotesAction,
  postQuoteAction,
  clearPostQuoteAction,
  getQuoteCategoriesAction,
  clearQuoteCategoriesAction
}
