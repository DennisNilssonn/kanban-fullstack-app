import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowRight, ArrowLeft, LogOut, Plus, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

//Types
import { Project, Id } from "../types/types";

type Props = {
  onHandleProjectClick: (id: Id | null) => void;
};

export default function SideBar({ onHandleProjectClick }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<Id | null>(null);
  const [hoveredProjectId, setHoveredProjectId] = useState<Id | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>("");
  const [editMode, setEditMode] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/projects`, {
        withCredentials: true,
      });
      const userData = response.data.data;

      setProjects(userData);
    } catch (error) {
      sessionStorage.removeItem("isLoggedIn");
      console.error("Error fetching tasks:", error);
      window.location.reload();
    }
  };

  const signOut = async () => {
    try {
      await axios.post(
        `http://localhost:3000/api/logout`,
        {},
        {
          withCredentials: true,
        },
      );
      sessionStorage.removeItem("isLoggedIn");
      navigate("/");
    } catch (error) {
      sessionStorage.removeItem("isLoggedIn");
      console.error(error);
      window.location.reload();
    }
  };

  const handleNewProjectSubmit = async () => {
    try {
      await axios.post(
        `http://localhost:3000/api/projects`,
        { name: inputText },
        { withCredentials: true },
      );
      setInputText("");
      setIsModalOpen(false);
      fetchProjects();
    } catch (error) {
      sessionStorage.removeItem("isLoggedIn");
      console.error("Error creating project:", error);
      window.location.reload();
    }
  };

  const deleteProject = async (id: Id) => {
    try {
      await axios.delete(`http://localhost:3000/api/projects/${id}`, {
        withCredentials: true,
      });
      fetchProjects();
      onHandleProjectClick(null);
    } catch (error) {
      sessionStorage.removeItem("isLoggedIn");
      console.error("Error deleting project:", error);
      window.location.reload();
    }
  };

  const handleUpdateProjectName = async (id: string, name: string) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/projects/${id}`,
        { name },
        { withCredentials: true },
      );
      setInputText("");
      fetchProjects();
    } catch (error) {
      sessionStorage.removeItem("isLoggedIn");
      console.error("Error updating project name:", error);
      window.location.reload();
    }
  };

  return (
    <div
      className={`flex h-screen ${
        isSidebarOpen ? "w-[250px] px-7 pb-10 pt-7" : "w-14 px-3 pb-10 pt-7"
      } bg-secondary flex-col justify-between transition-all duration-300 ease-in-out`}
    >
      <div className="flex flex-col gap-10">
        <div className="text-secondary flex justify-end rounded-lg">
          {isSidebarOpen ? (
            <button
              className="hover:bg-tertiary hover:text-primary ring-hover rounded-lg px-1 py-1"
              onClick={() => setIsSidebarOpen(false)}
            >
              <ArrowLeft />
            </button>
          ) : (
            <button
              className="hover:bg-tertiary hover:text-primary ring-hover rounded-lg px-1 py-1"
              onClick={() => setIsSidebarOpen(true)}
            >
              <ArrowRight />
            </button>
          )}
        </div>
        {isSidebarOpen && (
          <>
            {!isModalOpen ? (
              <div className="animate-slideInFromLeft flex flex-col gap-4">
                <button
                  onClick={() => setIsModalOpen(!isModalOpen)}
                  className="btn-base w-full"
                >
                  New Project
                  <Plus />
                </button>
                {projects &&
                  projects.map((project) => (
                    <div
                      key={project._id}
                      className="flex items-center justify-between gap-2"
                      onMouseEnter={() => setHoveredProjectId(project._id)}
                      onMouseLeave={() => setHoveredProjectId(null)}
                    >
                      {editMode === project._id ? (
                        <input
                          autoFocus
                          type="text"
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleUpdateProjectName(project._id, inputText);
                              setEditMode(null);
                            }
                          }}
                          onBlur={() => {
                            handleUpdateProjectName(project._id, inputText);
                            setEditMode(null);
                          }}
                          className={`btn-base w-full px-2 ${
                            activeProjectId === project._id
                              ? "btn-accent-active"
                              : ""
                          }`}
                        />
                      ) : (
                        <button
                          key={project._id}
                          onClick={() => {
                            onHandleProjectClick(project._id);
                            setActiveProjectId(project._id);
                          }}
                          onDoubleClick={() => setEditMode(project._id)}
                          className={`btn-base w-full px-2 ${
                            activeProjectId === project._id
                              ? "btn-accent-active"
                              : ""
                          }`}
                        >
                          {project.name}
                        </button>
                      )}
                      {hoveredProjectId === project._id ||
                      activeProjectId === project._id ? (
                        <button
                          onClick={() => deleteProject(project._id)}
                          className="btn-base btn-danger justify-center px-1"
                        >
                          <Trash2 />
                        </button>
                      ) : (
                        ""
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="animate-slideInFromLeft flex flex-col gap-4">
                <div>
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setInputText("");
                    }}
                    className="btn-base btn-danger inline-flex px-0 py-0"
                  >
                    <X />
                  </button>
                </div>
                <input
                  className="input-sm"
                  type="text"
                  placeholder="Enter project name..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                {inputText.length > 0 && (
                  <button
                    className="btn-base w-full justify-center"
                    onClick={handleNewProjectSubmit}
                  >
                    Submit
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <div
        className="btn-base btn-danger w-full justify-center"
        onClick={signOut}
      >
        {isSidebarOpen ? "logout" : ""}
        <LogOut />
      </div>
    </div>
  );
}
