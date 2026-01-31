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
        className="task bg-tertiary relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-xl border-2 border-rose-500 p-2.5 text-left opacity-30"
        ref={setNodeRef}
        style={style}
      />
    );
  }

  if (editMode) {
    return (
      <div
        className="card-base relative flex h-[100px] min-h-[100px] cursor-grab items-center rounded-xl text-left"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        <textarea
          className="text-primary h-[90%] w-full resize-none rounded border-none bg-transparent focus:outline-none"
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
      className="task card-base relative flex h-[100px] min-h-[100px] cursor-grab items-center text-left"
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
          <p className="text-muted">Enter task content...</p>
        )}
      </div>
      {mouseIsOver && (
        <button
          className="btn-icon absolute right-4 top-1/2 -translate-y-1/2"
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
