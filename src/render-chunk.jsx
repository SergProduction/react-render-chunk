import React, { Component } from 'react'

/**
 * Create simple EventEmitter
 * @return {Object} EventEmitter instance
 */
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

/**
 * @param {Component} ReactComponent
 * @return {Component} React.Component
 */
const decorateListenUpdateComponent = ReactComponent => (
  class extends ReactComponent {
    componentDidUpdate(prevProps, prevState) {
      if (prevProps.list !== this.props.list) {
        emitter.emit()
      }
      if (super.componentDidUpdate) {
        super.componentDidUpdate(prevProps, prevState)
      }
    }
  }
)

const isScrollTop = () => {
  const scrollTop = window.pageYOffset
  return !scrollTop
}

const isScrollBottom = () => {
  const heightAll = window.document.documentElement.scrollHeight
  const heightWin = window.document.documentElement.clientHeight
  const scrollTop = window.pageYOffset
  if (window.document.body.clientHeight < heightWin) {
    return false
  }
  return heightWin + scrollTop === heightAll
}

// const getScrollTop = () => window.pageYOffset

const chunkRender = (mapProp = {}) => TargetComponent => (
  class RenderChunk extends Component {
    static displayName = `chunkRender(${TargetComponent.displayName || TargetComponent.name || 'Component'})`
    constructor(props) {
      super(props)
      this.state = {
        param: {},
        allChunk: [],
        viewCount: 0,
        lastIndex: 0,
        heightChunksStore: [],
        directionScroll: true, // true - down, false - up
      }
      this.style = {
        overflowY: 'hidden',
        maxHeight: mapProp.height,
      }
    }

    componentWillMount = () => {
      window.addEventListener('scroll', this.controllerScroll)
      emitter.subscribe(this.chunkRerender)
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

    chunkRerender = () => {
      console.log('chunkRender')
      const { heightChunksStore, directionScroll } = this.state
      const backScroll = heightChunksStore[heightChunksStore.length - 1]

      if (!directionScroll) {
        setTimeout(() => {
          window.scrollTo(document.documentElement.scrollLeft, backScroll)
        })
        return
      }

      if (directionScroll && isScrollBottom()) {
        console.warn('FAIL')
        setTimeout(() => {
          window.scrollTo(document.documentElement.scrollLeft, backScroll)
        })
      }
    }

    controllerScroll = () => {
      console.log('controllerScroll')
      if (isScrollBottom()) {
        this.nextLoad()
      }
      if (isScrollTop()) {
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
        heightChunksStore: prev.heightChunksStore.concat(this.prevChunkHeight()),
      }))
    }

    prevLoad = () => {
      const { allChunk, lastIndex, viewCount, heightChunksStore } = this.state
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
        heightChunksStore: prev.heightChunksStore.slice(0, prev.heightChunksStore.length - 1),
      }))
    }

    prevChunkHeight = () => {
      const { heightChunksStore } = this.state
      const len = heightChunksStore.length

      if (len >= 1) {
        return window.document.documentElement.scrollHeight - heightChunksStore[len - 1]
      }

      return window.document.documentElement.scrollHeight
    }

    render() {
      const { param } = this.state
      const props = { setChunks: this.setChunks, ...param, ...this.props }

      if (mapProp.height) {
        return (
          <div onScroll={this.controllerScroll} style={this.style}>
            <TargetComponent {...props} />
          </div>
        )
      }

      return <TargetComponent {...props} />
    }
  }
)

/**
* @param {Object} options Options for chunkRender() decorator
* @return {ReactComponent => ReactComponent} HOC for ReactComponent
*/
export default (options = {}) =>
                ReactComponent =>
                chunkRender(options)(decorateListenUpdateComponent(ReactComponent))
