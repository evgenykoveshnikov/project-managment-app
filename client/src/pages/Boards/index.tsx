import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchBoards } from '@/store/slices/boardsSlice';
import { getUsers } from '@/store/slices/issuesSlice';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export const BoardsPage = () => {
  const boards = useAppSelector((state) => state.boards.items);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchBoards())
    dispatch(getUsers());
  }, [dispatch]);

  return boards.map((item) => {
    return (
      <div
        key={item.id}
        className="bg-slate-100 mx-4 flex items-center justify-between p-6 mb-2 mt-2 rounded-lg"
      >
        <p key={item.id} className="font-medium">
          {item.name}
        </p>
        <Link
          to={`${item.id}`}
          className="font-semibold hover:bg-red-300 hover:outline-2 outline-red-300 p-2 rounded-md"
        >
          Перейти в проект
        </Link>
      </div>
    );
  });
};
