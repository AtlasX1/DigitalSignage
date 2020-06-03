import React, { useCallback } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import classNames from 'classnames'
import { withStyles, Typography } from '@material-ui/core'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const styles = ({ palette, type, typography }) => {
  return {
    root: {
      border: `5px solid ${palette[type].pages.rss.addRss.upload.border}`,
      backgroundImage: palette[type].pages.rss.addRss.upload.background,
      borderRadius: '4px'
    },
    editorHeader: {
      padding: '20px 0 25px 15px',
      background: palette[type].pages.rss.addRss.upload.background,
      borderRadius: '5px'
    },
    editorHeaderText: {
      fontWeight: 'bold',
      color: palette[type].pages.rss.addRss.upload.titleColor
    },
    editorWrap: {
      fontFamily: typography.fontFamily
    },
    editorToolbarWrap: {
      border: 'none',
      backgroundColor: palette[type].pages.rss.addRss.editorToolbar.background
    },
    editor: {
      padding: '10px',
      background: palette[type].formControls.input.background,
      color: palette[type].formControls.input.color,
      borderRadius: '4px'
    },
    error: {
      color: 'red',
      fontSize: 9,
      position: 'absolute',
      left: '5px',
      bottom: '-17px'
    },
    rebBorder: {
      border: `1px solid red`
    },
    errorLabel: {
      color: 'red'
    },
    container: {
      position: 'relative',
      marginBottom: 15
    }
  }
}

const WysiwygEditor = ({
  classes,
  label,
  name,
  editorState,
  onChange = f => f,
  error,
  toolbar = {},
  touched
}) => {
  const handleChange = useCallback(
    value => {
      onChange({ target: { name, value } })
    },
    [name, onChange]
  )

  return (
    <div className={classes.container}>
      <div
        className={classNames(classes.root, {
          [classes.rebBorder]: error && touched
        })}
      >
        {label && (
          <header className={classes.editorHeader}>
            <Typography
              className={classNames(classes.editorHeaderText, {
                [classes.errorLabel]: error && touched
              })}
            >
              {label}
            </Typography>
          </header>
        )}
        <Editor
          editorState={editorState}
          // contentState={contentState}
          onEditorStateChange={handleChange}
          editorClassName={classes.editor}
          wrapperClassName={classes.editorWrap}
          toolbarClassName={classes.editorToolbarWrap}
          toolbar={{
            inline: {
              inDropdown: false,
              options: ['bold', 'italic', 'underline']
            },
            textAlign: { inDropdown: false },
            ...toolbar
          }}
        />
      </div>
      {error && touched ? (
        <Typography className={classes.error}>{error}</Typography>
      ) : null}
    </div>
  )
}

export default withStyles(styles)(WysiwygEditor)
