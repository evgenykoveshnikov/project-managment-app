import { NavLink } from 'react-router-dom';
import { Button } from './ui/button';
import { useAppDispatch } from '@/store/hooks';
import {
  openCreateTaskDialog,
  setBoardLocked,
} from '@/store/slices/issuesSlice';

export const NavBar = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex justify-between items-center   shadow-2xs py-4 px-4">
      <nav>
        <NavLink
          to="/issues"
          className={({ isActive }) =>
            `mr-4 text-2xl font-semibold ${isActive ? 'text-red-400' : 'text-black'} hover:text-red-400`
          }
        >
          Все задачи
        </NavLink>
        <NavLink
          to="/boards"
          className={({ isActive }) =>
            `text-2xl font-semibold ${isActive ? 'text-red-400' : 'text-black'} hover:text-red-400`
          }
        >
          Проекты
        </NavLink>
      </nav>
      <Button
        className="hover:bg-red-300"
        variant={'default'}
        size={'lg'}
        onClick={() => {
          dispatch(setBoardLocked(false));
          dispatch(openCreateTaskDialog());
        }}
      >
        Создать задачу
      </Button>
    </div>
  );
};
