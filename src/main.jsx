import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // Sadece App çağırılıyor
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />  {/* Router BURADA YOK, çünkü App.jsx içinde var */}
  </React.StrictMode>,
)