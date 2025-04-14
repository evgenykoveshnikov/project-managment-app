import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '@/App';
import { BoardPage } from '@/pages/Board';
import { BoardsPage } from '@/pages/Boards';
import { IssuesPage } from '@/pages/Issues';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Navigate to="/boards" />,
      },
      {
        path: 'boards',
        element: <BoardsPage />,
      },
      {
        path: 'boards/:id',
        element: <BoardPage />,
      },
      {
        path: 'issues',
        element: <IssuesPage />,
      },
    ],
  },
]);
