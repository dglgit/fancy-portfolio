import { z } from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { OpenAIEmbeddings } from "@langchain/openai";
import splitSentences from "sbd";
import path from "path";

const embeddings = new OpenAIEmbeddings({ modelName: "text‑embedding‑ada‑002" });
let retriever;

async function getRetriever() {
  if (!retriever) {
    const indexPath = path.join(process.cwd(), "faiss_multimodal_index");
    retriever = await FaissStore.loadFromPython(indexPath, embeddings);
  }
  return retriever.asRetriever({ k: 5 });
}

const ResponseSchema = z.object({
  answer: z.string(),
  citationMap: z.record(z.number(), z.string()),
});

export async function POST(req: Request) {
  const { query } = await req.json();
  const retr = await getRetriever();
  const docs = await retr.invoke(query);

  let sentenceCounter = 1;
  const citationMap: Record<number, string> = {};
  const contextParts: string[] = [];

  docs.forEach((doc, i) => {
    const sid = i + 1;
    const meta = doc.metadata || {};
    if (meta.image_path && doc.pageContent) {
      contextParts.push(
        `[S${sid}] Image: ${meta.image_path.split("/").pop()}\n > Summary: "${doc.pageContent}"`
      );
    } else {
      const source = `${meta.source?.split("/").pop() || "page"}${meta.page
        ? `, page ${meta.page + 1}`
        : ""}`;
      const sents = splitSentences(doc.pageContent, { newline_boundaries: true });
      const numbered = sents.map((s) => `[${sentenceCounter}] ${s}`);
      numbered.forEach((num, idx) => {
        citationMap[sentenceCounter] = `${source}: ${sents[idx]}`;
        sentenceCounter++;
      });
      contextParts.push(`[S${sid}] ${numbered.join(" ")}`);
    }
  });

  const systemMsg = new SystemMessage(
    `You are an academic assistant. Answer *only* from the sources below. Inline‑cite each sentence you use with [1], [2], …, and if using an entire source without specific sentence, cite with [S1], [S2], etc.`
  );
  const humanMsg = new HumanMessage(
    `--- SOURCES ---\n${contextParts.join("\n\n")}\n\n--- QUESTION ---\n${query}`
  );

  const llm = new ChatGoogleGenerativeAI({
    model: "gemini‑2.5‑Flash",
    temperature: 0,
    maxRetries: 2,
  });

  const response = await llm.invoke([systemMsg, humanMsg]);
  const answer = response.content;

  return new Response(
    JSON.stringify(ResponseSchema.parse({ answer, citationMap })),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
