import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosLocal from "../api/axiosLocal";

type Idea = {
  id: string;
  title: string;
  overview: string;
  stage: string;
  equity_offering: string;
  visibility: string;
  timeline: string;
  budget: number | null;
  additional_requirements: string;
  required_skills: string[][];
  attachments: { name: string; path: string }[][];
  created_at: string;
};

const EditIdea: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [idea, setIdea] = useState<Idea | null>(null);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        const res = await axiosLocal.get(`/entrepreneur-dashboard/ideas/${id}`);
        setIdea(res.data);
      } catch (err) {
        console.error("Error fetching idea:", err);
      }
    };
    fetchIdea();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!idea) return;
    setIdea({ ...idea, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea) return;

    try {
      await axiosLocal.put(`/entrepreneur-dashboard/ideas/${id}`, idea);
      alert("Idea updated successfully!");
      navigate("/entrepreneur-dashboard");
    } catch (err) {
      console.error("Error updating idea:", err);
    }
  };

  if (!idea) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Edit Idea</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Title</label>
          <input
            type="text"
            name="title"
            value={idea.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Overview</label>
          <textarea
            name="overview"
            value={idea.overview}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Stage</label>
          <input
            type="text"
            name="stage"
            value={idea.stage}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Equity Offering (%)</label>
          <input
            type="text"
            name="equity_offering"
            value={idea.equity_offering}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Visibility</label>
          <input
            type="text"
            name="visibility"
            value={idea.visibility}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Timeline</label>
          <input
            type="text"
            name="timeline"
            value={idea.timeline}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Budget</label>
          <input
            type="number"
            name="budget"
            value={idea.budget || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold">Additional Requirements</label>
          <textarea
            name="additional_requirements"
            value={idea.additional_requirements}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-skyblue text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Idea
        </button>
      </form>
    </div>
  );
};

export default EditIdea;
