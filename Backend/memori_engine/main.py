from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session

# Import your custom Memori setup
from memori import Memori
# Assuming your modification allows passing the SQLAlchemy engine/connection string
from memori.storage.adapters.sqlalchemy import Adapter as SQLAlchemyAdapter 

app = FastAPI()

# Enable CORS for the frontend and Express backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_URL = "sqlite:///cortex_workspace.db"
engine = create_engine(DB_URL)

# Initialize Memori with your Gemini API key and custom SQLAlchemy adapter
memori_client = Memori(
    conn=lambda: Session(engine),
    api_key=os.getenv("GEMINI_API_KEY")
)

class IntentRequest(BaseModel):
    intent: str
    active_code: str
    filename: str

class MemorySaveRequest(BaseModel):
    intent: str
    resulting_code: str
    filename: str

@app.post("/api/memory/retrieve")
async def retrieve_context(req: IntentRequest):
    """Searches the codebase vector DB for files related to the user's intent."""
    try:
        # Ask Memori to find related context
        context = memori_client.recall(
            query=req.intent,
            limit=3
        )
        return {"context": str(context)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/memory/save")
async def save_decision(req: MemorySaveRequest):
    """Saves the AI's refactoring decision into permanent long-term memory."""
    try:
        memory_entry = f"[{req.filename}] {req.intent} -> {req.resulting_code[:50]}..."
        # Store in Memori natively
        try:
            memori_client.capture_agent_turn(
                user_content=req.intent, 
                assistant_content=req.resulting_code, 
                project_id="cortex-ide"
            )
        except Exception as e:
            print("Memori capture failed:", e)

        # Also store directly in the memories table for the sidebar UI
        with engine.connect() as conn:
            conn.execute(
                text("CREATE TABLE IF NOT EXISTS memories (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)")
            )
            conn.execute(
                text("INSERT INTO memories (content) VALUES (:content)"),
                {"content": memory_entry}
            )
            conn.commit()

        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/memory/all")
async def get_all_memories():
    """Fetches all historical decisions directly from the SQLite database."""
    try:
        with engine.connect() as conn:
            # Assumes Memori stores memories in a table like 'memories'.
            # If your schema is different, adjust the query accordingly.
            try:
                result = conn.execute(text("SELECT id, content, created_at FROM memories ORDER BY created_at DESC LIMIT 50"))
                memories = [
                    {"id": str(row[0]), "action": row[1], "timestamp": str(row[2])} 
                    for row in result
                ]
            except Exception:
                # Fallback if table name is different or doesn't exist
                memories = []
        return {"memories": memories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)