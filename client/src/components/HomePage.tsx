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
    <div className="bg-primary flex h-screen w-full overflow-hidden">
      <aside className="shrink-0">
        <SideBar onHandleProjectClick={handleProjectClick} />
      </aside>
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <KanbanBoard activeProjectId={activeProjectId} />
      </main>
    </div>
  );
}
