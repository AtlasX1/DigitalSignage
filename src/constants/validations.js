import * as Yup from 'yup'
import { isEmpty } from 'lodash'

const requiredImageValidateSchema = Yup.mixed()
  .required('A file is required')
  .test('fileFormat', 'jpeg, jpg, and png only', value => {
    if (value) {
      return value.type
        ? ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type)
        : value.path
        ? ['.jpeg', '.jpg', '.png'].some(ext => value.path.endsWith(ext))
        : false
    }
  })
  .nullable()
const imageValidateSchema = Yup.mixed()
  .test('fileFormat', 'jpeg, jpg, png only', value => {
    return (
      isEmpty(value) ||
      typeof value === 'string' ||
      ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type)
    )
  })
  .nullable()

const requiredIconValidateSchema = Yup.mixed()
  .required('An icon is required')
  .test(
    'iconTest',
    'Please select an icon from the list.',
    value => value && value.valid
  )
  .nullable()

const iconValidateSchema = Yup.mixed()
  .required('An icon is required')
  .test(
    'iconTest',
    'Please select an icon from the list.',
    value => value && value.valid
  )
  .nullable()

export {
  requiredImageValidateSchema,
  imageValidateSchema,
  iconValidateSchema,
  requiredIconValidateSchema
}
