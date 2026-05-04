import React from 'react';
import Editor from '@monaco-editor/react';

export default function EditorCanvas({ activeFile, onCodeChange }) {
  
  // Directly pass the new value to the parent App.jsx
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
        height="100%" // Fill the entire section provided by App.jsx
        path={activeFile.name} // Helps Monaco track multiple files/tabs correctly
        language={activeFile.language} // Dynamic language support
        value={activeFile.content} // Controlled component
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