import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ExplorerPanel from "./components/ExplorerPanel";
import UtilityBar from "./components/UtilityBar";
import EditorCanvas from "./components/EditorCanvas";
import TerminalPanel from "./components/TerminalPanel";
import Footer from "./components/Footer";

const initialFiles = [
  { id: 1, name: "index.html", language: "html", content: "<h1>Hello</h1>" },
];
export default function App() {
  const [activeTab, setActiveTab] = useState("script.py");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [files, setFiles] = useState(initialFiles);
  const [activeFile, setActiveFile] = useState(initialFiles[0]);

  const updateCode = (newCode) => {
    if (!activeFile) return;

    // 1. Update the 'files' array so the change is permanent
    const updatedFiles = files.map((file) =>
      file.id === activeFile.id ? { ...file, content: newCode } : file,
    );
    setFiles(updatedFiles);

    setActiveFile({ ...activeFile, content: newCode });
  };

  const createFile = () => {
    const name = prompt("Enter file name (e.g. script.js):");
    if (!name) return; // Exit if they hit cancel

    const newFile = {
      id: Date.now(),
      name: name,
      language: name.endsWith(".py") ? "python" : "javascript",
      content: "",
    };

    setFiles([...files, newFile]);
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

  return (
    <div className="h-screen w-screen bg-surface-container-lowest text-on-surface flex flex-col font-sans overflow-hidden selection:bg-accent/30">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

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
          <UtilityBar />
          <EditorCanvas
            activeFile={activeFile} // Pass the active file to the editor
            onCodeChange={updateCode}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
