import { NavBar } from './components/NavBar';

import { Outlet } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { GlobalTaskForm } from './components/GlobalTaskForm';

function App() {
  return (
    <div className="h-screen flex flex-col">
      <NavBar></NavBar>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      <Toaster />
      <GlobalTaskForm />
    </div>
  );
}

export default App;
