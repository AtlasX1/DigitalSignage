import i18next from 'i18next'
import { Button } from '@material-ui/core'
import React from 'react'

const parseLabel = label => {
  switch (label) {
    case 'add':
      return 'added'
    case 'delete':
      return 'deleted'
    case 'update':
      return 'updated'
    default:
      return 'added'
  }
}
const notificationAnalyzer = (
  pusher,
  watchArray,
  keyWord,
  closeFunction = f => f
) => {
  let wasNotify = false

  watchArray.forEach(({ response, error, label }) => {
    if (response && !Array.isArray(response) && Object.keys(response).length) {
      pusher(i18next.t(`${keyWord} successfully ${parseLabel(label)}`), {
        variant: 'default',
        action: key => (
          <Button
            color="secondary"
            size="small"
            onClick={() => closeFunction(key)}
          >
            OK
          </Button>
        )
      })
      wasNotify = true
    }
    if (error && Object.keys(error).length) {
      pusher(
        `${i18next.t(`${keyWord} was not ${parseLabel(label)}`)}: ${
          error.message
        }`,
        {
          variant: 'default',
          action: key => (
            <Button
              color="secondary"
              size="small"
              onClick={() => closeFunction(key)}
            >
              OK
            </Button>
          )
        }
      )
      wasNotify = true
    }
  })

  return wasNotify
}

export default notificationAnalyzer
