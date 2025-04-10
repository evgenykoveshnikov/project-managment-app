import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './normalize.css'
import { store } from './store/store.ts'
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/index.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
        </RouterProvider>
    </Provider>
  </StrictMode>,
)
