import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import EntrepreneurSignup from "./pages/EntrepreneurSignup";
import DeveloperSignup from "./pages/DeveloperSignup";
import Login from "./pages/Login";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import IdeaDetails from "./pages/IdeaDetails";
import ProposalSubmit from "./pages/ProposalSubmit";
import ChatCollaboration from "./pages/ChatCollaboration";
import ContractReview from "./pages/ContractReview";
import ContributionTracker from "./pages/ContributionTracker";
import EntrepreneurDashboard from "./pages/EntrepreneurDashboard";
import PostIdea from "./pages/PostIdea";
import ManageProposals from "./pages/ManageProposals";
import EntrepreneurChat from "./pages/EntrepreneurChat";
import ContractBuilder from "./pages/ContractBuilder";
import ReviewContributions from "./pages/ReviewContributions";
import CollaborationManagement from "./pages/CollaborationManagement";
import EntrepreneurProfile from "./pages/EntrepreneurProfile";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route
              path="/entrepreneur-signup"
              element={<EntrepreneurSignup />}
            />
            <Route path="/developer-signup" element={<DeveloperSignup />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/developer-dashboard"
              element={<DeveloperDashboard />}
            />
            <Route path="/idea-details" element={<IdeaDetails />} />
            <Route path="/proposal-submit" element={<ProposalSubmit />} />
            <Route path="/chat-collaboration" element={<ChatCollaboration />} />
            <Route path="/contract-review" element={<ContractReview />} />
            <Route
              path="/contribution-tracker"
              element={<ContributionTracker />}
            />
            <Route
              path="/entrepreneur-dashboard"
              element={<EntrepreneurDashboard />}
            />
            <Route path="/post-idea" element={<PostIdea />} />
            <Route path="/manage-proposals" element={<ManageProposals />} />
            <Route path="/entrepreneur-chat" element={<EntrepreneurChat />} />
            <Route path="/contract-builder" element={<ContractBuilder />} />
            <Route
              path="/review-contributions"
              element={<ReviewContributions />}
            />
            <Route
              path="/collaboration-management"
              element={<CollaborationManagement />}
            />
            <Route
              path="/entrepreneur-profile"
              element={<EntrepreneurProfile />}
            />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
