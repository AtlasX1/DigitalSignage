const createFormDataFromArray = (formData, data, key) => {
  if ((typeof data === 'object' && data !== null) || Array.isArray(data)) {
    for (let i in data) {
      if (
        (typeof data[i] === 'object' && data[i] !== null) ||
        Array.isArray(data[i])
      ) {
        createFormDataFromArray(formData, data[i], key + '[' + i + ']')
      } else {
        formData.append(key + '[' + i + ']', data[i])
      }
    }
  } else {
    formData.append(key, data)
  }
}

const objectParamToFormData = (value, prevKey = '') => {
  const params = []
  if (Array.isArray(value)) {
    value.forEach((val, idx) =>
      params.push(...objectParamToFormData(val, `${prevKey}[${idx}]`))
    )
  } else if (typeof value === 'object') {
    Object.keys(value).forEach(key =>
      params.push(...objectParamToFormData(value[key], `${prevKey}[${key}]`))
    )
  } else {
    params.push({ key: prevKey, value })
  }
  return params
}
const convertToFormData = (values, isPUT) => {
  const formData = new FormData()
  Object.keys(values).forEach(key => {
    let value = values[key]
    if (Array.isArray(value)) {
      objectParamToFormData(value, key).forEach(({ key, value }) => {
        formData.append(key, value)
      })
      return
    }

    if (value instanceof Object && !(value instanceof Blob)) {
      value = JSON.stringify(value)
    }
    return formData.append(key, value)
  })
  if (isPUT) {
    formData.append('_method', 'PUT')
  }
  return formData
}

export { createFormDataFromArray, convertToFormData }
