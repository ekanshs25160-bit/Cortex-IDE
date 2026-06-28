import React from 'react';
import Editor from '@monaco-editor/react';
import { getLanguageFromExtension } from './ExplorerPanel';
export default function EditorCanvas({ activeFile, onCodeChange }) {
  
  function handleEditorChange(value) {
    onCodeChange(value);
  }

  if (!activeFile) {
    return (
      <div className="flex-1 bg-zinc-950 flex items-center justify-center text-zinc-500 w-full h-full">
        Select a file to start coding in Nexus
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full"> 
      <Editor
        height="100%" 
        path={activeFile.name} 
        language={getLanguageFromExtension(activeFile.name)} 
        value={activeFile.content} 
        theme="vs-dark"
        onChange={handleEditorChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 10 },
        }}
      />
    </div>
  );
}