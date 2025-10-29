import React, { useState } from "react";
import axios from "axios";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Correct backend URL variable name
  const API_URL = import.meta.env.VITE_API_URL || "https://buyer-die-supervision-veterans.trycloudflare.com";

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      // ✅ Fixed variable name (was backendURL before)
      const res = await axios.get(`${API_URL}/search`, {
        params: { query },
      });
      if (res.data.status) setResults(res.data.data);
      else alert(res.data.error);
    } catch (err) {
      alert("Search failed: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mt-4 mb-6">🎵 YouTube Music Search</h1>

      <div className="flex gap-2 w-full max-w-xl">
        <input
          type="text"
          placeholder="Search songs..."
          className="flex-grow px-4 py-2 rounded-lg text-black"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="bg-red-500 px-4 py-2 rounded-lg font-semibold"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="mt-6 grid gap-4 w-full max-w-4xl sm:grid-cols-2 lg:grid-cols-3">
        {results.map((item, i) => (
          <div
            key={i}
            onClick={() => setSelected(item)}
            className="bg-gray-900 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition"
          >
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-3">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.channel_name}</p>
              <p className="text-gray-500 text-xs">
                {item.views} • {item.duration}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-4 rounded-2xl max-w-3xl w-full">
            <button
              onClick={() => setSelected(null)}
              className="float-right text-gray-400 hover:text-white"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-3">{selected.title}</h2>
            <iframe
              className="w-full aspect-video rounded-lg"
              src={selected.url.replace("watch?v=", "embed/")}
              allowFullScreen
              title="player"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
