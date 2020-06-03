import { useEffect, useState } from 'react'
import { ipService } from 'services'

const useIpAddress = () => {
  const [ipAddress, setIpAddress] = useState(false)

  const updateIpAddress = async () => {
    const result = await ipService.getIp()
    if (result.ip) {
      setIpAddress(result.ip)
    }
  }

  useEffect(() => {
    updateIpAddress()
  }, [])

  return ipAddress
}

export default useIpAddress
