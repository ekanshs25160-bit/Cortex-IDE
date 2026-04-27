# Cortex IDE 🚀

> *Stop building boring things.* A next-generation, AI-powered code editor designed to go beyond basic auto-completion by offering deep codebase insights and structural intelligence.

## 📖 Overview
Most AI coding tools function as simple "copilots" that autocomplete syntax. **Cortex IDE** is built differently. Designed as a standout portfolio project, it treats the codebase as a living product by integrating advanced AI features that help developers optimize logic, visually understand project architecture, and remember the *why* behind architectural decisions.

## ✨ Unique Features
Instead of basic to-do apps or generic e-commerce clones, this editor implements three core standout features:

* ⚡ **Intent Mode:** Instantly optimize files or entire project structures. Select "Optimize this file" and the AI will analyze your code for performance, scalability, and clean code principles, offering a side-by-side diff of suggested improvements.
* 🗺️ **Explain My Codebase:** A visual, interactive map of your project's architecture. The editor reads your directory structure and file imports, passing the context to the AI to generate a structural map rendered using React Flow.
* 🧠 **Decision Memory:** Never forget why a piece of code was written. Highlight any block of code to attach a memory (e.g., *"This was added to avoid React re-renders"*). The AI summarizes and stores these architectural decisions, displaying them as helpful tooltips upon hover.

## 🛠️ Tech Stack
* **Frontend:** [React.js](https://reactjs.org/)
* **Editor Interface:** [Monaco Editor](https://microsoft.github.io/monaco-editor/) (via `@monaco-editor/react`)
* **Visualizations:** [React Flow](https://reactflow.dev/) (for *Explain My Codebase*)
* **Backend:** [Node.js](https://nodejs.org/) with Express.js
* **AI Engine:** [Google Gemini API](https://ai.google.dev/) / OpenAI API / Claude API
* **Database:** MongoDB (for storing *Decision Memories*)

