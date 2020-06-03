import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: props => (props.fill ? '10px 16px' : '0 5px 20px'),
    marginBottom: props => (props.fill ? '20px' : '0px'),
    backgroundColor: props => (props.fill ? '#f5f6fa' : 'transparent')
  },
  containerIcon: {
    fontSize: '16px',
    lineHeight: '16px',
    color: '#0A83C8'
  },
  containerMsg: {
    paddingTop: '3px',
    paddingLeft: '20px',
    fontSize: '13px',
    lineHeight: '15px',
    fontFamily: [
      '"Nunito Sans"',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    color: '#74809A'
  },
  textParagraph: {
    marginTop: '20px',
    '&:first-child': {
      marginTop: 0
    }
  }
})

export const Message = ({ iconClassName, messages, fill }) => {
  const classes = useStyles({ fill })

  return (
    <div className={classes.container}>
      <div className={classes.containerIcon}>
        <i className={iconClassName} />
      </div>
      <div className={classes.containerMsg}>
        {messages.map((m, key) => {
          return (
            <div key={key} className={classes.textParagraph}>
              {m}
            </div>
          )
        })}
      </div>
    </div>
  )
}

Message.propTypes = {
  iconClassName: PropTypes.string,
  messages: PropTypes.array,
  fill: PropTypes.bool
}

Message.defaultProps = {
  iconClassName: '',
  messages: [],
  fill: false
}

export default Message
