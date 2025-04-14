import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '../ui/dialog';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';

import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

import {
  taskFormSchema,
  TaskFormData,
  TaskPriorityEnum,
  TaskStatusEnum,
} from './schemas/taskSchema';
import type {
  TaskDataForEdit,
  BoardListItem,
  AssigneeListItem,
} from '@/api/issues/types';
import { useAppSelector } from '@/store/hooks';

interface TaskFormDialogProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: TaskDataForEdit | null;
  boardIdFromContext?: number | null;
  availableBoards: BoardListItem[];
  availableAssignees: AssigneeListItem[];
  onSubmitForm: (data: TaskFormData, isEditing: boolean) => Promise<boolean>;
  isLoading: boolean;
}

export const TaskFormDialog = ({
  children,
  isOpen,
  onClose,
  taskToEdit,
  boardIdFromContext,
  availableBoards,
  availableAssignees,
  onSubmitForm,
}: TaskFormDialogProps) => {
  const navigate = useNavigate();
  const isEditing = !!taskToEdit;
  boardIdFromContext = taskToEdit?.boardId ?? null;
  const currentBoardId = isEditing ? taskToEdit.boardId : boardIdFromContext;
  const isBoardLocked = useAppSelector((state) => state.issues.isBoardLocked);
  const location = useLocation();

  const isTasksPage = location.pathname.includes('/issues');

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      id: taskToEdit?.id,
      title: taskToEdit?.title ?? '',
      description: taskToEdit?.description ?? '',
      boardId: currentBoardId ? String(currentBoardId) : undefined,
      priority: taskToEdit?.priority ?? TaskPriorityEnum.Enum.Medium,
      status: taskToEdit?.status ?? TaskStatusEnum.Enum.Backlog,
      assigneeId: taskToEdit?.assignee
        ? String(taskToEdit.assignee.id)
        : undefined,
    },
  });

  const { isDirty } = form.formState;

  useEffect(() => {
    if (isOpen) {
      form.reset({
        id: taskToEdit?.id,
        title: taskToEdit?.title ?? '',
        description: taskToEdit?.description ?? '',
        boardId: currentBoardId ? String(currentBoardId) : undefined,
        priority: taskToEdit?.priority ?? TaskPriorityEnum.Enum.Medium,
        status: taskToEdit?.status ?? TaskStatusEnum.Enum.Backlog,
        assigneeId: taskToEdit?.assignee
          ? String(taskToEdit.assignee.id)
          : undefined,
      });
    }
  }, [taskToEdit, currentBoardId, isOpen, form]);

  const handleFormSubmit = async (data: TaskFormData) => {
    let success = false;

    try {
      success = await onSubmitForm(data, isEditing);
    } catch (error) {
      success = false;
      console.log(error);
    }

    if (success) {
      onClose();
    }
  };

  const handleGoToBoard = () => {
    if (taskToEdit?.boardId && taskToEdit.id) {
      onClose();
      navigate(`/boards/${taskToEdit.boardId}?openTask=${taskToEdit.id}`);
    }
  };

  const showGoToBoardButton = isEditing && isTasksPage;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[525px] bg-white outline-0 border-0">
        <DialogHeader className="">
          <DialogTitle>
            {isEditing ? 'Редактирование задачи' : 'Создание задачи'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Измените данные задачи'
              : 'Заполните информацию о новой задаче'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input
                      className={
                        ' border-1 border-gray-100 s focus-visible:ring-1 ring-gray-300 hover:border-gray-200'
                      }
                      placeholder="Введите название задачи"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Введите описание задачи"
                      className="resize-none border-1 border-gray-100  focus-visible:ring-1 ring-gray-300 hover:opacity-70"
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="boardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Проект</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={
                      currentBoardId ? String(currentBoardId) : undefined
                    }
                    value={field.value}
                    required={true}
                    disabled={isBoardLocked}
                  >
                    <FormControl>
                      <SelectTrigger className="text-black border-0 rounded-lg shadow-md hover:opacity-70 w-full">
                        <SelectValue placeholder="Выберите проект"></SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white rounded-lg shadow-md mt-1 overflow-hidden outline-none border-0">
                      {availableBoards.map((board) => (
                        <SelectItem
                          key={board.id}
                          value={String(board.id)}
                          className="hover:bg-slate-100"
                        >
                          {board.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Приоритет</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    required
                  >
                    <FormControl>
                      <SelectTrigger className="w-full border-0 shadow-md hover:opacity-70">
                        <SelectValue
                          className="text-slate-500"
                          placeholder="Выберите приоритет"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border-0 outline-none">
                      {TaskPriorityEnum.options.map((priority) => (
                        <SelectItem
                          key={priority}
                          value={priority}
                          className="hover:bg-slate-100"
                        >
                          {priority} {/* Используем значения Enum напрямую */}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Статус *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    required
                  >
                    <FormControl>
                      <SelectTrigger className="w-full border-0 shadow-md hover:opacity-70">
                        <SelectValue placeholder="Выберите статус" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white outline-none border-0">
                      {TaskStatusEnum.options.map((status) => (
                        <SelectItem
                          key={status}
                          value={status}
                          className="hover:bg-slate-100"
                        >
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="assigneeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Исполнитель</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    required={true}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full border-0 shadow-md hover:opacity-70">
                        <SelectValue placeholder="Выберите исполнителя " />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-white border-0 outline-none">
                      {availableAssignees.map((assignee) => (
                        <SelectItem
                          key={assignee.id}
                          value={String(assignee.id)}
                          className="hover:bg-slate-100"
                        >
                          {assignee.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="sm:justify-between pt-4">
              <div>
                {showGoToBoardButton && (
                  <Button
                    type="button"
                    size={'lg'}
                    variant={'outline'}
                    onClick={handleGoToBoard}
                    className='border-0 outline-0 hover:bg-red-300'
                  >
                    перейти на доску
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <DialogClose asChild></DialogClose>
                <Button
                  size="lg"
                  type="submit"
                  disabled={form.formState.isSubmitting || !isDirty}
                  className="hover:bg-red-300"
                >
                  {isEditing ? 'Обновить' : 'Создать'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
