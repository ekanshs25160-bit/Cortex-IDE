import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ExplorerPanel from "./components/ExplorerPanel";
import UtilityBar from "./components/UtilityBar";
import EditorCanvas from "./components/EditorCanvas";
import Footer from "./components/Footer";
import DecisionMemory from "./components/DecisionMemory";
import ArchitectureCanvas from "./components/ArchitectureCanvas";
import TerminalPanel from "./components/TerminalPanel";
import { useWebContainer } from "./hooks/useWebContainer";

const defaultWorkspace = {
  id: 'root',
  name: 'Root',
  type: 'folder',
  children: [
    {
      id: '1',
      name: 'index.html',
      type: 'file',
      content: '<!DOCTYPE html>\n<html>\n<head><title>Cortex Project</title></head>\n<body>\n  <h1>Hello Cortex</h1>\n</body>\n</html>',
      memories: []
    },
    {
      id: '2',
      name: 'styles.css',
      type: 'file',
      content: 'body {\n  background-color: #09090b;\n  color: #fafafa;\n}',
      memories: []
    }
  ]
};

export const transformFilesToWebContainerJSON = (node) => {
  if (node.type === 'file') {
    return {
      file: {
        contents: node.content
      }
    };
  } else if (node.type === 'folder' || !node.type) { 
    const directory = {};
    if (node.children) {
      node.children.forEach(child => {
        directory[child.name] = transformFilesToWebContainerJSON(child);
      });
    }
    return node.id === 'root' ? directory : { directory };
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState("script.py");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);

  const { webcontainerInstance, status } = useWebContainer();

  const [fileSystem, setFileSystem] = useState(() => {
    const savedFileSystem = localStorage.getItem('cortex_workspace_fs');
    return savedFileSystem ? JSON.parse(savedFileSystem) : defaultWorkspace;
  });

  const [activeFileId, setActiveFileId] = useState('1');
  const [viewMode, setViewMode] = useState("editor");
  const [architectureEdges, setArchitectureEdges] = useState([]);

  useEffect(() => {
    localStorage.setItem('cortex_workspace_fs', JSON.stringify(fileSystem));
  }, [fileSystem]);

  const findFileInTree = (node, id) => {
    if (node.id === id && node.type === 'file') return node;
    if (node.children) {
      for (const child of node.children) {
        const found = findFileInTree(child, id);
        if (found) return found;
      }
    }
    return null;
  };

  const activeFile = findFileInTree(fileSystem, activeFileId);

  const addItemToTree = (parentNode, targetParentId, newItem) => {
    if (parentNode.id === targetParentId && (parentNode.type === 'folder' || parentNode.id === 'root')) {
      return {
        ...parentNode,
        children: [...(parentNode.children || []), newItem]
      };
    }
    if (parentNode.children) {
      return {
        ...parentNode,
        children: parentNode.children.map(child => addItemToTree(child, targetParentId, newItem))
      };
    }
    return parentNode;
  };

  const createNewItem = (type, name, parentId = 'root') => {
    if (!name) return;
    const isFile = type === 'file';
    const newItem = {
      id: Date.now().toString(),
      name: name,
      type: type,
      ...(isFile ? { content: '', memories: [] } : { children: [] })
    };

    setFileSystem(prevTree => addItemToTree(prevTree, parentId, newItem));
    
    if (isFile) {
      setActiveFileId(newItem.id);
    }
  };

  const removeItemFromTree = (node, targetId) => {
    if (node.children) {
      return {
        ...node,
        children: node.children
          .filter(child => child.id !== targetId)
          .map(child => removeItemFromTree(child, targetId))
      };
    }
    return node;
  };

  const deleteFile = (idToDelete, e) => {
    if (e) e.stopPropagation();
    setFileSystem(prevTree => removeItemFromTree(prevTree, idToDelete));
    if (activeFileId === idToDelete) {
      setActiveFileId(null);
    }
  };

  const updateFileContentInTree = (node, targetId, newContent) => {
    if (node.id === targetId && node.type === 'file') {
      return { ...node, content: newContent };
    }
    if (node.children) {
      return {
        ...node,
        children: node.children.map(child => updateFileContentInTree(child, targetId, newContent))
      };
    }
    return node;
  };

  const updateCode = (newText) => {
    if (!activeFileId) return;
    setFileSystem(prevTree => updateFileContentInTree(prevTree, activeFileId, newText));
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 150);
  };

  const toggleMemory = () => {
    setIsMemoryOpen((prev) => !prev);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 150);
  };

  const handleOverlayClick = () => {
    if (isSidebarOpen) toggleSidebar();
    if (isMemoryOpen) toggleMemory();
  };

  const handleIntentMode = async (predefinedIntent = null) => {
    if (!activeFile) return;

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
          language: activeFile.name.split('.').pop(), 
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

        setFileSystem(prevTree => {
          const updateMemoryAndContent = (node, targetId, newContent, memory) => {
            if (node.id === targetId && node.type === 'file') {
              return { ...node, content: newContent, memories: [...(node.memories || []), memory] };
            }
            if (node.children) {
              return { ...node, children: node.children.map(child => updateMemoryAndContent(child, targetId, newContent, memory)) };
            }
            return node;
          };
          return updateMemoryAndContent(prevTree, activeFileId, data.optimizedCode, newMemory);
        });
      }
    } catch (error) {
      console.error("Error in intent mode", error);
    }
  };

  const analyzeCodebase = async () => {
    try {
      const flatFiles = [];
      const gatherFiles = (node) => {
        if (node.type === 'file') flatFiles.push(node);
        if (node.children) node.children.forEach(gatherFiles);
      };
      gatherFiles(fileSystem);

      const response = await fetch("https://cortex-ide.onrender.com/api/ai/analyze-map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: flatFiles }),
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
  }, [viewMode, fileSystem]);

  useEffect(() => {
    if (status === 'ready' && webcontainerInstance) {
      console.log("WebContainer successfully booted inside WebAssembly!");
      
      const virtualFiles = transformFilesToWebContainerJSON(fileSystem);
      webcontainerInstance.mount(virtualFiles).catch(err => {
        console.error("Failed to mount virtual files to WebContainer:", err);
      });
    }
  }, [status, webcontainerInstance, fileSystem]);

  const showOverlay = isSidebarOpen || isMemoryOpen;

  return (
    <div className="h-screen w-screen bg-surface-container-lowest text-on-surface flex flex-col font-sans overflow-hidden selection:bg-accent/30">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onIntentClick={handleIntentMode}
        onToggleExplorer={toggleSidebar}
        onToggleMemory={toggleMemory}
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
            fileSystem={fileSystem}
            activeFileId={activeFileId}
            onSelectFile={(id) => {
              setActiveFileId(id);
              if (window.innerWidth < 768) setIsSidebarOpen(false);
            }}
            onCreateItem={createNewItem}
          />
        </div>

        <section className="flex-1 flex flex-col min-w-0 bg-surface relative">
          <UtilityBar
            viewMode={viewMode}
            setViewMode={setViewMode}
            onIntentClick={handleIntentMode}
            activeFile={activeFile}
          />
          <div className="flex-1 min-h-0 flex flex-col">
            {viewMode === "editor" ? (
              <EditorCanvas activeFile={activeFile} onCodeChange={updateCode} />
            ) : (
              <ArchitectureCanvas files={fileSystem} edges={architectureEdges} />
            )}
          </div>
          <div className="h-48 border-t border-zinc-800 shrink-0">
            <TerminalPanel webcontainerInstance={webcontainerInstance} />
          </div>
        </section>

        <div
          className={`
            fixed md:relative top-0 right-0 h-full z-30
            transition-transform duration-300 ease-in-out
            ${isMemoryOpen ? "translate-x-0" : "translate-x-full"}
            ${isMemoryOpen ? "md:block" : "md:hidden"}
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
