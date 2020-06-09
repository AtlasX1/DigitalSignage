import headerLogo from 'common/icons/xhibit-logo-dark.svg'
import headerLogoLight from 'common/icons/xhibit-logo-light.svg'

const fallbackValues = {
  id: 1,
  name: 'XhibitSignage',
  windowTitle: 'XhibitSignage',
  headerLogo,
  headerLogoLight,
  footerLogo:
    'https://v3dev.xhibitsignage.com/assets/wlprofile/1/settings/RC9DWrZNtjRG6uFzykJzktcU4ANlWTHfNL6HVl2u.png',
  sso: { google: true, facebook: true, microsoft: true, linkedin: true },
  loginBackgroundImage: {
    night: [
      'assets/wlprofile/1/settings/lwmxL5b6DXN6eLhbUnjqAosTgMgG812Lw2ZMnVQT.jpeg',
      'assets/wlprofile/1/settings/YUProXWZtx2UbnmiSk9GY1e8rOx0FVDJpboLYA8S.jpeg'
    ],
    morning: [
      'assets/wlprofile/1/settings/cMaAUTp4CRpgojSiNrQFuTiRjkAacfoBenIaI4oa.jpeg',
      'assets/wlprofile/1/settings/RwuLr96o8qlPRokkQp6ToZqZhRWBoCiPKMgHVpF4.jpeg'
    ],
    afternoon: [
      'assets/wlprofile/1/settings/S6mwPpmJc73vZ31hn9Pvn0Xv1MF9nAe1iwlRIsMR.jpeg',
      'assets/wlprofile/1/settings/4moI9J5tXDMywJFkCqZNQ35rnvwAZ0SKMLMzPNqh.jpeg'
    ]
  },
  ipRestriction: null,
  ipWhitelist: null,
  copyrightText: '© Mvix(USA), Inc. All rights reserved',
  helpPage: 'https://support.mvixusa.com',
  aboutPage: {
    link: 'http://mvixdigitalsignage.com/about-us/',
    text: '',
    preferred: 'link'
  },
  privacyPolicy: {
    link: 'http://mvixdigitalsignage.com/privacy-policy/',
    text: '',
    preferred: 'link'
  },
  termsCondition: {
    link: 'http://mvixdigitalsignage.com/terms-of-use/',
    text: '',
    preferred: 'link'
  }
}

export default {
  fallbackValues
}
