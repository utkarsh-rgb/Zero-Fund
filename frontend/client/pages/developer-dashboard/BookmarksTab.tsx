import { Link } from "react-router-dom";
import { Eye, Send, Shield } from "lucide-react";
import { Idea } from "./types";
import { StageBadge } from "./Badges";

interface BookmarksTabProps {
  ideas: Idea[];
  toggleBookmark: (idea: Idea) => void;
}

export default function BookmarksTab({ ideas }: BookmarksTabProps) {
  const bookmarkedIdeas = ideas.filter((idea) => idea.isBookmarked);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy mb-2">Bookmarked Ideas</h1>
        <p className="text-gray-600">Ideas you've saved for later review</p>
      </div>

      <div className="grid gap-6">
        {bookmarkedIdeas.map((idea) => (
          <div
            key={idea.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {idea.founderAvatar}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy">{idea.title}</h3>
                  <p className="text-sm text-gray-600">by {idea.fullName}</p>
                </div>
              </div>
              <StageBadge stage={idea.stage} />
            </div>

            <p className="text-gray-600 mb-4">
              {idea.isNDA && !idea.hasAcceptedNDA
                ? idea.shortDescription
                : idea.fullDescription || idea.shortDescription}
            </p>

            {idea.isNDA && !idea.hasAcceptedNDA && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2 text-orange-800">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Full details available after NDA acceptance
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Equity: {idea.equity_offering}</span>
              <div className="flex space-x-2">
                <Link
                  to={`/idea-details/${idea.id}`}
                  className="flex items-center space-x-1 px-3 py-1 text-skyblue hover:bg-skyblue/10 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>
                    {idea.isNDA && !idea.hasAcceptedNDA ? "Sign NDA & View" : "View Details"}
                  </span>
                </Link>
                {(!idea.isNDA || idea.hasAcceptedNDA) && (
                  <Link
                    to={`/proposal-submit?id=${idea.id}`}
                    className="flex items-center space-x-1 px-3 py-1 bg-skyblue text-white rounded-lg hover:bg-navy transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Apply</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
