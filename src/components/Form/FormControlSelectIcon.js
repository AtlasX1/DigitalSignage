import FormControlInput from 'components/Form/FormControlInput'
import React, { useCallback, useMemo, useState } from 'react'
import { translate } from 'react-i18next'
import { withStyles } from '@material-ui/core'
import Popup from '../Popup'
import classNames from 'classnames'
import IconCard from 'components/Card/IconCard'

const initialIcons = [
  { name: 'icon-files-landscape-video' },
  { name: 'icon-cloud-downloading-2' },
  { name: 'icon-content-view-agenda' },
  { name: 'icon-computer-screen-1' },
  { name: 'icon-chat-bubble-circle-2' },
  { name: 'icon-slider-2' },
  { name: 'icon-playlist-2' },
  { name: 'icon-alarm' },
  { name: 'icon-bin' },
  { name: 'icon-content-note' },
  { name: 'icon-beauty-hand-mirror' },
  { name: 'icon-navigation-show-more-vertical' },
  { name: 'icon-chat-bubble-square-information-1' },
  { name: 'icon-settings-1' },
  { name: 'icon-tag-1' },
  { name: 'icon-remove-1' },
  { name: 'icon-bin-1' },
  { name: 'icon-file-office-box-doc' },
  { name: 'icon-folder-video' },
  { name: 'icon-folder-image' },
  { name: 'icon-cloudy' },
  { name: 'icon-world-wide-web' },
  { name: 'icon-rewards-trophy-2' },
  { name: 'icon-check-circle-2' },
  { name: 'icon-cog-box' },
  { name: 'icon-video-control-stop' },
  { name: 'icon-indent-increase-2' },
  { name: 'icon-network-connecting' },
  { name: 'icon-health-stethoscope' },
  { name: 'icon-content-box-4' },
  { name: 'icon-sign-disable' },
  { name: 'icon-chat-bubble-circle-3' },
  { name: 'icon-diamond' },
  { name: 'icon-sport-basketball' },
  { name: 'icon-expand-4' },
  { name: 'icon-hourglass' },
  { name: 'icon-link-broken' },
  { name: 'icon-switch-left' },
  { name: 'icon-layout-4' },
  { name: 'icon-expand-vertical-7' },
  { name: 'icon-interface-alert-circle' },
  { name: 'icon-user-add' },
  { name: 'icon-file-copy' },
  { name: 'icon-pencil-write' },
  { name: 'icon-power-button-1' },
  { name: 'icon-pencil-3' },
  { name: 'icon-all-caps' },
  { name: 'icon-angle-brackets' },
  { name: 'icon-business-graph-line-2' },
  { name: 'icon-vote-heart-favorite-star' },
  { name: 'icon-qr-code-1' },
  { name: 'icon-close-bubble' },
  { name: 'icon-sheriff-star' },
  { name: 'icon-pet-dog' },
  { name: 'icon-romance-marriage-license' },
  { name: 'icon-hurricane-1' },
  { name: 'icon-cog-play' },
  { name: 'icon-user-business-man' },
  { name: 'icon-folders' },
  { name: 'icon-cloudy-hurricane' },
  { name: 'icon-hat-1' },
  { name: 'icon-bomb' },
  { name: 'icon-home-fire' },
  { name: 'icon-smiley-sad' },
  { name: 'icon-earthquake' },
  { name: 'icon-flood' },
  { name: 'icon-adhesive-tape' },
  { name: 'icon-calendar-1' },
  { name: 'icon-cursor-dial' },
  { name: 'icon-navigation-filter-video' },
  { name: 'icon-user' },
  { name: 'icon-network-computer-2' },
  { name: 'icon-business-man' },
  { name: 'icon-box-2' },
  { name: 'icon-chat-bubbles-square' },
  { name: 'icon-interface-question-mark' },
  { name: 'icon-rewards-banner-2' },
  { name: 'icon-list-bullets-3' },
  { name: 'icon-user-group' },
  { name: 'icon-share-rss-feed' },
  { name: 'icon-add-circle-1' },
  { name: 'icon-book-shelf' },
  { name: 'icon-network-computer-1' },
  { name: 'icon-list-bullets-2' },
  { name: 'icon-video-call-conference' },
  { name: 'icon-symbol-wifi' },
  { name: 'icon-programming-html' },
  { name: 'icon-tag-lock' },
  { name: 'icon-picture-layer-2' },
  { name: 'icon-radio-2' },
  { name: 'icon-paint-palette' },
  { name: 'icon-content-drawer-2' },
  { name: 'icon-lightbulb-4' },
  { name: 'icon-playlist-3' },
  { name: 'icon-check-list' },
  { name: 'icon-hourglass-1' },
  { name: 'icon-programming-script' },
  { name: 'icon-network-check' },
  { name: 'icon-user-group-conversation' },
  { name: 'icon-file-information-2' },
  { name: 'icon-camera-flash-on' },
  { name: 'icon-calendar-timeout' },
  { name: 'icon-gauge' },
  { name: 'icon-rewards-gift' },
  { name: 'icon-files-landscape-video-1' },
  { name: 'icon-folder-video-1' },
  { name: 'icon-programming-video' },
  { name: 'icon-video-clip-3' },
  { name: 'icon-programming-video-1' },
  { name: 'icon-tag-double-1' },
  { name: 'icon-subtract-square-1' },
  { name: 'icon-add-square-1' },
  { name: 'icon-graduation-hat' },
  { name: 'icon-paint-brush-1' },
  { name: 'icon-data-download-1' },
  { name: 'icon-cursor-hand' },
  { name: 'icon-sign-dollar' },
  { name: 'icon-file-statistic-settings-1' },
  { name: 'icon-folder-new' },
  { name: 'icon-folder-question-mark' },
  { name: 'icon-text-undo' },
  { name: 'icon-text-redo' },
  { name: 'icon-arrow-backtab' },
  { name: 'icon-arrow-tab' },
  { name: 'icon-expand-horizontal-4' },
  { name: 'icon-expand-vertical-4' },
  { name: 'icon-shrink-vertical-3' },
  { name: 'icon-shrink-horizontal-3' },
  { name: 'icon-move-down-1' },
  { name: 'icon-move-right-1' },
  { name: 'icon-move-up-1' },
  { name: 'icon-move-left-1' },
  { name: 'icon-send-to-front' },
  { name: 'icon-send-to-back' },
  { name: 'icon-zoom-in' },
  { name: 'icon-zoom-out' },
  { name: 'icon-lock-2' },
  { name: 'icon-lock-1' },
  { name: 'icon-vote-star-add' },
  { name: 'icon-chat-bubble-square-image' },
  { name: 'icon-day-cloudy' },
  { name: 'icon-traffic-light-1' },
  { name: 'icon-calendar-star' },
  { name: 'icon-location-map-pin' },
  { name: 'icon-location-globe' },
  { name: 'icon-share-rss-feed-box' },
  { name: 'icon-film-roll' },
  { name: 'icon-folder-document' },
  { name: 'icon-radio-1' },
  { name: 'icon-camera-1' },
  { name: 'icon-picture-layer-3' },
  { name: 'icon-wanted-poster' },
  { name: 'icon-quote-closing' },
  { name: 'icon-cloud-image' },
  { name: 'icon-file-images-new-1' },
  { name: 'icon-business-whiteboard' },
  { name: 'icon-chat-bubble-circle-1' },
  { name: 'icon-origami-paper-bird' },
  { name: 'icon-pin-paper' },
  { name: 'icon-focus-face' },
  { name: 'icon-cloudy-hurricane-1' },
  { name: 'icon-hotel-fire-alarm' },
  { name: 'icon-smiley-frown-2' },
  { name: 'icon-flood-1' },
  { name: 'icon-bomb-1' },
  { name: 'icon-earthquake-1' },
  { name: 'icon-hurricane-2' },
  { name: 'icon-download-computer' },
  { name: 'icon-content-view-headline' },
  { name: 'icon-business-scale-2' },
  { name: 'icon-leisure-theater' },
  { name: 'icon-coins' },
  { name: 'icon-food-menu' },
  { name: 'icon-airplane' },
  { name: 'icon-rewards-trophy-5' },
  { name: 'icon-window-rss-feed' },
  { name: 'icon-audio-control-play' },
  { name: 'icon-train-tunnel-1' },
  { name: 'icon-car-4' },
  { name: 'icon-cursor-click-double-1' },
  { name: 'icon-boat-ship-1' },
  { name: 'icon-places-anchor' },
  { name: 'icon-cursor-touch-1' },
  { name: 'icon-user-hierarchy' },
  { name: 'icon-location-pin-2' },
  { name: 'icon-grid' },
  { name: 'icon-files-coding-app' },
  { name: 'icon-file-office-document' },
  { name: 'icon-christmas-tree' },
  { name: 'icon-sunny' },
  { name: 'icon-leisure-ticket-3' },
  { name: 'icon-content-newspaper-2' },
  { name: 'icon-chat-bubble-square-4' },
  { name: 'icon-alarm-clock' },
  { name: 'icon-close' },
  { name: 'icon-file-office-pdf' },
  { name: 'icon-business-graph-pie-2' },
  { name: 'icon-business-graph-bar-horizontal' },
  { name: 'icon-business-graph-bar-1' },
  { name: 'icon-file-office-xls' },
  { name: 'icon-files-coding-csv' },
  { name: 'icon-files-coding-xml' },
  { name: 'icon-business-graph-pie-2-1' },
  { name: 'icon-lock-2-1' },
  { name: 'icon-business-graph-bar-1-1' },
  { name: 'icon-business-graph-bar-horizontal-1' },
  { name: 'icon-layout-1' },
  { name: 'icon-layout-5' },
  { name: 'icon-data-upload-7' },
  { name: 'icon-data-download-7' },
  { name: 'icon-data-download-5' },
  { name: 'icon-data-upload-5' },
  { name: 'icon-interface-alert-circle-1' },
  { name: 'icon-interface-alert-diamond' },
  { name: 'icon-interface-decreasing' },
  { name: 'icon-interface-increasing' },
  { name: 'icon-interface-information-1' },
  { name: 'icon-interface-information' },
  { name: 'icon-television' },
  { name: 'icon-business-graph-line-3' },
  { name: 'icon-laptop-2' },
  { name: 'icon-books-apple' },
  { name: 'icon-vote-flag-7' },
  { name: 'icon-health-bandage' },
  { name: 'icon-travel-globe' },
  { name: 'icon-skull' },
  { name: 'icon-saxophone' },
  { name: 'icon-sport-football-helmet' },
  { name: 'icon-music-note-1' },
  { name: 'icon-headphone-pulse' },
  { name: 'icon-coffee-cup-1' },
  { name: 'icon-leisure-dj-booth' },
  { name: 'icon-christmas-snowflake' },
  { name: 'icon-organization-file-arborescence-1' },
  { name: 'icon-list-number' },
  { name: 'icon-hurricane-1-1' },
  { name: 'icon-music-album-information' },
  { name: 'icon-business-graph-bar-status' },
  { name: 'icon-business-whiteboard-graph' },
  { name: 'icon-business-graph-pie-1' },
  { name: 'icon-circle-graph-pie' },
  { name: 'icon-busniss-graph-plot' },
  { name: 'icon-business-graph-line-4' },
  { name: 'icon-business-graph-bar-vertical' },
  { name: 'icon-arrow-left-1' },
  { name: 'icon-arrow-right-1' },
  { name: 'icon-arrow-up' },
  { name: 'icon-arrow-down' },
  { name: 'icon-download-harddisk' },
  { name: 'icon-business-graph-line-1' },
  { name: 'icon-interface-alert-triangle' },
  { name: 'icon-music-note-11' },
  { name: 'icon-music-note-12' },
  { name: 'icon-vote-heart' },
  { name: 'icon-laptop-21' },
  { name: 'icon-food-bread-basket' },
  { name: 'icon-kitchen-fork-spoon' },
  { name: 'icon-rewards-medal-4' },
  { name: 'icon-search' },
  { name: 'icon-user-group-circle' },
  { name: 'icon-user-hierarchy1' },
  { name: 'icon-user-settings' },
  { name: 'icon-grid-favorite-star' },
  { name: 'icon-network-business' },
  { name: 'icon-user-lock' }
]

const styles = theme => {
  const { palette, type } = theme
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      width: 'inherit',
      position: 'relative'
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
      color: palette[type].formControls.label.color
    },
    content: {
      display: 'flex',
      flexWrap: 'wrap',
      width: '400px',
      justifyContent: 'space-around',
      height: 300,
      overflowY: 'auto'
    },
    icon: {
      margin: '10px'
    },
    iconPreview: {
      position: 'absolute',
      borderRadius: 4,
      color: palette[type].formControls.input.color,
      borderTop: `1px solid ${palette[type].formControls.input.border}`,
      borderRight: `1px solid ${palette[type].formControls.input.border}`,
      borderBottom: `1px solid ${palette[type].formControls.input.border}`,
      right: 1,
      top: 24,
      height: 38,
      width: '37px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomLeftRadius: 'unset',
      borderTopLeftRadius: 'unset',
      cursor: 'pointer'
    },
    input: {
      width: 'calc(100% - 34px)'
    },
    errorIcon: {
      borderColor: 'red',
      transition: theme.transitions.create(['border-color'])
    }
  }
}

const FormControlSelectIcons = ({
  t,
  classes,
  label,
  name,
  rootClass = '',
  value = '',
  onChange = f => f,
  error,
  touched,
  formControlLabelClass = '',
  disabled = false,
  marginBottom,
  position = 'bottom right'
}) => {
  const [suggests, setSuggests] = useState(initialIcons)
  const [isOpen, toggleOpen] = useState(false)

  const isValid = useCallback(
    value => initialIcons.some(({ name }) => name === value),
    []
  )

  const handleClick = useCallback(
    value => {
      onChange({ target: { name, value: { value, valid: isValid(value) } } })
      toggleOpen(false)
    },
    [isValid, name, onChange]
  )

  const handleOpen = useCallback(() => {
    toggleOpen(true)
  }, [])

  const handleSearch = useCallback(
    ({ target: { value: searchValue } }) => {
      setSuggests(initialIcons.filter(({ name }) => name.includes(searchValue)))

      onChange({
        target: {
          name,
          value: { value: searchValue, valid: isValid(searchValue) }
        }
      })
    },
    [isValid, name, onChange]
  )

  const handlePressEnter = useCallback(({ key }) => {
    if (key === 'Enter') {
      // handleClose()
      toggleOpen(false)
    }
  }, [])

  const renderIcon = useMemo(
    () =>
      suggests.map(({ name }) => (
        <IconCard
          key={name}
          className={classes.icon}
          icon={name}
          onClick={handleClick}
        />
      )),
    [classes.icon, handleClick, suggests]
  )

  return (
    <div className={classNames(classes.root, rootClass)}>
      <Popup
        on="click"
        position={position}
        disabled={disabled}
        open={isOpen}
        onOpen={handleOpen}
        // onClose={ handleClose }
        trigger={
          <div>
            <FormControlInput
              formControlInputRootClass={classes.input}
              formControlContainerClass={classes.inputContainer}
              label={label}
              disabled={disabled}
              value={value ? value.value : null}
              marginBottom={marginBottom}
              handleChange={handleSearch}
              error={error}
              touched={touched}
              formControlLabelClass={formControlLabelClass}
              onKeyPress={handlePressEnter}
            />
            <div
              className={classNames(
                value ? value.value : null,
                classes.iconPreview,
                {
                  [classes.errorIcon]: error && touched
                }
              )}
              style={{ top: label ? 24 : 0 }}
            />
          </div>
        }
      >
        <div className={classes.content}>{renderIcon}</div>
      </Popup>
    </div>
  )
}

export default translate('translations')(
  withStyles(styles)(FormControlSelectIcons)
)
