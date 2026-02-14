import { Link } from "react-router-dom";
import { Plus, FileText, Eye, Edit, Trash } from "lucide-react";
import { Idea } from "./types";
import { getStatusColor, getStatusIcon, getVisibilityIcon } from "./utils";

interface IdeasTabProps {
  ideas: Idea[];
  handleEdit: (id: number) => void;
  handleDelete: (id: number) => void;
  updateLevel: (ideaId: number, flag: number) => void;
  setPreviewIdea: (idea: Idea) => void;
  setIsPreviewOpen: (open: boolean) => void;
}

export default function IdeasTab({
  ideas,
  handleEdit,
  handleDelete,
  updateLevel,
  setPreviewIdea,
  setIsPreviewOpen,
}: IdeasTabProps) {
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy mb-2">My Ideas</h1>
          <p className="text-gray-600">
            Manage your startup ideas and track their performance
          </p>
        </div>
        <Link
          to="/post-idea"
          className="bg-skyblue text-white px-4 py-2 rounded-lg hover:bg-navy transition-colors font-semibold flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Idea</span>
        </Link>
      </div>

      {/* Ideas List */}
      <div className="grid gap-6">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            {/* Top Row */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-navy">{idea.title}</h3>
                  <span
                    className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      idea.status || "Draft"
                    )}`}
                  >
                    {getStatusIcon(idea.status || "Draft")}
                    <span>{idea.status || "Draft"}</span>
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {idea.stage}
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center space-x-1">
                    {getVisibilityIcon(idea.visibility)}
                    <span>{idea.visibility}</span>
                  </span>
                  <span>•</span>
                  <span>Equity: {idea.equity_offering}%</span>
                  <span>•</span>
                  <span>
                    Created:{" "}
                    {new Date(idea.updated_at).toLocaleString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <select
                  value={idea.flag}
                  onChange={(e) => updateLevel(idea.id, Number(e.target.value))}
                  className="px-2 py-1 text-sm border rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-skyblue"
                >
                  <option value={1}>Open For Developer</option>
                  <option value={2}>Collaboration Matched</option>
                  <option value={3}>Startup Launched</option>
                </select>

                <button
                  onClick={() => handleEdit(idea.id)}
                  className="p-2 text-gray-400 hover:text-skyblue transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(idea.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Skills Required</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {idea.required_skills?.flat().map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full max-w-[120px] truncate"
                      title={skill}
                    >
                      {skill}
                    </span>
                  ))}
                  {!idea.required_skills?.length && (
                    <span className="text-gray-400">No skills listed</span>
                  )}
                </div>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {idea.attachments?.flat().length || 0}
                </p>
                <p className="text-sm text-gray-500">Attachments</p>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {idea.equity_offering}%
                </p>
                <p className="text-sm text-gray-500">Equity Offered</p>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Last updated:{" "}
                {new Date(idea.updated_at).toLocaleString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </span>

              <div className="flex space-x-2">
                <Link
                  to={`/manage-proposals/${idea.id}`}
                  className="flex items-center space-x-1 px-3 py-1 text-skyblue hover:bg-skyblue/10 rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Proposals</span>
                </Link>

                <button
                  onClick={() => {
                    if (!idea.attachments?.length) {
                      alert("No attachments for this idea");
                      return;
                    }
                    setPreviewIdea(idea);
                    setIsPreviewOpen(true);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 text-skyblue hover:bg-skyblue/10 rounded-lg transition-colors"
                >
                  <Eye className="w-5 h-5" />
                  <span>Preview Attachments</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
