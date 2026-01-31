import { useState } from "react";
import KanbanBoard from "./KanbanBoard";
import SideBar from "./SideBar";
import { Id } from "../types/types";

export default function HomePage() {
  const [activeProjectId, setActiveProjectId] = useState<Id | null>(null);

  const handleProjectClick = (id: string | null) => {
    setActiveProjectId(id);
  };

  return (
    <div className="bg-primary flex min-h-screen">
      <SideBar onHandleProjectClick={handleProjectClick} />
      <KanbanBoard activeProjectId={activeProjectId} />
    </div>
  );
}
