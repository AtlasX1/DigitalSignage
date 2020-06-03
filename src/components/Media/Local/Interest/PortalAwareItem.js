import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class PortalAwareItem extends Component {
  render() {
    const { provided, snapshot, portal, children } = this.props
    const usePortal = snapshot.isDragging

    const child = (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
      >
        {children}
      </div>
    )

    if (!usePortal) {
      return child
    }

    return ReactDOM.createPortal(child, portal)
  }
}

export default PortalAwareItem
