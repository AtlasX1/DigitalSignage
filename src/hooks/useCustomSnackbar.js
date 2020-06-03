import React from 'react'

import { Button } from '@material-ui/core'

function useCustomSnackbar(t, snackbarProvider, closeFunction) {
  return function (title, buttonText = 'OK') {
    return snackbarProvider(t(title), {
      variant: 'default',
      action: key => (
        <Button
          color="secondary"
          size="small"
          onClick={() => closeFunction(key)}
        >
          {t(buttonText)}
        </Button>
      )
    })
  }
}

export default useCustomSnackbar
