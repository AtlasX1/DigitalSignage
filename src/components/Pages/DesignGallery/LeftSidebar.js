import React, { useMemo, memo } from 'react'

import './styles/_leftSidebar.scss'
import CubeIcon from './components/icons/CubeIcon'
import InboxDocumentIcon from './components/icons/InboxDocumentIcon'
// import PlaylistIcon from './components/icons/PlaylistIcon'
import TextIcon from './components/icons/TextIcon'
import GradientIcon from './components/icons/GradientIcon'
import LandscapeImageIcon from './components/icons/LandscapeImageIcon'

import VerticalSidebarTabs from './components/VerticalSidebarTabs'
import CanvasBgSetting from './components/leftSidebar/tabs/BackgroundsTab'
import ShapesTab from './components/leftSidebar/tabs/ShapesTab'
import FontsTab from './components/leftSidebar/tabs/FontsTab'
import ImagesTab from './components/leftSidebar/tabs/ImagesTab'
import DesignsTab from './components/leftSidebar/tabs/DesignsTab'

const LeftSidebar = memo(() => {
  const tabsStructure = useMemo(
    () => [
      // {
      //   icon: <SearchIcon />,
      //   content: <></>
      // },
      {
        icon: <InboxDocumentIcon />,
        content: <DesignsTab />,
        tooltip: 'Designs'
      },
      // {
      //   icon: <PlaylistIcon />,
      //   content: <></>,
      //   tooltip: 'Playlists'
      // },
      {
        icon: <TextIcon />,
        content: <FontsTab />,
        tooltip: 'Fonts'
      },
      {
        icon: <GradientIcon />,
        content: <CanvasBgSetting />,
        tooltip: 'Canvas'
      },
      {
        icon: <LandscapeImageIcon />,
        content: <ImagesTab />,
        tooltip: 'Images'
      },
      {
        icon: <CubeIcon />,
        content: <ShapesTab />,
        tooltip: 'Shapes'
      }
    ],
    []
  )

  return (
    <div className={'left-sidebar'}>
      <VerticalSidebarTabs layout={tabsStructure} />
    </div>
  )
})

export default LeftSidebar
