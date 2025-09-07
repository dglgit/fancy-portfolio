// components/ChatWithCitations.tsx

import { useState } from "react";

export function ChatWithCitations() {
  const [query, setQuery] = useState("");
  const [ans, setAns] = useState<{ answer: string; citationMap: Record<number,string> } | null>(null);
  const [showCits, setShowCits] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submitChat() {
    setLoading(true);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    setAns(data);
    setShowCits(false);
    setLoading(false);
  }

  return (
    <div>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.currentTarget.value)}
        placeholder="Ask your question…"
        disabled={loading}
      />
      <button onClick={submitChat} disabled={loading}>
        {loading ? "Thinking…" : "Send"}
      </button>
      {ans && (
        <>
          <div className="prose whitespace-pre-wrap">{ans.answer}</div>
          <button onClick={() => setShowCits(!showCits)} className="mt-2 text-blue-600">
            {showCits ? "Hide citations" : "Show citations"} ({Object.keys(ans.citationMap).length})
          </button>
          {showCits && (
            <ol className="pl-5 text-sm text-gray-600">
              {Object.entries(ans.citationMap).map(([n, src]) => (
                <li key={n}>
                  <strong>[{n}]</strong> {src}
                </li>
              ))}
            </ol>
          )}
        </>
      )}
    </div>
  );
}
