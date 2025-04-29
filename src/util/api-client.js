import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:8080", //http://localhost:8080 https://navaxis.ai
  headers: {
    "Content-Type": "application/json", // Default Content-Type for JSON requests
  },
});