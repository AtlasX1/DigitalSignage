import * as types from './index'

const postData = data => ({ type: types.POST_FEEDBACK, payload: data })

const clearPostData = () => ({ type: types.CLEAR_POST_FEEDBACK })

export { postData, clearPostData }
