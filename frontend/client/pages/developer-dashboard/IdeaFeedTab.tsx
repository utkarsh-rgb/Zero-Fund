import { Link } from "react-router-dom";
import { Search, Eye, Send, Bookmark, Shield, Loader2} from "lucide-react";
import { Idea } from "./types";
import { StageBadge } from "./Badges";

interface IdeaFeedTabProps {
  ideas: Idea[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  toggleBookmark: (idea: Idea) => void;
  loading:boolean

}

export default function IdeaFeedTab({
  ideas,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  toggleBookmark,
  loading
}: IdeaFeedTabProps) {


  /* 🔄 LOADER */
  const SkeletonCard = () => (
  <div className="p-4 bg-white rounded-xl shadow animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
  </div>
);

if (loading) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(6)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}


  /* 📭 EMPTY STATE */
  if (!loading && ideas.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-20">
        <h2 className="text-lg font-semibold mb-2">No ideas found</h2>
        <p>Try adjusting your search or filters.</p>
      </div>
    );
  }
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy mb-2">Startup Ideas</h1>
        <p className="text-gray-600">
          Discover exciting startup opportunities and earn equity for your contributions
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search startup ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-skyblue focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer focus:ring-2 focus:ring-skyblue"
            ><option value="latest">Newest</option>
<option value="oldest">Oldest</option>
<option value="equityHigh">Equity (High → Low)</option>
<option value="equityLow">Equity (Low → High)</option>
<option value="stage">Stage</option>

            </select>
          </div>
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="grid gap-6">
        {ideas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} toggleBookmark={toggleBookmark} />
        ))}
      </div>
    </div>
  );
}

interface IdeaCardProps {
  idea: Idea;
  toggleBookmark: (idea: Idea) => void;
}

function IdeaCard({ idea, toggleBookmark }: IdeaCardProps) {


  const formatPercentage = (value: string | number) => {
  if (value === null || value === undefined) return "0%";

  // Extract first valid number (handles "s4%", "4%", "abc4.5xyz")
  const match = String(value).match(/(\d+(\.\d+)?)/);

  if (!match) return "0%";

  const num = parseFloat(match[1]);

  // Remove .0 if integer, keep 1 decimal if needed
  return `${num % 1 === 0 ? num : num.toFixed(1)}%`;
};

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div>
            <h3 className="text-lg font-semibold text-navy">{idea.title}</h3>
            <p className="text-sm text-gray-600">by {idea.fullName}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StageBadge stage={idea.stage} />

          {idea.level === 1 && (
            <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
              🟡 Open for Developer
            </span>
          )}

          {idea.level === 2 && (
            <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
              🔵 Collaboration Matched
            </span>
          )}

          {idea.level === 3 && (
            <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              🟢 Startup Launched
            </span>
          )}

          {idea.isNDA && (
            <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 border border-orange-200">
              🔒 NDA Required
            </span>
          )}

          <button
            onClick={() => toggleBookmark(idea)}
            className="ml-1 p-2 rounded-full text-gray-400 hover:text-skyblue hover:bg-skyblue/10 transition-colors"
            title="Bookmark idea"
          >
            <Bookmark
              className={`w-5 h-5 ${idea.isBookmarked ? "fill-current text-skyblue" : ""}`}
            />
          </button>
        </div>
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
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>Equity: {formatPercentage(idea.equity_offering)}</span>

          <span>
            {new Date(idea.created_at).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="flex space-x-2">
          <Link
            to={`/idea-details/${idea.id}`}
            className="flex items-center space-x-1 px-3 py-1 text-skyblue hover:bg-skyblue/10 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>{idea.isNDA && !idea.hasAcceptedNDA ? "Sign NDA & View" : "View Details"}</span>
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
  );
}
