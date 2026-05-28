import { debugEmbeddingModelsAction } from "@/app/actions/debugEmbedding";

export default async function DebugPage() {
  const result = await debugEmbeddingModelsAction();
  return (
    <div className="p-8 font-mono text-sm">
      <h1 className="text-2xl font-bold mb-6">Embedding Models Debug</h1>
      <pre className="bg-gray-100 p-4 rounded-xl overflow-auto whitespace-pre-wrap">
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}
