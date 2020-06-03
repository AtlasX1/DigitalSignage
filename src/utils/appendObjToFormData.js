import isObject from 'lodash/isObject'

const appendObjToFormData = (formData, fieldName, value) => {
  Object.keys(value).forEach(key => {
    if (isObject(value[key])) {
      appendObjToFormData(formData, key, value[key])
    } else {
      formData.append(`${fieldName}[${key}]`, value[key])
    }
  })
}

export default appendObjToFormData
