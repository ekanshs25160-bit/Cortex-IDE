import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

export default function EditorCanvas({ activeFile, onCodeChange }) {
  
  function handleEditorChange(value) {
    onCodeChange(value);
  }

  if (!activeFile) {
    return (
      <div className="flex-1 bg-zinc-950 flex items-center justify-center text-zinc-500 w-full h-full">
        No file selected
      </div>
    );
  }

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        value={activeFile?.content}
        theme="vs-dark"
        onChange={handleEditorChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false }, // Keeps the UI clean as per your design
          scrollBeyondLastLine: false,
          automaticLayout: true, // Crucial for responsive UI resizing
        }}
      />
    </div>
  );
}