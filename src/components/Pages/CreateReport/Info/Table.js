import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'

import {
  withStyles,
  Grid,
  Table as MatTable,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core'
import { Scrollbars } from 'components/Scrollbars'

const styles = theme => {
  const { palette, type } = theme
  return {
    container: {
      height: 'calc(100% - 289px)',
      maxHeight: 'calc(100% - 289px)',
      overflowY: 'auto',
      position: 'relative'
    },
    text: {
      fontSize: 13,
      letterSpacing: '-0.01px',
      color: '#494F5C'
    },
    textBold: {
      fontWeight: 'bold'
    },
    table: {
      position: 'relative'
    },
    head: {
      height: 37,
      position: 'relative'
    },
    headCell: {
      borderBottomColor: palette[type].pages.reports.generate.border
    },
    row: {
      height: 37
    },
    rowSmall: {
      height: 17
    },
    cell: {
      padding: 0,
      lineHeight: '37px',
      verticalAlign: 'middle',

      '&:first-child': {
        paddingLeft: 35,
        width: 183
      },

      '&:nth-child(2)': {
        width: 186
      },

      '&:nth-child(3)': {
        width: 208
      },

      '&:nth-child(4)': {
        width: 183
      },

      '&:nth-child(5)': {
        width: 92
      }
    },
    cellAutoWidth: {
      width: 'auto !important'
    },
    cellNoBorder: {
      borderBottom: 0
    },
    cellPaddingBottom: {
      paddingBottom: 12
    },
    cellSmall: {
      lineHeight: '17px',
      paddingTop: 12
    },
    icon: {
      position: 'absolute',
      right: 20,
      top: 3,
      color: '#74809A',
      fontSize: 20,
      cursor: 'pointer',
      display: 'flex',
      width: 30,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '50%',
      zIndex: 111,

      '&:hover': {
        background: 'rgba(0, 0, 0, 0.08)'
      }
    }
  }
}

const Table = ({ t, classes, autoWidth }) => {
  const [table] = useState({
    columns: [
      t('User Name'),
      t('Email'),
      t('Phone'),
      t('Time Stamp'),
      t('Status'),
      t('IP Address')
    ],
    data: [
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      },
      {
        username: 'Joshua Howard',
        email: 'beaulah_lakin@kamron.io',
        phone: '966-833-2414',
        timeStamp: '03:31AM',
        status: 'active',
        ip: '08 Jan 2019'
      }
    ]
  })

  return (
    <Grid className={classes.container}>
      <Scrollbars>
        <i className={`icon-navigation-show-more-vertical ${classes.icon}`} />
        <MatTable className={classes.table}>
          <TableHead className={classes.head}>
            <TableRow className={classes.row}>
              {table.columns.map((column, index) => (
                <TableCell
                  key={index}
                  className={[
                    classes.cell,
                    classes.text,
                    classes.textBold,
                    classes.headCell,
                    autoWidth ? classes.cellAutoWidth : ''
                  ].join(' ')}
                >
                  {column}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {table.data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={[classes.row, classes.rowSmall].join(' ')}
              >
                {Object.values(row).map((cell, index) => (
                  <TableCell
                    key={index}
                    className={[
                      classes.cell,
                      classes.cellNoBorder,
                      classes.cellSmall,
                      classes.text,
                      rowIndex === table.data.length - 1
                        ? classes.cellPaddingBottom
                        : '',
                      autoWidth ? classes.cellAutoWidth : ''
                    ].join(' ')}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </MatTable>
      </Scrollbars>
    </Grid>
  )
}

Table.propTypes = {
  classes: PropTypes.object,
  autoWidth: PropTypes.bool
}

export default translate('translations')(withStyles(styles)(Table))
