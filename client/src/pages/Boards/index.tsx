import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBoards } from "@/store/slices/boardsSlice";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export const BoardsPage = () => {
    const boards = useAppSelector((state) => state.boards.item);
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchBoards())
    }, [dispatch])

    return (
        boards.map((item) => {
            return <div key={item.id} className="bg-gray-100 mx-4 flex items-center justify-between p-6 mb-2 rounded-lg">
                <p key={item.id} className="font-medium">{item.name}</p>
                <Link to={`${item.id}`} className="hover:text-red-400">Перейти в проект</Link>
            </div>
        })
    );
  };