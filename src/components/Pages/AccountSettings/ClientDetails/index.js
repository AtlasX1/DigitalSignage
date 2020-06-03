import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core'
import { translate } from 'react-i18next'

import { Card } from '../../../Card'
import Read from './Read'
import Edit from './Edit'

const styles = ({ palette, type }) => ({
  iconClassName: {
    fontSize: '18px',
    color: palette[type].pages.accountSettings.card.iconColor
  },
  iconButton: {
    marginTop: '8px',
    marginRight: '24px'
  },
  card: {
    background: 'transparent'
  },

  detailsLoaderContainer: {
    minHeight: 344
  },

  detailRow: {
    borderBottom: `1px solid ${palette[type].pages.accountSettings.clientDetails.row.border}`
  },
  detailLabel: {
    color: '#74809a',
    lineHeight: '42px'
  },
  detailValue: {
    lineHeight: '42px',
    fontWeight: 'bold',
    color: palette[type].pages.accountSettings.clientDetails.row.valueColor
  },
  detailRowLeft: {
    paddingRight: '20px'
  },
  detailRowRight: {
    paddingLeft: '20px'
  },

  editCancelButton: {
    marginRight: 10
  },
  detailRowLast: {
    marginBottom: 10,
    borderBottom: 0
  },
  detailRowPd: {
    paddingTop: 10,
    paddingBottom: 10
  },
  inputSmallContainer: {
    width: 105
  },
  inputContainer: {
    width: 182
  }
})

const ClientDetails = ({ t, classes, data, edit, setEdit, loading }) => {
  return (
    <Card
      dropdown={false}
      grayHeader={true}
      shadow={false}
      radius={false}
      title={t('Client Details').toUpperCase()}
      iconClassName={['icon-pencil-3', classes.iconClassName].join(' ')}
      iconButtonClassName={classes.iconButton}
      rootClassName={classes.card}
      icon={!edit}
      showMenuOnHover
      onClickFunction={() => setEdit(true)}
    >
      {edit ? (
        <Edit
          classes={classes}
          data={data}
          onCancelClick={() => setEdit(false)}
        />
      ) : (
        <Read classes={classes} data={data} loading={loading} />
      )}
    </Card>
  )
}

ClientDetails.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.object,
  edit: PropTypes.bool,
  setEdit: PropTypes.func,
  loading: PropTypes.bool
}

export default translate('translations')(withStyles(styles)(ClientDetails))
