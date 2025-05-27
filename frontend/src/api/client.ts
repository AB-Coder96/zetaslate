// src/api/client.ts
import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8000/api/", // Update this when you go live
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
