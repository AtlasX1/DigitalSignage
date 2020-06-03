import { TouchApp, Subscriptions } from '@material-ui/icons'

export const playlistTypes = {
  Standard: {
    color: 'rgb(74, 130, 238)',
    icon: Subscriptions,
    title: 'Standart Playlist'
  },
  Smart: {
    color: 'rgb(80, 227, 194)',
    iconHelperClass: 'icon-lightbulb-4',
    title: 'Smart Playlist'
  },
  Interactive: {
    color: 'rgb(255, 61, 132)',
    icon: TouchApp,
    title: 'Interactive Playlist'
  }
}
