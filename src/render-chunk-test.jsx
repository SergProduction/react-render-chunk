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
  componentDidUpdate() {

  }

  componentDidMount() {
    const fakeList = new FakeData(20000)
    setTimeout(() => {
      // this.setState({ list: new FakeData(100) })
      this.props.setChunks(fakeList.all, 10)
    }, 1000)
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
