
import { NavBar } from './components/NavBar'

import { Outlet } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'
import { useState } from 'react'
import { GlobalTaskForm } from './components/GlobalTaskForm';


function App() { 
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const openCreateDialogFromHeader = () => {
    setIsCreateDialogOpen(true);
  }

  const closeCreateDialog = () => {
    setIsCreateDialogOpen(false);
  }

  return (
    <div className='h-screen flex flex-col'>
      <NavBar onOpenCreateDialog={openCreateDialogFromHeader}></NavBar>
      <main className='flex-1 overflow-auto'>
        <Outlet />
      </main>
      <Toaster />
      <GlobalTaskForm />
    </div>
  )
}

export default App
