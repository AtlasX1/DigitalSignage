import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'

import { withStyles, Grid } from '@material-ui/core'

import { ColoredBoxCard } from '../../Card'

const styles = {
  cardWrapper: {
    width: 330,
    maxWidth: 330,
    marginBottom: 20
  },
  cardBlueBorder: {
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.5s',

    '&:before': {
      content: '""',
      position: 'absolute',
      width: 4,
      height: '100%',
      left: 0,
      top: 0,
      background: '#543dd3'
    }
  }
}

const TemplatesCard = ({
  t,
  info,
  classes,
  dragging,
  hoverClassName,
  draggingClassName
}) => {
  const [data, setData] = useState({ active: 0, inactive: 0 })

  useEffect(() => {
    if (info.response && info.response.template) {
      setData(info.response.template)
    }
  }, [info])
  return (
    <Grid item className={classes.cardWrapper}>
      <ColoredBoxCard
        cardTitle={t('Dashboard Card Title Templates')}
        cardMenuItems={[
          { label: t('Create New Template dashboard action'), url: '' },
          {
            label: t('Template Library dashboard action'),
            url: '/template-library/list'
          }
        ]}
        activeBoxColor={'orange'}
        activeBoxCount={data.active}
        inActiveBoxCount={data.inactive}
        cardRootClassName={[
          hoverClassName,
          dragging ? draggingClassName : ''
        ].join(' ')}
      />
    </Grid>
  )
}

TemplatesCard.propTypes = {
  draggingClassName: PropTypes.string,
  hoverClassName: PropTypes.string,
  classes: PropTypes.object,
  dragging: PropTypes.bool
}

const mapStateToProps = ({ dashboard }) => ({
  info: dashboard.info
})

export default translate('translations')(
  withStyles(styles)(connect(mapStateToProps, null)(TemplatesCard))
)
