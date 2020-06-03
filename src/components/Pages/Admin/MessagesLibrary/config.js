import {
  clearResponseInfo as clearResponseEmailTemplate,
  getItems as getEmailTemplate
} from 'actions/emailTemplateActions'

import {
  clearResponseInfo as clearResponseCustomEmailTemplate,
  getItems as getCustomEmailTemplate
} from 'actions/customEmailTemplateActions'
import { CUSTOM_EMAIL_TEMPLATE, EMAIL_TEMPLATE } from 'constants/library'

const moreActionOptions = [
  {
    value: EMAIL_TEMPLATE,
    label: 'Predefined'
  },
  {
    value: CUSTOM_EMAIL_TEMPLATE,
    label: 'Special'
  },
  {
    value: 'emailTemplateLog',
    label: 'Log'
  }
]

const groupActions = {
  emailTemplate: {
    clearResponseInfo: clearResponseEmailTemplate,
    getItems: getEmailTemplate
  },
  customEmailTemplate: {
    getItems: getCustomEmailTemplate,
    clearResponseInfo: clearResponseCustomEmailTemplate
  }
}

export { moreActionOptions, groupActions }
