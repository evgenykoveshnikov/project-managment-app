import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchIssues,
  getUsers,
  openEditTaskDialog,
} from '@/store/slices/issuesSlice';
import { useMemo, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BoardListItem, TaskDataForEdit } from '@/api/issues/types';
import { fetchBoards } from '@/store/slices/boardsSlice';
import { TaskStatusEnum } from '@/components/form/schemas/taskSchema';
import { ITask } from '@/api/boards/types';
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@radix-ui/react-select';
import { Select, SelectItem } from '../../components/ui/select';
import { X } from 'lucide-react';

export const IssuesPage = () => {
  const { items: tasks, status: tasksStatus } = useAppSelector(
    (state) => state.issues
  );
  const { items: boards, status: boardsStatus } = useAppSelector(
    (state) => state.boards
  );
  const { assigneesStatus } = useAppSelector((state) => state.issues);
  const dispatch = useAppDispatch();
  const isSubmittingForm = tasksStatus === 'loading';

  const [statusFilter, setStatusFilter] = useState<string>('');
  const [boardFilter, setBoardFilter] = useState<string>('');
  const [titleSearch, setTitleSearch] = useState<string>('');
  const [assigneeSearch, setAssigneeSerach] = useState<string>('');

  const statusOptions = [...TaskStatusEnum.options];

  const resolveBoardId = (task: ITask) => {
    if (task.boardId === 0) {
      return boards.find((board) => board.name === task.boardName)?.id;
    }
  };

  useEffect(() => {
    if (tasksStatus === 'idle') {
      dispatch(fetchIssues());
    }

    if (boardsStatus === 'idle') {
      dispatch(fetchBoards());
    }

    if (assigneesStatus === 'idle') {
      dispatch(getUsers());
    }
  }, [dispatch, boardsStatus, assigneesStatus, tasksStatus]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (statusFilter && task.status !== statusFilter) {
        return false;
      }

      const numericBoardFilter = boardFilter ? parseInt(boardFilter, 10) : null;
      const taskBoardId = resolveBoardId(task);
      if (numericBoardFilter !== null && taskBoardId !== numericBoardFilter) {
        if (taskBoardId === undefined)
          console.warn(`Could not determine boardId ${task.id}`);
        return false;
      }

      if (
        titleSearch &&
        !task.title.toLowerCase().includes(titleSearch.toLowerCase())
      ) {
        return false;
      }

      if (
        assigneeSearch &&
        !task.assignee?.fullName
          .toLowerCase()
          .includes(assigneeSearch.toLowerCase())
      ) {
        if (!task.assignee) return false;

        return false;
      }

      return true;
    });
  }, [tasks, statusFilter, boardFilter, titleSearch, assigneeSearch, resolveBoardId]);

  const openCreateDialog = () => {
    dispatch(openEditTaskDialog(null));
  };

  const openEditDialog = (task: ITask) => {
    const correctedBoardId = Number(resolveBoardId(task));

    const taskForEditing: TaskDataForEdit = {
      id: task.id,
      title: task.title,
      description: task.description,
      boardId: correctedBoardId,
      boardName: task.boardName,
      priority: task.priority,
      status: task.status,
      assignee: task.assignee,
    };

    dispatch(openEditTaskDialog(taskForEditing));
  };

  const boardListItem: BoardListItem[] = boards.map((b) => ({
    id: b.id,
    name: b.name,
  }));

  const resetBoardFilter = () => {
    setBoardFilter('');
  };

  const resetStausFilter = () => {
    setStatusFilter('');
  };

  const areFilteredActive = !!boardFilter;
  const areFilteredStatusActive = !!statusFilter;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex  justify-between   px-4 py-4  flex-shrink-0 shadow-xs z-1">
        <div className="flex gap-4">
          <Input
            placeholder="Поиск по названию... "
            value={titleSearch}
            onChange={(e) => setTitleSearch(e.target.value)}
            className="max-w-sm border-1 border-gray-100 text-slate-500 focus-visible:ring-1 ring-gray-300 hover:opacity-70"
          />
          <Input
            placeholder="Поиск по исполнителю..."
            value={assigneeSearch}
            onChange={(e) => setAssigneeSerach(e.target.value)}
            className="max-w-sm border-1 border-gray-100 text-slate-500 focus-visible:ring-1 ring-gray-300 hover:opacity-70"
          />
        </div>
        <div className="flex flex-row gap-4 ">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className=" max-w-sm  border-1 rounded-sm cursor-pointer p-2 border-slate-100 hover:opacity-70 text-slate-500 active:ring-0">
              <SelectValue placeholder="Фильтр по статусу" className="" />
            </SelectTrigger>
            {areFilteredStatusActive && (
              <Button
                variant={'ghost'}
                size={'icon'}
                onClick={resetStausFilter}
                title="убрать"
              >
                <X className="h-4 w-4 stroke-slate-400" />
              </Button>
            )}
            <SelectContent
              className="w-auto bg-white rounded-md focus:outline-none focus-visible:outline-none focus:ring-0 shadow-sm focus:border-transparent"
              position="popper"
              side="bottom"
            >
              {statusOptions.map((status) => (
                <SelectItem
                  key={status}
                  value={status}
                  className="text-slate-500 hover:bg-gray-200"
                >
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={boardFilter} onValueChange={setBoardFilter}>
            <SelectTrigger className="max-w-sm p-2 cursor-pointer border-1 rounded-sm border-slate-100 text-slate-500 hover:opacity-70">
              <SelectValue placeholder="Фильтр по доске" />
            </SelectTrigger>
            {areFilteredActive && (
              <Button
                variant={'ghost'}
                size={'icon'}
                onClick={resetBoardFilter}
                title="убрать"
                className="fill-sky-600"
              >
                <X className="h-4 w-4 stroke-slate-400" />
              </Button>
            )}
            <SelectContent
              className="bg-white opacity-100 w-auto  shadow-sm rounded-md"
              position="popper"
            >
              {boardListItem.map((board) => (
                <SelectItem
                  key={board.id}
                  value={String(board.id)}
                  className="text-slate-500 hover:bg-gray-200 z-50"
                >
                  {board.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mb-4 flex-grow overflow-y-auto min-h-0 -z-0">
        <ScrollArea className="p-4 ">
          {filteredTasks.map((task) => (
            <Card
              key={task.id}
              className=" mb-4 cursor-pointer border-0 shadow-md bg-slate-100 "
              onClick={() => openEditDialog(task)}
            >
              <CardHeader>
                <CardTitle className="items-center">
                  {task.title} |{' '}
                  <span className="text-sm font-normal items-center">
                    {task.status}
                  </span>
                </CardTitle>
                <CardDescription>Проект: {task.boardName}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </ScrollArea>
      </div>
      <div className="flex justify-end flex-shrink-0 px-4 pb-4">
        <Button
          size={'lg'}
          variant="default"
          onClick={openCreateDialog}
          className="hover:bg-red-300"
        >
          {isSubmittingForm ? 'Загрузка...' : 'Создать задачу'}
        </Button>
      </div>
    </div>
  );
};
