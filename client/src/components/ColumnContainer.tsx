import { useMemo } from "react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";

// components
import TaskCard from "./TaskCard";
// Types
import { Column, Id, Task } from "../types/types";

// Proptypes
interface Props {
  column: Column;
  tasks: Task[];
  createTask: (columnId: Id) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

export default function ColumnContainer({
  column,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}: Props) {
  const tasksIds = useMemo(() => tasks.map((task) => task._id), [tasks]);

  const { setNodeRef } = useSortable({
    id: column._id,
    data: {
      type: "Column",
      column,
    },
    disabled: true,
  });

  return (
    <div
      ref={setNodeRef}
      className="flex h-[600px] max-h-[600px] w-[310px] flex-col rounded-md bg-slate-200 dark:bg-slate-800"
    >
      {/* Column title */}
      <div className="text-md flex h-[60px] items-center justify-between rounded-md rounded-b-none border-4 border-slate-200 bg-slate-100 p-3 font-bold text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
        <div className="relative flex w-full items-center justify-center">
          <div
            className={`absolute left-0 flex items-center justify-center rounded-full bg-slate-200 px-2 py-1 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300 ${tasks.length >= 5 ? "text-yellow-500" : ""} ${tasks.length >= 10 ? "text-rose-500" : ""}`}
          >
            {tasks.length}
          </div>
          <div>{column.title}</div>
        </div>
      </div>

      {/* Column task container */}
      <div className="flex flex-grow flex-col gap-4 overflow-y-auto overflow-x-hidden p-2">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>

      {/* Column footer */}
      {tasks.length < 5 && (
        <button
          onClick={() => {
            createTask(column._id);
          }}
          className="flex items-center gap-2 rounded-md border-2 border-slate-200 border-x-slate-200 p-4 text-slate-600 hover:bg-slate-100 hover:text-rose-600 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-rose-500"
        >
          <Plus />
          Add task
        </button>
      )}
    </div>
  );
}
