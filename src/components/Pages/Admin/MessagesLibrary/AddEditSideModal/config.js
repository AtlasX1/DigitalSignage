import { CUSTOM_EMAIL_TEMPLATE, EMAIL_TEMPLATE } from 'constants/library'
import {
  getItemById as getEmailTemplate,
  putItem as putEmailTemplate
} from 'actions/emailTemplateActions'
import {
  getItemById as getCustomEmailTemplate,
  putItem as putCustomEmailTemplate,
  postItem as postCustomEmailTemplate
} from 'actions/customEmailTemplateActions'

const groupActions = {
  [EMAIL_TEMPLATE]: {
    getItemById: getEmailTemplate,
    putItem: putEmailTemplate
  },
  [CUSTOM_EMAIL_TEMPLATE]: {
    getItemById: getCustomEmailTemplate,
    putItem: putCustomEmailTemplate,
    postItem: postCustomEmailTemplate
  }
}

export { groupActions }
