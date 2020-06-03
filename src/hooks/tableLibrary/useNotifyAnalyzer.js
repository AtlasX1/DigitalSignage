import { useEffect } from 'react'
import { notificationAnalyzer } from 'utils'

const useNotifyAnalyzer = (
  fetcher = f => f,
  cleaner = f => f,
  showSnackbar = f => f,
  closeSnackbar = f => f,
  keyWord = '',
  watchArray = []
) => {
  useEffect(() => {
    const wasNotify = notificationAnalyzer(
      showSnackbar,
      watchArray,
      keyWord,
      closeSnackbar
    )

    if (wasNotify) {
      cleaner()
      fetcher()
    }
    // eslint-disable-next-line
  }, watchArray)
}

export default useNotifyAnalyzer
