import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import EdgeLab from './components/EdgeLab/EdgeLab'
import './styles/globals.css'

const RootComponent = window.location.pathname === '/lab' ? EdgeLab : App

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>,
)
