import { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";

import { Id, Task } from "../types/types";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

export default function TaskCard({ task, deleteTask, updateTask }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(task.content);
  const [isHovered, setIsHovered] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: { type: "Task", task },
    disabled: isEditing,
  });

  useEffect(() => {
    setLocalContent(task.content);
  }, [task.content]);

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus();
      textareaRef.current?.select();
    }
  }, [isEditing]);

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const saveAndClose = () => {
    if (localContent.trim() !== task.content) {
      updateTask(task._id, localContent.trim() || task.content);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      saveAndClose();
    }
    if (e.key === "Escape") {
      setLocalContent(task.content);
      setIsEditing(false);
      textareaRef.current?.blur();
    }
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="task-card task-card--dragging"
      />
    );
  }

  if (isEditing) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="task-card task-card--editing"
      >
        <div className="task-card__grip" {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4" />
        </div>
        <textarea
          ref={textareaRef}
          className="task-card__textarea"
          value={localContent}
          onChange={(e) => setLocalContent(e.target.value)}
          onBlur={saveAndClose}
          onKeyDown={handleKeyDown}
          placeholder="Enter task content..."
          rows={3}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="task-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={() => setIsEditing(true)}
    >
      <div className="task-card__grip" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4" />
      </div>
      <div className="task-card__content">
        {task.content ? (
          <p className="task-card__text">{task.content}</p>
        ) : (
          <p className="task-card__placeholder">Add description...</p>
        )}
      </div>
      <div className="task-card__actions">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            deleteTask(task._id);
          }}
          className={`task-card__delete ${isHovered ? "task-card__delete--visible" : ""}`}
          aria-label="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
