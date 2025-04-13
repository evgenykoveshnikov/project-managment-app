import { ITask } from "@/api/boards/types";
import { TaskDataForEdit } from "@/api/issues/types";
import { Kanban } from "@/components/Kanban";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchBoards, fetchById } from "@/store/slices/boardsSlice";
import { closeTaskDialog, getUsers, openEditTaskDialog } from "@/store/slices/issuesSlice";
import { useEffect, useReducer, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";

interface BoardTask {
  task: ITask;
}

export const BoardPage = ({task}: BoardTask) => {
  const { id } = useParams()
  const dispatch = useAppDispatch();
  const { selectedBoard, items: allBoards } = useAppSelector((state) => state.boards)
  const [searchParams, setSearchParams] = useSearchParams();

  const taskId = searchParams.get('openTask');
  const boardMeta = allBoards.find(board => board.id === Number(id))?.name


  useEffect(() => {
    if(id) {
      dispatch(fetchById(id))
      dispatch(fetchBoards())
    }
  }, [id, dispatch])

  useEffect(() => {
    dispatch(getUsers())
  }, [dispatch])

  useEffect(() => {
    if (taskId && selectedBoard && selectedBoard.tasks) {
      const taskToEdit = selectedBoard.tasks.find(task => task.id === Number(taskId));
      console.log("taskToEdit", taskToEdit)

      if (taskToEdit) {
        const taskData: TaskDataForEdit = {
          id: taskToEdit.id,
          title: taskToEdit.title,
          description: taskToEdit.description,
          priority: taskToEdit.priority,
          status: taskToEdit.status,
          assignee: taskToEdit.assignee,
          boardId: Number(id),
          boardName: boardMeta || '',
        };

        dispatch(openEditTaskDialog(taskData));
        setSearchParams({})  // Открываем модальное окно
      }
    }
  }, [taskId, dispatch, selectedBoard, boardMeta]); 

  
   
  

  return (
    <>
      <h1>{boardMeta}</h1>
      <Kanban tasksArr={selectedBoard.tasks || []}></Kanban>
    </>
  )
};