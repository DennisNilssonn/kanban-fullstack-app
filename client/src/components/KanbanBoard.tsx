import { useEffect, useState } from "react";
import axios from "axios";
import { createPortal } from "react-dom";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import ColumnContainer from "./ColumnContainer";
import TaskCard from "./TaskCard";
import { Column, Id, Task } from "../types/types";

type Props = {
  activeProjectId: Id | null;
};

function KanbanBoard({ activeProjectId }: Props) {
  const [projectName, setProjectName] = useState<string | null>(null);
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
  );

  useEffect(() => {
    if (!activeProjectId) {
      setProjectName(null);
      setColumns([]);
      setTasks([]);
      return;
    }
    fetchColumns();
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeProjectId]);

  const fetchColumns = async () => {
    if (!activeProjectId) return;
    try {
      const response = await axios.get(
        `http://localhost:3000/api/projects/${activeProjectId}`,
        {
          withCredentials: true,
        },
      );

      const project = response.data.data;
      setProjectName(project.name);
      setColumns(project.columns);
    } catch {
      sessionStorage.removeItem("isLoggedIn");
      window.location.reload();
    }
  };

  const fetchTasks = async () => {
    if (!activeProjectId) return;
    try {
      const response = await axios.get(
        `http://localhost:3000/api/tasks/${activeProjectId}/tasks`,
        {
          withCredentials: true,
        },
      );
      const dbData = response.data.data;
      setTasks(dbData);
    } catch (error) {
      sessionStorage.removeItem("isLoggedIn");
      console.error("Error fetching tasks:", error);
      window.location.reload();
    }
  };

  const updateAllTasksToDB = async () => {
    try {
      await axios.patch(
        `http://localhost:3000/api/tasks/${activeProjectId}/update-tasks`,
        tasks,
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      sessionStorage.removeItem("isLoggedIn");
      const message =
        axios.isAxiosError(error) && error.response?.data?.error
          ? error.response.data.error
          : error;
      console.error(message);
      window.location.reload();
    }
  };

  const createTask = async (columnId: Id) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/tasks/add-task`,
        {
          projectId: activeProjectId,
          columnId: columnId,
        },
        {
          withCredentials: true,
        },
      );

      fetchTasks();
    } catch (error) {
      sessionStorage.removeItem("isLoggedIn");
      console.error("Error fetching tasks:", error);
      window.location.reload();
    }
  };

  const deleteTask = async (id: Id) => {
    if (!id) return;
    try {
      await axios.delete(`http://localhost:3000/api/tasks/${id}`, {
        withCredentials: true,
      });

      fetchTasks();
    } catch (error) {
      sessionStorage.removeItem("isLoggedIn");
      console.error("Error fetching tasks:", error);
      window.location.reload();
    }
  };

  const updateTask = async (id: Id, content: string) => {
    if (!content) return;
    try {
      await axios.patch(
        `http://localhost:3000/api/tasks/${id}`,
        {
          newContent: content,
        },
        {
          withCredentials: true,
        },
      );

      fetchTasks();
    } catch (error) {
      sessionStorage.removeItem("isLoggedIn");
      console.error("Error fetching tasks:", error);
      window.location.reload();
    }
  };

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Task") {
      const activeTaskId = event.active.id;
      const task = tasks.find((task) => task._id === activeTaskId) ?? null;
      setActiveTask(task);
      return;
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveTask) return;

    if (isActiveTask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task._id === activeId);
        const overIndex = tasks.findIndex((task) => task._id === overId);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }
    const isOverAColumn = over.data.current?.type === "Column";
    if (isActiveTask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((task) => task._id === activeId);

        const updatedTasks = tasks.map((task, index) => {
          if (index === activeIndex) {
            return { ...task, columnId: overId.toString() };
          }
          return task;
        });
        return updatedTasks;
      });
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { over } = event;
    if (!over) return;

    updateAllTasksToDB();
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <header className="border-default bg-secondary flex min-h-[56px] shrink-0 items-center justify-between border-b px-4 sm:px-6">
        <h1 className="text-primary truncate text-lg font-semibold sm:text-xl">
          {activeProjectId ? (
            (projectName ?? "Loading...")
          ) : (
            <span className="text-muted">Select a project</span>
          )}
        </h1>
      </header>

      <div className="flex min-h-0 min-w-0 flex-1 justify-center overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-6">
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <div className="mx-auto grid min-h-[400px] w-full max-w-7xl grid-cols-1 gap-4 pb-4 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((col) => (
              <ColumnContainer
                key={col._id}
                column={col}
                createTask={createTask}
                tasks={tasks.filter((task) => task.columnId === col._id)}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            ))}
          </div>
          {createPortal(
            <DragOverlay>
              {activeTask && (
                <TaskCard
                  task={activeTask}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                />
              )}
            </DragOverlay>,
            document.body,
          )}
        </DndContext>
      </div>
    </div>
  );
}

export default KanbanBoard;
