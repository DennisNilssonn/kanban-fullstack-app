import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Trash2 } from "lucide-react";

// Types
import { Id, Task } from "../types/types";
interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

export default function TaskCard({ task, deleteTask, updateTask }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [localContent, setLocalContent] = useState(task.content);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    if (editMode) {
      updateTask(task._id, localContent);
    }
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  if (isDragging) {
    return (
      <div
        className="task relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-xl border-2 border-rose-500 bg-slate-100 p-2.5 text-left opacity-30 dark:bg-slate-900"
        ref={setNodeRef}
        style={style}
      />
    );
  }

  if (editMode) {
    return (
      <div
        className="relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-xl bg-slate-100 p-2.5 text-left hover:ring-2 hover:ring-inset hover:ring-rose-500 dark:bg-slate-900"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        <textarea
          className="h-[90%] w-full resize-none rounded border-none bg-transparent text-slate-900 focus:outline-none dark:text-slate-100"
          value={localContent}
          autoFocus
          placeholder="Enter task content..."
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              toggleEditMode();
            }
          }}
          onChange={(e) => setLocalContent(e.target.value)}
        >
          {task.content}
        </textarea>
      </div>
    );
  }

  return (
    <div
      className="task relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-xl bg-slate-100 p-2.5 text-left text-slate-900 hover:ring-2 hover:ring-inset hover:ring-rose-500 dark:bg-slate-900 dark:text-slate-100"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      <div className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content ? (
          task.content
        ) : (
          <p className="text-slate-500 dark:text-slate-400">
            Enter task content...
          </p>
        )}
      </div>
      {mouseIsOver && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded bg-slate-200 p-2 text-slate-700 opacity-60 hover:opacity-100 dark:bg-slate-800 dark:text-slate-200"
          onClick={() => {
            deleteTask(task._id);
          }}
        >
          <Trash2 />
        </button>
      )}
    </div>
  );
}
