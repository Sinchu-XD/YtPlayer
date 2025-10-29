from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from YouTubeMusic.Search import Search

app = FastAPI()

# ✅ Allow only your Netlify frontend to access the API
origins = [
    "https://effulgent-crumble-9f243c.netlify.app",  # your frontend domain
    "https://*.netlify.app",  # (optional) allow any Netlify preview
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # only allow frontend origin
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
