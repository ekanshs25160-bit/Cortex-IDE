import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css'; // Vital canvas engine terminal base layout rules

export default function TerminalPanel({ webcontainerInstance }) {
  const terminalRef = useRef(null);
  const xtermInstance = useRef(null);
  const fitAddonRef = useRef(null);
  const shellProcessRef = useRef(null);
  const inputWriterRef = useRef(null);
  const onDataDisposableRef = useRef(null);

  useEffect(() => {
    if (!terminalRef.current || !webcontainerInstance) return;

    if (!xtermInstance.current) {
      // 1. Setup Xterm UI Config
    const term = new XTerm({
      cursorBlink: true,
      theme: {
        background: '#09090b', // zinc-950 matching Cortex theme layout
        foreground: '#f4f4f5', // zinc-100
        cursor: '#22d3ee',     // cyan-400
      },
      fontFamily: 'JetBrains Mono, Fira Code, monospace',
      fontSize: 12,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    xtermInstance.current = term;
    fitAddonRef.current = fitAddon;

    }

    const term = xtermInstance.current;
    
    if (shellProcessRef.current) return;

    async function startWebContainerTerminal() {
      // Spawn an internal browser-native bash process
      const shellProcess = await webcontainerInstance.spawn('jsh', {
        terminal: {
          cols: term.cols,
          rows: term.rows,
        }
      });
      shellProcessRef.current = shellProcess;

      // Pipe standard output directly into xterm canvas
      shellProcess.output.pipeTo(new WritableStream({
        write(data) {
          term.write(data);
        }
      }));

      // Pipe interactive user typing straight into the web container process
      const input = shellProcess.input.getWriter();
      inputWriterRef.current = input;
      
      onDataDisposableRef.current = term.onData((data) => {
        input.write(data);
      });
    }

    startWebContainerTerminal();

    const getExecutionCommand = (filename) => {
      const ext = filename.split('.').pop().toLowerCase();
      switch (ext) {
        case 'py':
          return `python3 ${filename}`;
        case 'js':
          return `node ${filename}`;
        case 'cpp':
          return `g++ ${filename} -o ${filename}.out && ./${filename}.out`;
        case 'java':
          return `java ${filename}`;
        default:
          return null;
      }
    };

    const handleRunCommand = (e) => {
      const { filename } = e.detail;
      if (filename && inputWriterRef.current) {
        const cmd = getExecutionCommand(filename);
        if (cmd) {
          inputWriterRef.current.write(cmd + '\r');
        } else {
          term.write(`\r\nCannot execute ${filename}: Unknown extension\r\n`);
        }
      }
    };
    window.addEventListener('run-terminal-command', handleRunCommand);

    const handleResize = () => {
      if (fitAddonRef.current && xtermInstance.current) {
        fitAddonRef.current.fit();
        if (shellProcessRef.current) {
          shellProcessRef.current.resize({
            cols: xtermInstance.current.cols,
            rows: xtermInstance.current.rows
          });
        }
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('run-terminal-command', handleRunCommand);
      // If we completely unmount, we might kill the process, but typically we keep it alive.
    };
  }, [webcontainerInstance]);

  return (
    <div className="h-full w-full bg-zinc-950 flex flex-col select-text">
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-1.5 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>BASH (PTY MODE)</span>
        </div>
      </div>
      <div 
        ref={terminalRef} 
        className="flex-1 p-2 overflow-hidden text-left" 
        style={{ height: 'calc(100% - 28px)' }}
      />
    </div>
  );
}
