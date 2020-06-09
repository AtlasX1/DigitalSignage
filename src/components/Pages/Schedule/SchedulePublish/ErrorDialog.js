import React from 'react'
import {
  DialogTitle,
  Typography,
  DialogContent,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableBody
} from '@material-ui/core'

import { useSelector } from 'react-redux'
import { get as _get } from 'lodash'

const ErrorDialog = () => {
  const [error] = useSelector(state => [state.schedule.scheduleItem.error])

  return (
    <>
      <DialogTitle>
        <Typography>
          {_get(error, 'data') &&
            !Array.isArray(error.data) &&
            'Error feature not allowed for device(s)'}
          {_get(error, 'data') &&
            Array.isArray(error.data) &&
            'Error schedule conflict model'}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {_get(error, 'data') &&
          !Array.isArray(error.data) &&
          Object.keys(error.data).map((key, index) => (
            <Table key={`${key}_${index}`}>
              <TableHead>
                <TableRow>
                  <TableCell>Device Name</TableCell>
                  <TableCell>Media Name</TableCell>
                  <TableCell>Media Feature</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(error.data[key]).map((errorKey, index) => (
                  <TableRow key={`${errorKey}_${index}`}>
                    <TableCell>{index === 0 && key}</TableCell>
                    <TableCell>{errorKey}</TableCell>
                    <TableCell>{error.data[key][errorKey][0]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ))}
        {_get(error, 'data') &&
          Array.isArray(error.data) &&
          error.data.map((item, index) => (
            <Table ket={`${item.schedule_name}_${index}`}>
              <TableHead>
                <TableRow>
                  <TableCell>Schedule Name</TableCell>
                  <TableCell>Schedule Id</TableCell>
                  <TableCell>Device Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{item.schedule_name}</TableCell>
                  <TableCell>{item.schedule_id}</TableCell>
                  <TableCell>{item.device_name}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ))}
      </DialogContent>
    </>
  )
}

export default ErrorDialog
