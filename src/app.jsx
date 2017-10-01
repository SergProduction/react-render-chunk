import React, { Component } from 'react'
import { render } from 'react-dom'

import TestRenderChunck from './render-chunk-test'

const App = () => <TestRenderChunck />

render(
  <App />,
  document.getElementById('root')
)

export { App }