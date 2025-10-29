from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from YouTubeMusic.Search import Search
import uvicorn
import os

app = FastAPI()

# ✅ CORS allow Netlify domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For testing, can later limit to Netlify domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/search")
async def search(query: str = Query(..., min_length=1)):
    try:
        results = await Search(query, limit=10)
        if not results or not results.get("main_results"):
            return {"status": False, "error": "No results found"}
        return {"status": True, "data": results["main_results"]}
    except Exception as e:
        return {"status": False, "error": str(e)}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080)
