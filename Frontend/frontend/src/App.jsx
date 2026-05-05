import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ExplorerPanel from "./components/ExplorerPanel";
import UtilityBar from "./components/UtilityBar";
import EditorCanvas from "./components/EditorCanvas";
import Footer from "./components/Footer";
import DecisionMemory from "./components/DecisionMemory";
import ArchitectureCanvas from "./components/ArchitectureCanvas";

const initialFiles = [
  { id: 1, name: "index.html", language: "html", content: "<h1>Hello</h1>", memories:[] },
];
export default function App() {
  const [activeTab, setActiveTab] = useState("script.py");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [files, setFiles] = useState(initialFiles);
  const [activeFile, setActiveFile] = useState(initialFiles[0]);

  const [viewMode, setViewMode] = useState("editor");

  const updateCode = (newCode) => {
  if (!activeFile) return;

  // Update the master list
  setFiles(prevFiles => prevFiles.map((file) =>
    file.id === activeFile.id ? { ...file, content: newCode } : file
  ));

  // Update the active view
  setActiveFile(prev => ({ ...prev, content: newCode }));
};

  const createFile = () => {
    const name = prompt("Enter file name (e.g. script.js):");
    if (!name) return;

    const newFile = {
      id: Date.now(),
      name: name,
      language: name.endsWith(".py") ? "python" : "javascript",
      content: "",
      memories: [], // Ensure this is always an empty array, not undefined
    };

    // FIX: Functional update for adding files
    setFiles((prev) => [...prev, newFile]);
    setActiveFile(newFile);
  };

  const deleteFile = (idToDelete, e) => {
    e.stopPropagation();
    const updatedList = files.filter((f) => f.id !== idToDelete);
    setFiles(updatedList);

    if (activeFile?.id === idToDelete && updatedList.length > 0) {
      setActiveFile(updatedList[0]);
    }
  };

  const handleIntentMode = async () => {
    if (!activeFile) return;
    const userIntent = prompt("How should AI help you?");
    if (!userIntent) return;

    try {
      const response = await fetch("http://localhost:5001/api/ai/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: activeFile.content,
          language: activeFile.language,
          intent: userIntent,
        }),
      });

      const data = await response.json();

      if (data.optimizedCode) {
        const newMemory = {
          id: Date.now(),
          action: userIntent,
          timestamp: new Date().toLocaleTimeString(),
        };

        // FIX: Use functional update (prevFiles) to avoid stale state
        setFiles((prevFiles) => {
          const updated = prevFiles.map((f) => {
            if (f.id === activeFile.id) {
              return {
                ...f,
                content: data.optimizedCode,
                memories: [...(f.memories || []), newMemory],
              };
            }
            return f;
          });

          // Sync activeFile immediately after defining updated list
          const currentFile = updated.find((f) => f.id === activeFile.id);
          setActiveFile(currentFile);
          
          return updated;
        });
      }
    } catch (error) {
      console.error("Error in intent mode", error);
    }
  };

  return (
    <div className="h-screen w-screen bg-surface-container-lowest text-on-surface flex flex-col font-sans overflow-hidden selection:bg-accent/30">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} onIntentClick={handleIntentMode} />

      {/* Main Container */}
      <main className="flex-1 flex overflow-hidden relative">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <ExplorerPanel
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          files={files} // Pass the array of files
          onFileClick={setActiveFile} // Pass function to change active file
          onCreate={createFile} // Pass the create function
          onDelete={deleteFile} // Pass the delete function
          activeFileId={activeFile?.id} // So we can highlight the current file
        />
        <section className="flex-1 flex flex-col min-w-0 bg-surface relative">
          <UtilityBar onIntentClick={handleIntentMode}/>
          {viewMode === "editor" ? (
            <EditorCanvas activeFile={activeFile} onCodeChange={updateCode} />
          ) : (
            <ArchitectureCanvas files={files} />
          )}
        </section>
        <DecisionMemory memories={activeFile?.memories} />
      </main>

      <Footer />
    </div>
  );
}
