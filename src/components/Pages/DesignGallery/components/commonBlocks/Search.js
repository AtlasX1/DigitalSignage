import React from 'react'

import { InputBase, Grid } from '@material-ui/core'
import { Search as SearchIcon } from '@material-ui/icons'

import '../../styles/_search.scss'

const Search = ({ placeholder = 'Search…', onChange, value = '' }) => {
  return (
    <div className={'search'}>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
        className={'form-group'}
      >
        <Grid item xs={12} className={'search-control'}>
          <InputBase
            placeholder={placeholder}
            onChange={e => onChange(e.target.value)}
            value={value}
            classes={{
              root: 'input-base',
              input: 'form-control'
            }}
          />
        </Grid>
        <Grid item className={'search-icon'}>
          <SearchIcon className={'icon'} />
        </Grid>
      </Grid>
    </div>
  )
}
export default Search
