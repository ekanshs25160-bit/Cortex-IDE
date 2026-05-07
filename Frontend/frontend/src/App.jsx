import React, { useState, useEffect } from "react";
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
    content: "<!-- Start coding in Cortex IDE -->",
    memories: [],
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("script.py");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);

  const [files, setFiles] = useState(initialFiles);
  const [activeFile, setActiveFile] = useState(initialFiles[0]);

  const [viewMode, setViewMode] = useState("editor");
  const [architectureEdges, setArchitectureEdges] = useState([]);

  const handleOverlayClick = () => {
    setIsSidebarOpen(false);
    setIsMemoryOpen(false);
  };

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
    const intentString =
      typeof predefinedIntent === "string" ? predefinedIntent : null;
    const userIntent = intentString || prompt("How should AI help you?");
    if (!userIntent) return;

    try {
      const response = await fetch("https://cortex-ide.onrender.com/api/ai/intent", {
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
          prevFiles.map((f) => (f.id === activeFile.id ? updatedFile : f)),
        );

        setActiveFile(updatedFile);
      }
    } catch (error) {
      console.error("Error in intent mode", error);
    }
  };

  const analyzeCodebase = async () => {
    try {
      const response = await fetch("https://cortex-ide.onrender.com/api/ai/analyze-map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files }),
      });

      const data = await response.json();
      if (data.edges) {
        setArchitectureEdges(data.edges);
      }
    } catch (error) {
      console.error("Failed to analyze codebase architecture:", error);
    }
  };

  useEffect(() => {
    if (viewMode === "map") {
      analyzeCodebase();
    }
  }, [viewMode, files]);

  const showOverlay = isSidebarOpen || isMemoryOpen;

  return (
    <div className="h-screen w-screen bg-surface-container-lowest text-on-surface flex flex-col font-sans overflow-hidden selection:bg-accent/30">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onIntentClick={handleIntentMode}
        onToggleExplorer={() => setIsSidebarOpen((v) => !v)}
        onToggleMemory={() => setIsMemoryOpen((v) => !v)}
        isSidebarOpen={isSidebarOpen}
        isMemoryOpen={isMemoryOpen}
      />

      <main className="flex-1 flex overflow-hidden relative">
        {showOverlay && (
          <div
            className="fixed inset-0 z-20 bg-black/60 md:hidden"
            onClick={handleOverlayClick}
          />
        )}

        <div className="hidden md:flex shrink-0 z-30">
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        </div>

        <div
          className={`
            fixed md:relative top-0 left-0 h-full z-30
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            ${isSidebarOpen ? "md:flex" : "md:hidden"}
            shrink-0
          `}
        >
          <ExplorerPanel
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            files={files}
            onFileClick={(file) => {
              setActiveFile(file);
              setIsSidebarOpen(false);
            }}
            onCreate={createFile}
            onDelete={deleteFile}
            activeFileId={activeFile?.id}
          />
        </div>

        <section className="flex-1 flex flex-col min-w-0 bg-surface relative">
          <UtilityBar
            viewMode={viewMode}
            setViewMode={setViewMode}
            onIntentClick={handleIntentMode}
          />
          {viewMode === "editor" ? (
            <EditorCanvas activeFile={activeFile} onCodeChange={updateCode} />
          ) : (
            <ArchitectureCanvas files={files} edges={architectureEdges} />
          )}
        </section>

        <div
          className={`
            fixed md:relative top-0 right-0 h-full z-30
            transition-transform duration-300 ease-in-out
            ${isMemoryOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
            shrink-0
          `}
        >
          <DecisionMemory
            memories={activeFile?.memories}
            onClose={() => setIsMemoryOpen(false)}
          />
        </div>
      </main>

      <div className="md:hidden shrink-0">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          mobile
        />
      </div>

      <Footer />
    </div>
  );
}
