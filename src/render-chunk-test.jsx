import React, { Component } from 'react'

import FakeData from './fake-data'
import chunkRender from './render-chunk'

const style = {
  ul: {
    listStyleType: 'none',
  },
  li: {
    border: '1px solid',
    margin: '10px',
    padding: '50px',
  },
}

class TestChunkRender extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
    }
  }

  componentDidMount() {
    const fakeList = new FakeData(100)
    setTimeout(() => {
      // this.setState({ list: new FakeData(100) })
      this.props.setChunks({ list: fakeList.all }, 10)
    }, 1000)
  }

  componentDidUpdate = (prevProps, prevState) => {
    this.props.chunkRender()
  }

  render() {
    const { list } = this.props
    if (!list || !list.length) return (<p>no data</p>)
    return (
      <ul style={style.ul}>
        {list.map(el => (
          <li key={el.id} style={style.li}>{`id ${el.id}. ${el.name}`}</li>
        ))}
      </ul>
    )
  }
}

export default chunkRender({})(TestChunkRender)
