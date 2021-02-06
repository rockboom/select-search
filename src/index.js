import React from 'react'
import ReactDOM from 'react-dom'
import App from './app'

const SelectSearchApp = document.createElement('div')
SelectSearchApp.id = 'select-search'
document.body.appendChild(SelectSearchApp)
ReactDOM.render(<App />, SelectSearchApp)
