import { useEffect } from 'react'

const useDebugValues = values => {
  useEffect(() => {
    console.group()
    console.log(values)
    console.groupEnd()
  }, [values])
}

export default useDebugValues
