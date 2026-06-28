# Cortex IDE 🚀

> *Stop building boring things.* A next-generation, AI-powered code editor designed to go beyond basic auto-completion by offering deep codebase insights, structural intelligence, and **long-term memory**.

## 📖 Overview
Most AI coding tools function as simple "copilots" that autocomplete syntax. **Cortex IDE** is built differently. It treats the codebase as a living product by integrating advanced AI features that help developers optimize logic, visually understand project architecture, and remember the *why* behind every architectural decision — **permanently**, across sessions.

At the core of Cortex IDE is a **microservice architecture**: a Node.js Express orchestrator coordinates with a Python FastAPI memory engine (powered by [Memori](https://github.com/ekanshs25160-bit/Memori)) backed by SQLite via SQLAlchemy, transforming the editor from a stateless tool into a **context-aware, autonomous IDE**.

## ✨ Features

* ⚡ **Intent Mode (RAG-Powered):** Describe what you want in plain English and the AI modifies your code accordingly. Before calling Gemini, the system queries the Memori memory engine to retrieve semantically similar past decisions and injects them as context — giving the AI cross-file awareness and codebase history.

* 🗺️ **Architecture Map:** A visual, interactive map of your project's architecture. The editor reads your directory structure and file imports, passing the context to Gemini to generate a structural dependency graph rendered with React Flow.

* 🧠 **Decision Memory (Persistent):** Every AI refactoring decision is automatically logged to a local SQLite database via the Memori FastAPI microservice. The Decision Memory sidebar fetches these decisions live from the backend — not localStorage — so your team's architectural context is never lost between sessions.

* 🐛 **Smart Error Debugging:** The terminal is connected via a real node-pty WebSocket bridge. When a runtime or compilation error is detected in the output stream, the system automatically queries Memori for historical context on similar errors and emits a fix suggestion back to the client in real-time.

* 💻 **In-Browser Execution (WebContainers):** Run JavaScript/Node.js code directly in the browser using WebContainers (StackBlitz) — no backend sandbox needed for web projects.

* 📁 **Multi-Language Execution:** Run Python, JavaScript, C++, and Java files via the native server-side PTY terminal bridge.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│           React Frontend (Vite)             │
│  Monaco Editor · React Flow · xterm.js      │
│  Deployed on: Vercel                        │
└──────────────┬──────────────────────────────┘
               │ HTTP + WebSocket
┌──────────────▼──────────────────────────────┐
│     Node.js Express Orchestrator            │
│  REST API · WebSocket (node-pty terminal)   │
│  Deployed on: Render (Port 5001)            │
└──────────────┬──────────────────────────────┘
               │ HTTP (localhost:8000)
┌──────────────▼──────────────────────────────┐
│    Memori FastAPI Memory Microservice        │
│  RAG Retrieval · Decision Persistence       │
│  SQLAlchemy + SQLite (cortex_workspace.db)  │
│  Running on: Port 8000                      │
└─────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, TailwindCSS |
| **Editor** | Monaco Editor (`@monaco-editor/react`) |
| **Visualizations** | React Flow / XYFlow |
| **Terminal** | xterm.js + WebSocket (node-pty bridge) |
| **In-Browser Runtime** | WebContainers API (StackBlitz) |
| **Backend Orchestrator** | Node.js, Express, WebSocket (`ws`) |
| **AI Engine** | Google Gemini API (`gemini-1.5-flash`) |
| **Memory Engine** | Python FastAPI + Memori SDK |
| **Database** | SQLite via SQLAlchemy |
| **Frontend Deployment** | Vercel |
| **Backend Deployment** | Render |

## 🚀 Running Locally

### Prerequisites
- Node.js >= 18
- Python >= 3.10
- `pip install fastapi uvicorn memori sqlalchemy`

### 1. Start the Memori Memory Microservice
```bash
cd Backend/memori_engine
python3 main.py
# Runs on http://localhost:8000
```

### 2. Start the Express Backend Orchestrator
```bash
cd Backend
cp .env.example .env  # Add your GEMINI_API_KEY
npm install
npm start
# Runs on http://localhost:5001
```

### 3. Start the React Frontend
```bash
cd Frontend/frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

## ⚙️ Environment Variables

### Backend (`Backend/.env`)
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Python Microservice
The Memori engine reads `GEMINI_API_KEY` from the environment automatically.

## 📝 API Reference

### Express Orchestrator (`:5001`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/intent` | RAG-powered code modification via Gemini |
| `POST` | `/api/ai/analyze-map` | Generate architecture dependency map |
| `WS` | `/socket/terminal` | Real-time PTY terminal bridge |

### Memori Memory Engine (`:8000`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/memory/retrieve` | Semantic search of past decisions (RAG) |
| `POST` | `/api/memory/save` | Persist an AI coding decision |
| `GET` | `/api/memory/all` | Fetch all historical decisions for sidebar |

## 📁 Project Structure
```
Cortex-IDE/
├── Backend/
│   ├── server.js              # Express orchestrator + WebSocket PTY
│   ├── .env                   # GEMINI_API_KEY
│   └── memori_engine/
│       ├── main.py            # FastAPI memory microservice
│       ├── cortex_workspace.db # SQLite long-term memory store
│       └── Memori/            # Memori SDK source
└── Frontend/
    └── frontend/
        ├── src/
        │   ├── App.jsx
        │   ├── components/
        │   │   ├── DecisionMemory.jsx   # Live sidebar from Memori API
        │   │   ├── TerminalPanel.jsx    # xterm.js + PTY bridge
        │   │   ├── EditorCanvas.jsx     # Monaco Editor
        │   │   └── ArchitectureCanvas.jsx # React Flow map
        │   └── hooks/
        │       └── useWebContainer.js
        └── vercel.json        # COOP/COEP headers for WebContainers
```
