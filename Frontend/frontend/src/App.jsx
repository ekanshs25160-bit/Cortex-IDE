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
  {
    id: 1,
    name: "index.html",
    language: "html",
    content: "<h1>Hello</h1>",
    memories: [],
  },
];
export default function App() {
  const [activeTab, setActiveTab] = useState("script.py");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [files, setFiles] = useState(initialFiles);
  const [activeFile, setActiveFile] = useState(initialFiles[0]);

  const [viewMode, setViewMode] = useState("editor");

  const updateCode = (newCode) => {
    if (!activeFile) return;

    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === activeFile.id ? { ...file, content: newCode } : file,
      ),
    );

    setActiveFile((prev) => ({ ...prev, content: newCode }));
  };

  const createFile = () => {
    const name = prompt("Enter file name (e.g. script.js):");
    if (!name) return;

    const newFile = {
      id: Date.now(),
      name: name,
      language: name.endsWith(".py") ? "python" : "javascript",
      content: "",
      memories: [],
    };

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

  const handleIntentMode = async (predefinedIntent = null) => {
    if (!activeFile) return;
    
    // Check if the argument is a string (from ToolbarButtons) or an Event object (from regular onClick)
    const intentString = typeof predefinedIntent === 'string' ? predefinedIntent : null;
    
    const userIntent = intentString || prompt("How should AI help you?");
    if (!userIntent) return;

    try {
      const response = await fetch("http://localhost:5001/api/ai/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: activeFile.content || " ",
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

        const updatedFile = {
          ...activeFile,
          content: data.optimizedCode,
          memories: [...(activeFile.memories || []), newMemory],
        };

        setFiles((prevFiles) =>
        prevFiles.map((f) => (f.id === activeFile.id ? updatedFile : f))
        );
           
         
          setActiveFile(updatedFile);
    }
  }
    catch (error) {
      console.error("Error in intent mode", error);
    }
  };

  return (
    <div className="h-screen w-screen bg-surface-container-lowest text-on-surface flex flex-col font-sans overflow-hidden selection:bg-accent/30">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onIntentClick={handleIntentMode}
      />

      <main className="flex-1 flex overflow-hidden relative">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <ExplorerPanel
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          files={files}
          onFileClick={setActiveFile}
          onCreate={createFile}
          onDelete={deleteFile}
          activeFileId={activeFile?.id}
        />
        <section className="flex-1 flex flex-col min-w-0 bg-surface relative">
          <UtilityBar viewMode={viewMode} setViewMode={setViewMode} onIntentClick={handleIntentMode} />
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
