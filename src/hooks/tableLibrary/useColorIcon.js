import { useMemo } from 'react'

const useColorIcon = (...deps) =>
  useMemo(
    () => (localStorage.getItem('theme') === 'dark' ? '#5C697F' : '#afb7c7'),
    // eslint-disable-next-line
    [...deps]
  )

export default useColorIcon
