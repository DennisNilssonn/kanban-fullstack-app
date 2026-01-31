import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  ArrowRight,
  ArrowLeft,
  LogOut,
  Plus,
  Trash2,
  LayoutGrid,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Project, Id } from "../types/types";

type Props = {
  onHandleProjectClick: (id: Id | null) => void;
};

export default function SideBar({ onHandleProjectClick }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<Id | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (isAddingProject) {
      inputRef.current?.focus();
    }
  }, [isAddingProject]);

  useEffect(() => {
    if (editMode) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [editMode]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/projects`, {
        withCredentials: true,
      });
      setProjects(response.data.data);
    } catch {
      sessionStorage.removeItem("isLoggedIn");
      window.location.reload();
    }
  };

  const signOut = async () => {
    try {
      await axios.post(
        `http://localhost:3000/api/logout`,
        {},
        { withCredentials: true },
      );
      sessionStorage.removeItem("isLoggedIn");
      navigate("/");
    } catch {
      sessionStorage.removeItem("isLoggedIn");
      window.location.reload();
    }
  };

  const createProject = async () => {
    const name = newProjectName.trim();
    if (!name) {
      setIsAddingProject(false);
      setNewProjectName("");
      return;
    }
    try {
      await axios.post(
        `http://localhost:3000/api/projects`,
        { name },
        { withCredentials: true },
      );
      setNewProjectName("");
      setIsAddingProject(false);
      fetchProjects();
    } catch {
      sessionStorage.removeItem("isLoggedIn");
      window.location.reload();
    }
  };

  const deleteProject = async (e: React.MouseEvent, id: Id) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:3000/api/projects/${id}`, {
        withCredentials: true,
      });
      if (activeProjectId === id) {
        onHandleProjectClick(null);
        setActiveProjectId(null);
      }
      fetchProjects();
    } catch {
      sessionStorage.removeItem("isLoggedIn");
      window.location.reload();
    }
  };

  const updateProjectName = async (id: string) => {
    const name = editValue.trim();
    if (!name || name === projects.find((p) => p._id === id)?.name) {
      setEditMode(null);
      setEditValue("");
      return;
    }
    try {
      await axios.patch(
        `http://localhost:3000/api/projects/${id}`,
        { name },
        { withCredentials: true },
      );
      setEditMode(null);
      setEditValue("");
      fetchProjects();
    } catch {
      sessionStorage.removeItem("isLoggedIn");
      window.location.reload();
    }
  };

  const handleProjectClick = (id: Id) => {
    onHandleProjectClick(id);
    setActiveProjectId(id);
  };

  const startEdit = (project: Project) => {
    setEditMode(project._id);
    setEditValue(project.name);
  };

  return (
    <aside
      className={`border-default bg-secondary flex h-full shrink-0 flex-col border-r transition-all duration-300 ease-out ${
        isSidebarOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="border-default flex min-h-[56px] items-center justify-between border-b px-3">
        {isSidebarOpen ? (
          <>
            <div className="flex items-center gap-2">
              <LayoutGrid className="text-secondary h-5 w-5" />
              <span className="text-primary font-semibold">Projects</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-secondary hover:bg-tertiary hover:text-primary rounded-md p-1.5 transition-colors"
              aria-label="Collapse sidebar"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-secondary hover:bg-tertiary hover:text-primary flex w-full justify-center rounded-md p-1.5 transition-colors"
            aria-label="Expand sidebar"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overflow-x-hidden p-3">
        {isSidebarOpen && (
          <>
            {isAddingProject ? (
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") createProject();
                    if (e.key === "Escape") {
                      setIsAddingProject(false);
                      setNewProjectName("");
                    }
                  }}
                  onBlur={createProject}
                  placeholder="Project name..."
                  className="input-sm flex-1 py-2.5 text-sm"
                />
              </div>
            ) : (
              <button
                onClick={() => setIsAddingProject(true)}
                className="text-secondary hover:bg-tertiary hover:text-primary flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left transition-colors"
              >
                <Plus className="h-4 w-4 shrink-0" />
                <span className="text-sm font-medium">New project</span>
              </button>
            )}

            <nav className="mt-2 flex flex-col gap-0.5">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className={`group flex items-center gap-2 rounded-lg transition-colors ${
                    activeProjectId === project._id
                      ? "bg-tertiary text-primary"
                      : "text-secondary hover:bg-tertiary/70 hover:text-primary"
                  }`}
                >
                  {editMode === project._id ? (
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") updateProjectName(project._id);
                        if (e.key === "Escape") {
                          setEditMode(null);
                          setEditValue("");
                        }
                      }}
                      onBlur={() => updateProjectName(project._id)}
                      onClick={(e) => e.stopPropagation()}
                      className="text-primary mx-2 my-1.5 min-w-0 flex-1 rounded border-0 bg-transparent py-1.5 text-sm outline-none ring-0 focus:ring-2 focus:ring-sky-500"
                    />
                  ) : (
                    <button
                      onClick={() => handleProjectClick(project._id)}
                      onDoubleClick={() => startEdit(project)}
                      className="min-w-0 flex-1 truncate px-3 py-2.5 text-left text-sm"
                    >
                      {project.name}
                    </button>
                  )}
                  {editMode !== project._id && (
                    <button
                      onClick={(e) => deleteProject(e, project._id)}
                      className="text-muted shrink-0 rounded p-1.5 opacity-0 transition-opacity hover:bg-rose-100 hover:text-rose-600 group-hover:opacity-100 dark:hover:bg-rose-950/50 dark:hover:text-rose-400"
                      aria-label={`Delete ${project.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </nav>
          </>
        )}

        {!isSidebarOpen && (
          <button
            onClick={() => {
              setIsSidebarOpen(true);
              setTimeout(() => setIsAddingProject(true), 100);
            }}
            className="text-secondary hover:bg-tertiary hover:text-primary mt-2 flex justify-center rounded-lg p-2"
            aria-label="New project"
          >
            <Plus className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="border-default border-t p-3">
        <button
          onClick={signOut}
          className="text-secondary hover:bg-tertiary flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2.5 transition-colors hover:text-rose-600 dark:hover:text-rose-500"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {isSidebarOpen && <span className="text-sm">Sign out</span>}
        </button>
      </div>
    </aside>
  );
}
