
import { NavBar } from './components/NavBar'

import { Outlet } from 'react-router-dom'


function App() {

  return (
    <div className='app'>
      <NavBar></NavBar>
      <Outlet />
    </div>
  )
}

export default App
