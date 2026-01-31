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
      className="bg-secondary flex h-[600px] max-h-[600px] w-[310px] flex-col rounded-md"
    >
      {/* Column title */}
      <div className="text-md border-secondary bg-tertiary text-primary flex h-[60px] items-center justify-between rounded-md rounded-b-none border-4 p-3 font-bold">
        <div className="relative flex w-full items-center justify-center">
          <div
            className={`bg-secondary text-secondary absolute left-0 flex items-center justify-center rounded-full px-2 py-1 text-sm ${tasks.length >= 5 ? "text-yellow-500" : ""} ${tasks.length >= 10 ? "text-rose-500" : ""}`}
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
          className="border-secondary text-secondary hover:bg-tertiary flex items-center gap-2 rounded-md border-2 p-4 hover:text-rose-600 dark:hover:text-rose-500"
        >
          <Plus />
          Add task
        </button>
      )}
    </div>
  );
}
