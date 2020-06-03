import React, { useState } from 'react'
import { FormControlSelect } from '../../../Form'
import {
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid
} from '@material-ui/core'

const content = [
  {
    network: 'deviantart',
    label: 'Deviantart',
    content: (
      <div>
        <Typography variant="h5">Deviantart options</Typography>
        <Typography>Deviantart provides 1 feed option:</Typography>

        <Typography variant="h6">Deviantart username</Typography>
        <Typography>
          Enter a Deviantart username with or without "@" prefix - e.g. @abcd
        </Typography>

        <Typography variant="h5">Example values</Typography>
        <Typography>
          you can provide multiple values separated with ", (comma)"like
          <b> @abcd, @...</b>
        </Typography>
      </div>
    )
  },
  {
    network: 'facebook',
    label: 'Facebook',
    content: (
      <div>
        <Typography variant="h5">Facebook options</Typography>
        <Typography>Facebook provides 4 different feed options:</Typography>

        <Typography variant="h6">Facebook Page Feed</Typography>
        <Typography>
          The feed of posts (including status updates), photos and links on this
          page. Enter the page ID with or without "@" prefix - e.g.
          @624290390999239. You can find it in your Facebook page setting tab or
          obtain it from
          <a href="http://lookup-id.com/">this website</a>
        </Typography>

        <Typography variant="h6">Facebook Group Feed</Typography>
        <Typography>
          The feed of posts (including status updates), photos and links on this
          group. Enter the group ID with "/" prefix - e.g. /7091225894. You can
          find it in your Facebook group setting tab or obtain it from
          <a href="http://lookup-id.com/">this website</a>
        </Typography>
        <Typography>
          Facebook Group Feed is deprecated in upgraded version.
        </Typography>

        <Typography variant="h6">Facebook Album/Page Photos</Typography>
        <Typography>
          Enter the album ID with "#" prefix - e.g. #947092091976094.
        </Typography>

        <Typography variant="h6">Facebook Page Videos</Typography>
        <Typography>
          Shows all videos this page is tagged in. Enter the page ID with "|"
          prefix - e.g. |624290390999239.
        </Typography>

        <Typography variant="h5">Example values</Typography>
        <Typography>
          you can provide multiple values separated with ", (comma)" like
          <b>@172148446234328, #180661078716398, @197394889304, @fabfurnish</b>
        </Typography>
      </div>
    )
  },
  {
    network: 'flickr',
    label: 'Flickr',
    content: (
      <div>
        <Typography variant="h5">Flickr options</Typography>
        <Typography>Flickr provides 2 different feed options:</Typography>

        <Typography variant="h6">Flickr User ID</Typography>
        <Typography>
          Enter a Flickr User ID with or without "@" prefix - e.g. @46221135@N04
          - You can obtain it from
          <a href="https://www.webfx.com/tools/idgettr/">this website</a>
        </Typography>

        <Typography variant="h6">Flickr Group ID</Typography>
        <Typography>
          To use a flickr group enter the group ID with "/" prefix - e.g.
          /34427465497@N01
        </Typography>

        <Typography variant="h5">Example values</Typography>
        <Typography>
          you can provide multiple values separated with ", (comma)"like
          <b>@46221135@N04, /34427465497@N01</b>
        </Typography>
      </div>
    )
  },
  {
    network: 'google',
    label: 'Google',
    content: (
      <div>
        <Typography variant="h5">Google+ options</Typography>
        <Typography>Google+ provides 1 feed option:</Typography>

        <Typography variant="h6">Google Profile ID</Typography>
        <Typography>
          Enter a Google profile ID with or without "@" prefix - e.g.
          @100590622967839416963
        </Typography>

        <Typography variant="h5">Example values</Typography>
        <Typography>
          you can provide multiple values separated with ", (comma)"like
          <b>@100590622967839416963, @110053733861296090383</b>
        </Typography>
      </div>
    )
  },
  {
    network: 'pinterest',
    label: 'Pinterest',
    content: (
      <div>
        <Typography variant="h5">Pinterest options</Typography>
        <Typography>Pinterest provides 2 different feed options:</Typography>

        <Typography variant="h6">Pinterest username</Typography>
        <Typography>
          Enter a Pinterest username with or without "@" prefix - e.g.
          @fabfurnish
        </Typography>

        <Typography variant="h6">Pinterest board</Typography>
        <Typography>
          To show a Pinterest board enter the username, then "/" followed by
          social stream name "username/board_name" with "/" prefix - e.g.
          /2013TopPins/techology-trends
        </Typography>

        <Typography variant="h5">Example values</Typography>
        <Typography>
          you can provide multiple values separated with ", (comma)" like
          <b>@fabfurnish, /2013TopPins/techology-trends</b>
        </Typography>
      </div>
    )
  },
  {
    network: 'rss',
    label: 'RSS',
    content: (
      <div>
        <Typography variant="h5">Rss options</Typography>
        <Typography>RSS provides 1 feed option:</Typography>

        <Typography variant="h6">RSS feed URL</Typography>
        <Typography>
          Enter the RSS feed URL with or without "@" prefix - e.g.
          @http://feeds.bbci.co.uk/news/world/europe/rss.xml
        </Typography>

        <Typography variant="h5">Example values</Typography>
        <Typography>
          you can provide multiple values separated with ", (comma)"like
          <b>@http://feeds.bbci.co.uk/news/world/europe/rss.xml</b>
        </Typography>
      </div>
    )
  },
  {
    network: 'soundcloud',
    label: 'SoundCloud',
    content: (
      <div>
        <Typography variant="h5">SoundCloud options</Typography>
        <Typography>SoundCloud provides 1 feed option:</Typography>

        <Typography variant="h6">SoundCloud User Tracks</Typography>
        <Typography>
          The list of tracks of the user. Enter the SoundCloud Username with or
          without "@" prefix - e.g. @mayerhawthorne
        </Typography>

        <Typography variant="h5">Example values</Typography>
        <Typography>
          you can provide multiple values separated with ", (comma)"like
          <b>@mayerhawthorne, @...</b>
        </Typography>
      </div>
    )
  },
  {
    network: 'stumbleupon',
    label: 'Stumbleupon',
    content: (
      <div>
        <Typography variant="h5">Stumbleupon options</Typography>
        <Typography>Stumbleupon provides 1 feed option:</Typography>

        <Typography variant="h6">Stumbleupon username</Typography>
        <Typography>
          Enter a Stumbleupon username with or without "@" prefix - e.g.
          @udacity
        </Typography>

        <Typography variant="h5">Example values</Typography>
        <Typography>
          you can provide multiple values separated with ", (comma)"like
          <b>@udacity, @...</b>
        </Typography>
      </div>
    )
  },
  {
    network: 'tumblr',
    label: 'Tumblr',
    content: (
      <div>
        <Typography variant="h5">Tumblr options</Typography>
        <Typography>Tumblr provides 1 feed option:</Typography>

        <Typography variant="h6">Tumblr Username</Typography>
        <Typography>
          Enter a Tumblr username with or without "@" prefix - e.g. @skiphursh
        </Typography>

        <Typography variant="h5">Example values</Typography>
        <Typography>
          you can provide multiple values separated with ", (comma)" like
          <b>@skiphursh, @comedycentral, @mcupdate</b>
        </Typography>
      </div>
    )
  },
  {
    network: 'twitter',
    label: 'Twitter',
    content: (
      <div>
        <Typography variant="h5">Twitter options</Typography>
        <Typography>Twitter provides 3 different feed options:</Typography>

        <Typography variant="h6">Twitter Username</Typography>
        <Typography>
          Enter a Twitter username with or without "@" - e.g. @fcbarcelona
        </Typography>

        <Typography variant="h6">Twitter List</Typography>
        <Typography>
          To show a Twitter list enter the list ID with "/" prefix - e.g.
          /123456
        </Typography>

        <Typography variant="h6">Search Term/Hashtag</Typography>
        <Typography>
          To search enter the search term with "#" prefix - e.g. #socialmedia
        </Typography>

        <Typography variant="h5">Example values</Typography>
        <Typography>
          you can provide multiple values separated with ", (comma)" like
          <b>@PMOIndia, @fabfurnish, #socialmedia</b>
        </Typography>
      </div>
    )
  },
  {
    network: 'vimeo',
    label: 'Vimeo',
    content: (
      <div>
        <Typography variant="h5">Vimeo options</Typography>
        <Typography>Vimeo provides 1 feed option:</Typography>

        <Typography variant="h6">Vimeo username</Typography>
        <Typography>
          Returns a list of videos uploaded by this user - Enter a YouTube
          username with or without "@" prefix - e.g. @udacity
        </Typography>

        <Typography variant="h5">Example values</Typography>
        <Typography>
          you can provide multiple values separated with ", (comma)"like
          <b>@udacity, @teamtreehouse</b>
        </Typography>
      </div>
    )
  },
  {
    network: 'vk',
    label: 'Vk',
    content: (
      <div>
        <Typography variant="h5">VK options</Typography>
        <Typography>VK provides 2 feed option:</Typography>

        <Typography variant="h6">VK Wall Domain</Typography>
        <Typography>
          Returns a list of posts on a user wall or community wall. Enter the
          user or community short address with or without "@" prefix - e.g.
          @wphelpme, ID of the user or community that owns the wall with "@"
          prefix - e.g. @id999999999
        </Typography>

        <Typography variant="h6">VK Wall Owner ID</Typography>
        <Typography>
          Returns a list of posts on a user wall or community wall. Enter the ID
          of the user or community that owns the wall. By default, current user
          ID with "/" prefix - e.g. /99999999, Use a negative value - to
          designate a community ID with "/" prefix - e.g. /-99999999
        </Typography>

        <Typography variant="h5">Example values</Typography>
        <Typography>
          you can provide multiple values separated with ", (comma)"like
          <b>@wphelpme, /-99999999</b>
        </Typography>
      </div>
    )
  },
  {
    network: 'youtube',
    label: 'YouTube',
    content: (
      <div>
        <Typography variant="h5">YouTube options</Typography>
        <Typography>Youtube provides 4 different feed options:</Typography>

        <Typography variant="h6">YouTube username</Typography>
        <Typography>
          Returns a list of videos uploaded by this user - Enter a YouTube
          username with or without "@" prefix - e.g. @udacity
        </Typography>

        <Typography variant="h6">YouTube playlist</Typography>
        <Typography>
          Returns a collection of playlist items - Enter the unique ID of the
          playlist for which you want to retrieve playlist items with "/" prefix
          - e.g. /PLsBcifUwsKVXunQPoySupBM6QCcWliTKi
        </Typography>

        <Typography variant="h6">YouTube search term</Typography>
        <Typography>
          Returns a collection of search results that match the search term
          query you specified with "#" prefix - e.g. #music
        </Typography>

        <Typography variant="h6">YouTube channel ID</Typography>
        <Typography>
          Returns a list of videos uploaded by this channel - Enter a YouTube
          channel ID with "|" prefix - e.g. |UC1yP5nx6JNEBQI3ps2XFMpz
        </Typography>

        <Typography variant="h5">Example values</Typography>
        <Typography>
          you can provide multiple values separated with ", (comma)"like
          <b>
            @udacity, /PLsBcifUwsKVXunQPoySupBM6QCcWliTKi, #music,
            |UC1yP5nx6JNEBQI3ps2XFMpz
          </b>
        </Typography>
      </div>
    )
  }
]

const SocialWallHelperDialog = props => {
  const [tab, setTab] = useState(content[0].network)

  const { isDialogOpen = false, onClose } = props

  return (
    <Dialog open={isDialogOpen} onClose={onClose} maxWidth={'md'}>
      <DialogTitle>Account Id selection help</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid item xs={12}>
            <FormControlSelect
              custom={true}
              value={tab}
              handleChange={e => setTab(e.target.value)}
              options={content.map(({ network, label }) => ({
                component: <span>{label}</span>,
                value: network
              }))}
            />
          </Grid>
          <Grid item xs={12}>
            {content.find(i => i.network === tab).content}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  )
}

export default SocialWallHelperDialog
