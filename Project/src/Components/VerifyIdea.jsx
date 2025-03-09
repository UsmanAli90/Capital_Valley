// components/VerifyIdea.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const VerifyIdea = () => {
  const { hash } = useParams();
  const [idea, setIdea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const response = await fetch(`http://localhost:3000/verify-idea/${hash}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch idea");
        const data = await response.json();
        setIdea(data.idea);
      } catch (err) {
        console.error("Error fetching idea:", err);
        setError("Failed to load the full idea. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchIdea();
  }, [hash]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!idea) return <p>No idea found.</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Full Idea Details</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p><strong>Problem Statement:</strong> {idea.problem}</p>
        <p><strong>Solution:</strong> {idea.solution}</p>
        <p><strong>Niches:</strong> {idea.niches.join(", ")}</p>
        <p><strong>Money Looking to Raise:</strong> {idea.costRange}</p>
        <p><strong>Company Name:</strong> {idea.companyName}</p>
        {idea.companyUrl && (
          <p><strong>Company URL:</strong> <a href={idea.companyUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600">{idea.companyUrl}</a></p>
        )}
        {idea.productLink && (
          <p><strong>Product Link:</strong> <a href={idea.productLink} target="_blank" rel="noopener noreferrer" className="text-blue-600">{idea.productLink}</a></p>
        )}
        <p><strong>Location:</strong> {idea.companyLocation}</p>
        <p><strong>Active Users:</strong> {idea.activeUsers}</p>
        <p><strong>Working Full-Time:</strong> {idea.isFullTime}</p>
      </div>
    </div>
  );
};

export default VerifyIdea;