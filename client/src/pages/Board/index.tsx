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
      console.log(selectedBoard)
    }
  }, [id, dispatch])
   
  const boardName = location.state.name


  return <h1 className="font-semibold text-2xl">
    {boardName}
  </h1>
  };