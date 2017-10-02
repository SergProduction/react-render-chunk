import React, { Component } from 'react'


const chunkRender = (mapProp = {}) => ReactComponents =>
class RenderChunk extends Component {
  constructor(props) {
    super(props)
    this.state = {
      param: {},
      allChunk: [],
      viewCount: 0,
      lastIndex: 0,
      propName: '',
      scrollTopStore: [],
    }
    window.addEventListener('scroll', (e) => {
      this.controllerScroll()
    })
    this.style = {
      overflowY: 'hidden',
      maxHeight: mapProp.height,
    }
  }

  setChunks = (allData, viewCount) => {
    const param = {}
    let allChunk = []
    let propName = ''
    Object.keys(allData).forEach((key) => {
      propName = key
      allChunk = allData[key]
      param[key] = allData[key].slice(0, viewCount)
    })

    this.setState({
      param,
      propName,
      allChunk,
      viewCount,
      lastIndex: viewCount,
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
    const { allChunk, lastIndex, viewCount, propName } = this.state
    console.log('nextLoad', lastIndex)
    const firstChunk = allChunk.slice(lastIndex - viewCount, lastIndex)
    const lastChunk = allChunk.slice(lastIndex, lastIndex + viewCount)
    const chunk = firstChunk.concat(lastChunk)
    this.setState(prev => ({
      param: {
        [propName]: chunk,
      },
      lastIndex: lastIndex + viewCount,
      scrollTopStore: prev.scrollTopStore.concat(this.scrollTopData()),
    }))
  }

  prevLoad = () => {
    const { allChunk, lastIndex, viewCount, propName, scrollTopStore } = this.state
    console.log('prevLoad', lastIndex)
    if (lastIndex === viewCount) {
      return false
    }
    const firstChunk = allChunk.slice(lastIndex - (viewCount * 3), lastIndex - (viewCount * 2))
    const lastChunk = allChunk.slice(lastIndex - (viewCount * 2), lastIndex - viewCount)
    const chunk = firstChunk.concat(lastChunk)
    const backScroll = scrollTopStore[scrollTopStore.length - 1] - 3
    this.setState(prev => ({
      param: {
        [propName]: chunk,
      },
      lastIndex: lastIndex - viewCount,
      scrollTopStore: prev.scrollTopStore.slice(0, prev.scrollTopStore.length - 1),
    }))
  }

  chunkRender = () => {
    console.log('chunkRender')
    window.scrollTo(document.body.scrollLeft, document.body.scrollHeight / 2)
  }

  scrollBottom = () => {
    const heightWin = window.document.documentElement.clientHeight
    const scrollTop = window.document.body.scrollTop
    const heightAll = window.document.documentElement.scrollHeight
    if (window.document.body.clientHeight < heightWin) {
      return false
    }
    return heightWin + scrollTop === heightAll
  }
  scrollTop = () => {
    const scrollTop = window.document.body.scrollTop
    return !scrollTop
  }

  scrollTopData = () => window.document.body.scrollTop

  render() {
    const { param } = this.state
    if (mapProp.height) {
      return (
        <div onScroll={this.loload} style={this.style}>
          <ReactComponents setChunks={this.setChunks} {...param} {...this.props} />
        </div>
      )
    }
    return <ReactComponents setChunks={this.setChunks} chunkRender={this.chunkRender} {...param} {...this.props} />
  }
}


export default chunkRender
