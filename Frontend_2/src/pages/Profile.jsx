import React from "react";
import { useAuth } from "../auth/AuthContext";

export default function Profile() {
  const { user, loading } = useAuth();

  return (
    <section className="page">
      <h1>Profile</h1>

      {loading && <p>Loading…</p>}

      {!loading && !user && (
        <p>
          You’re not logged in. Open the right panel and sign in.
        </p>
      )}

      {!loading && user && (
        <div>
          <p><strong>User:</strong> {user.username}</p>
          <p><strong>ID:</strong> {user.id}</p>
        </div>
      )}
    </section>
  );
}
