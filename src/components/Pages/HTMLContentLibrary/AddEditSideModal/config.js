import {
  postItem as postHTMLContent,
  putItem as putHTMLContent,
  getItemById as getHTMLContent
} from 'actions/htmlContentActions'
import * as Yup from 'yup'
import {
  imageValidateSchema,
  requiredImageValidateSchema
} from 'constants/validations'

const groupActions = {
  getItemById: getHTMLContent,
  putItem: putHTMLContent,
  postItem: postHTMLContent
}

const commonFields = {
  name: Yup.string().required('Please enter field'),
  categoryId: Yup.string().required('Please enter field'),
  thumbUri: requiredImageValidateSchema
}

const groupValidationSchema = {
  add: Yup.object().shape({
    ...commonFields
  }),
  edit: Yup.object().shape({
    ...commonFields,
    thumbUri: imageValidateSchema
  })
}

export { groupActions, groupValidationSchema }
