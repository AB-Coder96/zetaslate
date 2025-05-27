// src/pages/Post.tsx
import { useParams } from "react-router-dom";

export default function Post() {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4">Post ID: {id}</h2>
      {/* Fetch and display post by ID here */}
    </div>
  );
}
