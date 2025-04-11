
import { NavBar } from './components/NavBar'

import { Outlet } from 'react-router-dom'


function App() {

  return (
    <div className='h-screen flex flex-col'>
      <NavBar></NavBar>
      <main className='flex-1 overflow-auto'>
        <Outlet />
      </main>
      
    </div>
  )
}

export default App
