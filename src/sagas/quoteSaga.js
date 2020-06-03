import { call, put } from 'redux-saga/effects'
import * as types from '../actions'
import { quoteService } from '../services'

function* getQuotes(params) {
  try {
    const response = yield call(quoteService.getQuotes)
    yield put({
      type: types.GET_QUOTES_SUCCESS,
      response
    })
  } catch (error) {
    yield put({ type: types.GET_QUOTES_ERROR, error })
  }
}

function* postQuote(data) {
  try {
    const response = yield call(quoteService.postQuote(data))
    yield put({
      type: types.POST_QUOTE_SUCCESS,
      response
    })
  } catch (error) {
    yield put({ type: types.POST_QUOTE_ERROR, error })
  }
}

function* getQuoteCategories() {
  try {
    const response = yield call(quoteService.getQuoteCategories)
    yield put({
      type: types.GET_QUOTE_CATEGORIES_SUCCESS,
      response
    })
  } catch (error) {
    yield put({ type: types.GET_QUOTE_CATEGORIES_ERROR, error })
  }
}

export default {
  getQuotes,
  postQuote,
  getQuoteCategories
}
