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
  state = {
    list: [],
  }

  componentDidMount() {
    setTimeout(() => { // emulate ajax
      const fakeList = new FakeData(20000)
      this.props.setChunks(fakeList.all, 10)
    }, 500)
  }

  render() {
    const { list } = this.props

    if (!list || !list.length) {
      return (<p>no data</p>)
    }

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
