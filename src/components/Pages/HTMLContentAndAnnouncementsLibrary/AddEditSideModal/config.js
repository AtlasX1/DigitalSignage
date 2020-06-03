import {
  postItem as postAnnouncement,
  putItem as putAnnouncement,
  getItemById as getAnnouncement
} from 'actions/announcementActions'

import {
  postItem as postHTMLContent,
  putItem as putHTMLContent,
  getItemById as getHTMLContent
} from 'actions/htmlContentActions'
import * as Yup from 'yup'
import { ANNOUNCEMENT, HTML_CONTENT } from 'constants/library'
import {
  imageValidateSchema,
  requiredImageValidateSchema
} from 'constants/validations'

const groupActions = {
  [ANNOUNCEMENT]: {
    getItemById: getAnnouncement,
    putItem: putAnnouncement,
    postItem: postAnnouncement
  },
  [HTML_CONTENT]: {
    getItemById: getHTMLContent,
    putItem: putHTMLContent,
    postItem: postHTMLContent
  }
}

const commonFields = {
  name: Yup.string().required('Please enter field'),
  categoryId: Yup.string().required('Please enter field'),
  thumbUri: requiredImageValidateSchema
}

const groupValidationSchema = {
  [ANNOUNCEMENT]: {
    add: Yup.object().shape({
      ...commonFields,
      orientation: Yup.string().required('Please enter field')
    }),
    edit: Yup.object().shape({
      ...commonFields,
      thumbUri: imageValidateSchema,
      orientation: Yup.string().required('Please enter field')
    })
  },
  [HTML_CONTENT]: {
    add: Yup.object().shape({
      ...commonFields
    }),
    edit: Yup.object().shape({
      ...commonFields,
      thumbUri: imageValidateSchema
    })
  }
}

export { groupActions, groupValidationSchema }
