import React, { useCallback, useState } from 'react'
import Select from 'react-select'
import { InputLabel } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const countries = [
  { value: 'af', label: 'Afghanistan' },
  { value: 'al', label: 'Albania' },
  { value: 'dz', label: 'Algeria' },
  { value: 'as', label: 'American Samoa' },
  { value: 'ad', label: 'Andorra' },
  { value: 'ao', label: 'Angola' },
  { value: 'ai', label: 'Anguilla' },
  { value: 'ag', label: 'Antigua and Barbuda' },
  { value: 'ar', label: 'Argentina' },
  { value: 'am', label: 'Armenia' },
  { value: 'aw', label: 'Aruba' },
  { value: 'au', label: 'Australia' },
  { value: 'at', label: 'Austria' },
  { value: 'az', label: 'Azerbaijan' },
  { value: 'bs', label: 'Bahamas' },
  { value: 'bh', label: 'Bahrain' },
  { value: 'bd', label: 'Bangladesh' },
  { value: 'bb', label: 'Barbados' },
  { value: 'by', label: 'Belarus' },
  { value: 'be', label: 'Belgium' },
  { value: 'bz', label: 'Belize' },
  { value: 'bj', label: 'Benin' },
  { value: 'bm', label: 'Bermuda' },
  { value: 'bt', label: 'Bhutan' },
  { value: 'bo', label: 'Bolivia' },
  { value: 'ba', label: 'Bosnia and Herzegovina' },
  { value: 'bw', label: 'Botswana' },
  { value: 'br', label: 'Brazil' },
  { value: 'io', label: 'British Indian Ocean Territory' },
  { value: 'vg', label: 'British Virgin Islands' },
  { value: 'bn', label: 'Brunei' },
  { value: 'bg', label: 'Bulgaria' },
  { value: 'bf', label: 'Burkina Faso' },
  { value: 'bi', label: 'Burundi' },
  { value: 'kh', label: 'Cambodia' },
  { value: 'cm', label: 'Cameroon' },
  { value: 'ca', label: 'Canada' },
  { value: 'cv', label: 'Cape Verde' },
  { value: 'bq', label: 'Caribbean Netherlands' },
  { value: 'ky', label: 'Cayman Islands' },
  { value: 'cf', label: 'Central African Republic' },
  { value: 'td', label: 'Chad' },
  { value: 'cl', label: 'Chile' },
  { value: 'cn', label: 'China' },
  { value: 'cx', label: 'Christmas Island' },
  { value: 'cc', label: 'Cocos' },
  { value: 'co', label: 'Colombia' },
  { value: 'km', label: 'Comoros' },
  { value: 'cd', label: 'Congo' },
  { value: 'cg', label: 'Congo' },
  { value: 'ck', label: 'Cook Islands' },
  { value: 'cr', label: 'Costa Rica' },
  { value: 'ci', label: 'Côte d’Ivoire' },
  { value: 'hr', label: 'Croatia' },
  { value: 'cu', label: 'Cuba' },
  { value: 'cw', label: 'Curaçao' },
  { value: 'cy', label: 'Cyprus' },
  { value: 'cz', label: 'Czech Republic' },
  { value: 'dk', label: 'Denmark' },
  { value: 'dj', label: 'Djibouti' },
  { value: 'dm', label: 'Dominica' },
  { value: 'do', label: 'Dominican Republic' },
  { value: 'ec', label: 'Ecuador' },
  { value: 'eg', label: 'Egypt' },
  { value: 'sv', label: 'El Salvador' },
  { value: 'gq', label: 'Equatorial Guinea' },
  { value: 'er', label: 'Eritrea' },
  { value: 'ee', label: 'Estonia' },
  { value: 'et', label: 'Ethiopia' },
  { value: 'fk', label: 'Falkland Islands' },
  { value: 'fo', label: 'Faroe Islands' },
  { value: 'fj', label: 'Fiji' },
  { value: 'fi', label: 'Finland' },
  { value: 'fr', label: 'France' },
  { value: 'gf', label: 'French Guiana' },
  { value: 'pf', label: 'French Polynesia' },
  { value: 'ga', label: 'Gabon' },
  { value: 'gm', label: 'Gambia' },
  { value: 'ge', label: 'Georgia' },
  { value: 'de', label: 'Germany' },
  { value: 'gh', label: 'Ghana' },
  { value: 'gi', label: 'Gibraltar' },
  { value: 'gr', label: 'Greece' },
  { value: 'gl', label: 'Greenland' },
  { value: 'gd', label: 'Grenada' },
  { value: 'gp', label: 'Guadeloupe' },
  { value: 'gu', label: 'Guam' },
  { value: 'gt', label: 'Guatemala' },
  { value: 'gg', label: 'Guernsey' },
  { value: 'gn', label: 'Guinea' },
  { value: 'gw', label: 'Guinea-Bissau' },
  { value: 'gy', label: 'Guyana' },
  { value: 'ht', label: 'Haiti' },
  { value: 'hn', label: 'Honduras' },
  { value: 'hk', label: 'Hong Kong' },
  { value: 'hu', label: 'Hungary' },
  { value: 'is', label: 'Iceland' },
  { value: 'in', label: 'India' },
  { value: 'id', label: 'Indonesia' },
  { value: 'ir', label: 'Iran' },
  { value: 'iq', label: 'Iraq' },
  { value: 'ie', label: 'Ireland' },
  { value: 'im', label: 'Isle of Man' },
  { value: 'il', label: 'Israel' },
  { value: 'it', label: 'Italy' },
  { value: 'jm', label: 'Jamaica' },
  { value: 'jp', label: 'Japan' },
  { value: 'je', label: 'Jersey' },
  { value: 'jo', label: 'Jordan' },
  { value: 'kz', label: 'Kazakhstan' },
  { value: 'ke', label: 'Kenya' },
  { value: 'ki', label: 'Kiribati' },
  { value: 'xk', label: 'Kosovo' },
  { value: 'kw', label: 'Kuwait' },
  { value: 'kg', label: 'Kyrgyzstan' },
  { value: 'la', label: 'Laos' },
  { value: 'lv', label: 'Latvia' },
  { value: 'lb', label: 'Lebanon' },
  { value: 'ls', label: 'Lesotho' },
  { value: 'lr', label: 'Liberia' },
  { value: 'ly', label: 'Libya' },
  { value: 'li', label: 'Liechtenstein' },
  { value: 'lt', label: 'Lithuania' },
  { value: 'lu', label: 'Luxembourg' },
  { value: 'mo', label: 'Macau' },
  { value: 'mk', label: 'Macedonia' },
  { value: 'mg', label: 'Madagascar' },
  { value: 'mw', label: 'Malawi' },
  { value: 'my', label: 'Malaysia' },
  { value: 'mv', label: 'Maldives' },
  { value: 'ml', label: 'Mali' },
  { value: 'mt', label: 'Malta' },
  { value: 'mh', label: 'Marshall Islands' },
  { value: 'mq', label: 'Martinique' },
  { value: 'mr', label: 'Mauritania' },
  { value: 'mu', label: 'Mauritius' },
  { value: 'yt', label: 'Mayotte' },
  { value: 'mx', label: 'Mexico' },
  { value: 'fm', label: 'Micronesia' },
  { value: 'md', label: 'Moldova' },
  { value: 'mc', label: 'Monaco' },
  { value: 'mn', label: 'Mongolia' },
  { value: 'me', label: 'Montenegro' },
  { value: 'ms', label: 'Montserrat' },
  { value: 'ma', label: 'Morocco' },
  { value: 'mz', label: 'Mozambique' },
  { value: 'mm', label: 'Myanmar' },
  { value: 'na', label: 'Namibia' },
  { value: 'nr', label: 'Nauru' },
  { value: 'np', label: 'Nepal' },
  { value: 'nl', label: 'Netherlands' },
  { value: 'nc', label: 'New Caledonia' },
  { value: 'nz', label: 'New Zealand' },
  { value: 'ni', label: 'Nicaragua' },
  { value: 'ne', label: 'Niger' },
  { value: 'ng', label: 'Nigeria' },
  { value: 'nu', label: 'Niue' },
  { value: 'nf', label: 'Norfolk Island' },
  { value: 'kp', label: 'North Korea' },
  { value: 'mp', label: 'Northern Mariana Islands' },
  { value: 'no', label: 'Norway' },
  { value: 'om', label: 'Oman' },
  { value: 'pk', label: 'Pakistan' },
  { value: 'pw', label: 'Palau' },
  { value: 'ps', label: 'Palestine' },
  { value: 'pa', label: 'Panama' },
  { value: 'pg', label: 'Papua New Guinea' },
  { value: 'py', label: 'Paraguay' },
  { value: 'pe', label: 'Peru' },
  { value: 'ph', label: 'Philippines' },
  { value: 'pl', label: 'Poland' },
  { value: 'pt', label: 'Portugal' },
  { value: 'pr', label: 'Puerto Rico' },
  { value: 'qa', label: 'Qatar' },
  { value: 're', label: 'Réunion' },
  { value: 'ro', label: 'Romania' },
  { value: 'ru', label: 'Russia' },
  { value: 'rw', label: 'Rwanda' },
  { value: 'bl', label: 'Saint Barthélemy' },
  { value: 'sh', label: 'Saint Helena' },
  { value: 'kn', label: 'Saint Kitts and Nevis' },
  { value: 'lc', label: 'Saint Lucia' },
  { value: 'mf', label: 'Saint Martin' },
  { value: 'pm', label: 'Saint Pierre and Miquelon' },
  { value: 'vc', label: 'Saint Vincent and the Grenadines' },
  { value: 'ws', label: 'Samoa' },
  { value: 'sm', label: 'San Marino' },
  { value: 'st', label: 'São Tomé and Príncipe' },
  { value: 'sa', label: 'Saudi Arabia' },
  { value: 'sn', label: 'Senegal' },
  { value: 'rs', label: 'Serbia' },
  { value: 'sc', label: 'Seychelles' },
  { value: 'sl', label: 'Sierra Leone' },
  { value: 'sg', label: 'Singapore' },
  { value: 'sx', label: 'Sint Maarten' },
  { value: 'sk', label: 'Slovakia' },
  { value: 'si', label: 'Slovenia' },
  { value: 'sb', label: 'Solomon Islands' },
  { value: 'so', label: 'Somalia' },
  { value: 'za', label: 'South Africa' },
  { value: 'kr', label: 'South Korea' },
  { value: 'ss', label: 'South Sudan' },
  { value: 'es', label: 'Spain' },
  { value: 'lk', label: 'Sri Lanka' },
  { value: 'sd', label: 'Sudan' },
  { value: 'sr', label: 'Suriname' },
  { value: 'sj', label: 'Svalbard and Jan Mayen' },
  { value: 'sz', label: 'Swaziland' },
  { value: 'se', label: 'Sweden' },
  { value: 'ch', label: 'Switzerland' },
  { value: 'sy', label: 'Syria' },
  { value: 'tw', label: 'Taiwan' },
  { value: 'tj', label: 'Tajikistan' },
  { value: 'tz', label: 'Tanzania' },
  { value: 'th', label: 'Thailand' },
  { value: 'tl', label: 'Timor-Leste' },
  { value: 'tg', label: 'Togo' },
  { value: 'tk', label: 'Tokelau' },
  { value: 'to', label: 'Tonga' },
  { value: 'tt', label: 'Trinidad and Tobago' },
  { value: 'tn', label: 'Tunisia' },
  { value: 'tr', label: 'Turkey' },
  { value: 'tm', label: 'Turkmenistan' },
  { value: 'tc', label: 'Turks and Caicos Islands' },
  { value: 'tv', label: 'Tuvalu' },
  { value: 'vi', label: 'U.S. Virgin Islands' },
  { value: 'ug', label: 'Uganda' },
  { value: 'ua', label: 'Ukraine' },
  { value: 'ae', label: 'United Arab Emirates' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
  { value: 'uy', label: 'Uruguay' },
  { value: 'uz', label: 'Uzbekistan' },
  { value: 'vu', label: 'Vanuatu' },
  { value: 'va', label: 'Vatican City' },
  { value: 've', label: 'Venezuela' },
  { value: 'vn', label: 'Vietnam' },
  { value: 'wf', label: 'Wallis and Futuna' },
  { value: 'eh', label: 'Western Sahara' },
  { value: 'ye', label: 'Yemen' },
  { value: 'zm', label: 'Zambia' },
  { value: 'zw', label: 'Zimbabwe' },
  { value: 'ax', label: 'Åland Islands' }
]

let theme = {}

const containerStyles = themeData => {
  theme = themeData
  return {
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      position: 'relative'
    },
    label: {
      fontSize: 16,
      color: theme.palette[theme.type].formControls.label.color
    },
    labelFocused: {
      color: `${
        theme.palette[theme.type].formControls.label.activeColor
      } !important`
    }
  }
}

const selectStyles = {
  container: (provided, state) => ({
    ...provided,
    width: '100%',
    fontFamily: [
      'Nunito Sans',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
      'Apple Color Emoji',
      'Segoe UI Emoji',
      'Segoe UI Symbol'
    ].join(','),
    zIndex: 2,
    fontSize: 14,
    borderRadius: 4,
    cursor: 'pointer',
    marginTop: theme.spacing.unit * 1,
    marginBottom: theme.spacing.unit * 2,
    borderColor: state.isFocused ? '#80bdff' : '#000',
    boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0,123,255,.25)' : 'none',
    transition:
      'border-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
  }),
  control: (provided, state) => ({
    ...provided,
    '&:hover': {},
    cursor: 'pointer',
    boxShadow: 'none',
    color: theme.palette[theme.type].formControls.label.color,
    backgroundColor: theme.palette[theme.type].formControls.input.background,
    border: `1px solid ${
      state.isFocused
        ? '#80bdff'
        : theme.palette[theme.type].formControls.input.border
    }`
  }),
  menuList: provided => ({
    ...provided,
    color: theme.palette[theme.type].formControls.input.color,
    backgroundColor: theme.palette[theme.type].formControls.input.background
  }),
  menu: provided => ({
    ...provided,
    borderColor: theme.palette[theme.type].formControls.input.border,
    overflow: 'hidden'
  }),
  placeholder: provided => ({
    ...provided,
    color: theme.palette[theme.type].formControls.label.color
  }),
  input: provided => ({
    ...provided,
    color: theme.palette[theme.type].formControls.label.color
  }),
  indicatorSeparator: provided => ({
    ...provided,
    backgroundColor: theme.palette[theme.type].formControls.input.border
  }),
  dropdownIndicator: provided => ({
    ...provided,
    color: theme.palette[theme.type].formControls.label.color,
    '&:hover': {
      color: theme.palette[theme.type].formControls.input.border
    }
  }),
  singleValue: provided => ({
    ...provided,
    color: theme.palette[theme.type].formControls.label.color
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: theme.palette[theme.type].formControls.input.background,
    color: state.isSelected
      ? '#047abc'
      : theme.palette[theme.type].formControls.input.color,
    background: state.isFocused && '#047abc10',
    cursor: 'pointer',
    '&:hover': {
      background: '#047abc10'
    },
    '&:active': {
      backgroundColor: 'unset'
    }
  })
}

const getCountry = value =>
  countries.find(c => c.value === value || c.label === value)

const FormControlCountrySelect = ({
  classes,
  id = '',
  name = '',
  label = '',
  value = 'us',
  handleChange = f => f
}) => {
  const handleChangeCountry = useCallback(
    (...params) => {
      if (name) {
        handleChange({ target: { value: params[0].label, name } })
      } else {
        handleChange(...params)
      }
    },
    [handleChange, name]
  )

  const [focused, setFocused] = useState(false)
  return (
    <div className={classes.root}>
      <InputLabel
        shrink
        htmlFor={id}
        className={[classes.label, focused && classes.labelFocused].join(' ')}
      >
        {label}
      </InputLabel>
      <Select
        name={id}
        options={countries}
        aria-labelledby={id}
        styles={selectStyles}
        value={getCountry(value)}
        defaultValue={getCountry(value)}
        onChange={handleChangeCountry}
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
      />
    </div>
  )
}

export default withStyles(containerStyles)(FormControlCountrySelect)
