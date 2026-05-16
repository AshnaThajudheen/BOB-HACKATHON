from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from routes import analyze, history, results

# Load environment variables
load_dotenv()

app = FastAPI(title="AutoDocTest AI Backend")

# Configure CORS for the frontend (Vite defaults to 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analyze.router, tags=["Analyze"])
app.include_router(history.router, tags=["History"])
app.include_router(results.router, tags=["Results"])

@app.get("/")
def read_root():
    return {"message": "Welcome to AutoDocTest AI API"}
