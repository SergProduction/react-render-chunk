import React, { Component } from 'react'

function oneEmmiter() {
  let state = () => {}
  return {
    subscribe: (fn) => {
      state = fn
    },
    emit: (...param) => {
      state(...param)
    },
  }
}

const emitter = oneEmmiter()

const decorateListenUpdateComponent = ReactComponent =>
class extends ReactComponent {
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.list !== this.props.list) {
      emitter.emit()
    }
    super.componentDidUpdate(prevProps, prevState)
  }
}

const chunkRender = (mapProp, ReactComponent) =>
class RenderChunk extends Component {
  static displayName = `chunkRender(${ReactComponent.displayName || ReactComponent.name || 'Component'})`
  constructor(props) {
    super(props)
    this.state = {
      param: {},
      allChunk: [],
      viewCount: 0,
      lastIndex: 0,
      scrollTopStore: [],
      directionScroll: true, // true - down, false - up
    }
    this.style = {
      overflowY: 'hidden',
      maxHeight: mapProp.height,
    }
  }

  componentWillMount = () => {
    window.addEventListener('scroll', this.controllerScroll)
    emitter.subscribe(this.chunkRender)
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.controllerScroll)
  }

  setChunks = (allChunk, viewCount) => {
    console.log('allChunk', allChunk)
    this.setState({
      param: {
        list: allChunk.slice(0, viewCount),
      },
      allChunk,
      viewCount,
      lastIndex: viewCount,
    })
  }

  chunkRender = () => {
    console.log('chunkRender')
    const { scrollTopStore, directionScroll } = this.state
    if (directionScroll) return
    const backScroll = scrollTopStore[scrollTopStore.length - 1]
    setTimeout(() => {
      window.scrollTo(document.documentElement.scrollLeft, backScroll)
    })
  }

  controllerScroll = () => {
    if (this.scrollBottom()) {
      this.nextLoad()
    }
    if (this.scrollTop()) {
      this.prevLoad()
    }
  }

  nextLoad = () => {
    const { allChunk, lastIndex, viewCount } = this.state
    console.log('nextLoad', lastIndex)
    if (lastIndex > allChunk.length - viewCount) {
      return false
    }
    const firstChunk = allChunk.slice(lastIndex - viewCount, lastIndex)
    const lastChunk = allChunk.slice(lastIndex, lastIndex + viewCount)
    const chunk = firstChunk.concat(lastChunk)
    this.setState(prev => ({
      param: {
        list: chunk,
      },
      lastIndex: lastIndex + viewCount,
      directionScroll: true,
      scrollTopStore: prev.scrollTopStore.concat(this.prevChunkHeight()),
    }))
  }

  prevLoad = () => {
    const { allChunk, lastIndex, viewCount, scrollTopStore } = this.state
    console.log('prevLoad', lastIndex)
    if (lastIndex === viewCount) {
      return false
    }
    const firstChunk = allChunk.slice(lastIndex - (viewCount * 3), lastIndex - (viewCount * 2))
    const lastChunk = allChunk.slice(lastIndex - (viewCount * 2), lastIndex - viewCount)
    const chunk = firstChunk.concat(lastChunk)
    this.setState(prev => ({
      param: {
        list: chunk,
      },
      lastIndex: lastIndex - viewCount,
      directionScroll: false,
      scrollTopStore: prev.scrollTopStore.slice(0, prev.scrollTopStore.length - 1),
    }))
  }


  scrollBottom = () => {
    const heightAll = window.document.documentElement.scrollHeight
    const heightWin = window.document.documentElement.clientHeight
    const scrollTop = window.pageYOffset
    if (window.document.body.clientHeight < heightWin) {
      return false
    }
    return heightWin + scrollTop === heightAll
  }

  scrollTop = () => {
    const scrollTop = window.pageYOffset
    return !scrollTop
  }

  scrollTopData = () => window.pageYOffset

  prevChunkHeight = () => {
    const { scrollTopStore } = this.state
    const len = scrollTopStore.length
    if (len >= 1) {
      return window.document.documentElement.scrollHeight - scrollTopStore[len - 1]
    }
    return window.document.documentElement.scrollHeight
  }

  render() {
    const { param } = this.state
    if (mapProp.height) {
      return (
        <div onScroll={this.loload} style={this.style}>
          <ReactComponent setChunks={this.setChunks} {...param} {...this.props} />
        </div>
      )
    }
    return <ReactComponent setChunks={this.setChunks} {...param} {...this.props} />
  }
}

export default (param = {}) =>
                ReactComponent =>
                chunkRender(param, decorateListenUpdateComponent(ReactComponent))
