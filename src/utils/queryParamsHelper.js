const queryParamsHelper = params => {
  let queryParams = {}
  Object.keys(params).forEach(key => {
    if (params[key]) {
      queryParams[key] = params[key]
    }
  })

  return queryParams
}

export default queryParamsHelper
