import { Kanban } from "@/components/Kanban";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchById } from "@/store/slices/boardsSlice";
import { useEffect, useReducer } from "react";
import { useLocation, useParams } from "react-router-dom";

export const BoardPage = ( ) => {
  const {id = '1'} = useParams()
  const dispatch = useAppDispatch();
  const { selectedBoard } = useAppSelector((state) => state.boards)
  const location = useLocation();

  useEffect(() => {
    if(id) {
      dispatch(fetchById(id))
    }
  }, [id, dispatch])
   
  const boardName = location.state.name


  return (
    <>
      <h1>{boardName}</h1>
      <Kanban tasksArr={selectedBoard || []}></Kanban>
    </>
  )
};