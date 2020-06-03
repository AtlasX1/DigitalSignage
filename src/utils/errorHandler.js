const errorHandler = ({ response }) => {
  const error = {
    code: 400,
    message: 'Oops.. Something went wrong',
    errors: [],
    errorFields: []
  }

  if (response) {
    error.code = response.status
    error.message = response.data.message

    if (response.data.errors) {
      const { errors } = response.data
      Object.values(errors).map(e => error.errors.push(e))
      Object.keys(errors).map(e =>
        error.errorFields.push({ name: e, value: errors[e] })
      )
    }
  }

  return error
}

export default errorHandler
