import React, { useState, useEffect, useCallback } from 'react'
import { Avatar, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core'
import { translate } from 'react-i18next'
import classNames from 'classnames'
import { convertImageToFile } from 'utils'
import { ReactComponent as PersonAvatars } from 'common/assets/icons/personAvatars.svg'
import Popup from 'components/Popup'

const avatars = [
  require('common/assets/icons/avatars/person1.png'),
  require('common/assets/icons/avatars/person2.png'),
  require('common/assets/icons/avatars/person3.png'),
  require('common/assets/icons/avatars/person4.png'),
  require('common/assets/icons/avatars/person5.png'),
  require('common/assets/icons/avatars/person6.png'),
  require('common/assets/icons/avatars/person7.png'),
  require('common/assets/icons/avatars/person8.png'),
  require('common/assets/icons/avatars/person9.png'),
  require('common/assets/icons/avatars/person10.png'),
  require('common/assets/icons/avatars/person11.png'),
  require('common/assets/icons/avatars/person12.png')
]

const styles = ({ palette, type }) => ({
  marginBottom40: {
    marginBottom: '40px'
  },
  addProfileImageHeader: {
    marginBottom: '20px'
  },
  addProfileImageHeaderText: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: palette[type].pages.users.addUser.titles.color
  },
  avatar: {
    width: 45,
    height: 45,

    cursor: 'pointer'
  },
  scaleAvatar: {
    // transform: 'scale(4)'
  },
  selected: {
    boxShadow: '0 0 0 4px green',
    padding: '4px'
  },
  icon: {
    // color: '#0379bb',
    height: 'inherit',
    width: 'inherit'
  },
  avatarsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gridColumnGap: '10px',
    gridRowGap: '20px'
  }
})

const ProfileImage = ({ className, onChange, name, classes, t }) => {
  const [selected, setSelected] = useState(null)

  const convertAndUploadAvatar = useCallback(async path => {
    const file = await convertImageToFile(path, 'image/png')
    onChange({ target: { name, value: file } })
    //eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (avatars[selected]) {
      convertAndUploadAvatar(avatars[selected])
    }
    //eslint-disable-next-line
  }, [selected])

  return (
    <section className={classNames(classes.marginBottom40, className)}>
      <header className={classes.addProfileImageHeader}>
        <Typography className={classes.addProfileImageHeaderText}>
          {t('Profile Image')}
        </Typography>
      </header>
      <PersonAvatars style={{ display: 'none' }} />
      <div className={classes.avatarsContainer}>
        {avatars.map((src, index) => (
          <Popup
            arrow={false}
            key={`avatar-${index}`}
            position="bottom center"
            trigger={
              <Avatar
                src={src}
                className={classNames(classes.avatar, {
                  [classes.selected]: selected === index
                })}
                onClick={() => setSelected(index)}
                alt=""
              />
            }
            contentStyle={{
              padding: 15,
              animation: 'fade-in 200ms'
            }}
            offsetY={5}
            overlayStyle={{
              left: 10
            }}
          >
            <img src={src} className={classes.scaleAvatar} alt="" />
          </Popup>
        ))}
      </div>
    </section>
  )
}

export default translate('translations')(withStyles(styles)(ProfileImage))
