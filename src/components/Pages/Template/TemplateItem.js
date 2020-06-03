import React from 'react'
import { useDrag } from 'react-dnd'

import { Grid, withStyles } from '@material-ui/core'

import { TemplateCard } from 'components/Card'
import { dndConstants } from 'constants/index'

const styles = () => ({
  templateItem: {
    paddingBottom: '30px',

    '&:nth-child(2n+1)': {
      paddingRight: '30px'
    }
  }
})

const TemplateItem = ({ classes, template }) => {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: dndConstants.templateGroupsItemTypes.TEMPLATE_ITEM,
      id: template.id
    },
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  const opacity = isDragging ? 0 : 1

  return (
    <Grid item xs={6} className={classes.templateItem} style={{ opacity }}>
      <div ref={drag}>
        <TemplateCard template={template} />
      </div>
    </Grid>
  )
}

export default withStyles(styles)(TemplateItem)
