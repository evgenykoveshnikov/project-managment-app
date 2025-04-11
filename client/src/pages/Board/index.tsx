import { Kanban } from "@/components/Kanban";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBoards, fetchById } from "@/store/slices/boardsSlice";
import { useEffect, useReducer } from "react";
import { useLocation, useParams } from "react-router-dom";

export const BoardPage = ( ) => {
  const { id } = useParams()
  const dispatch = useAppDispatch();
  const { selectedBoard, item: allBoards } = useAppSelector((state) => state.boards)




  useEffect(() => {
    if(id) {
      dispatch(fetchById(id))
      dispatch(fetchBoards())
    }
  }, [id, dispatch])
   
  const boardMeta = allBoards.find(board => board.name)
  const boardName = boardMeta?.name || 'Нет названия';

  return (
    <>
      <h1>{boardName}</h1>
      <Kanban tasksArr={selectedBoard || []}></Kanban>
    </>
  )
};