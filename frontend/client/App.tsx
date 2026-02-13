import "./global.css";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Index from "./pages/landingPage/Index";
import NotFound from "./pages/NotFound";
import EntrepreneurSignup from "./pages/EntrepreneurSignup";
import DeveloperSignup from "./pages/DeveloperSignup";
import Login from "./pages/Login";
import DeveloperDashboard from "./pages/developer-dashboard/DeveloperDashboard";
import EntrepreneurDashboard from "./pages/EntrepreneurDashboard";
import IdeaDetails from "./pages/IdeaDetails";
import ProposalSubmit from "./pages/ProposalSubmit";
import ChatCollaboration from "./pages/ChatCollaboration";
import ContractReview from "./pages/ContractReview";
import ContributionTracker from "./pages/ContributionTracker";
import PostIdea from "./pages/PostIdea";
import ManageProposals from "./pages/ManageProposals";
import EntrepreneurChat from "./pages/EntrepreneurChat";
import ContractBuilder from "./pages/ContractBuilder";
import ReviewContributions from "./pages/ReviewContributions";
import CollaborationManagement from "./pages/CollaborationManagement";
import EntrepreneurProfile from "./pages/EntrepreneurProfile";
import Settings from "./pages/settings/Settings";
import Notifications from "./pages/Notifications";
import RedirectIfAuth from "./RedirectIfAuth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EditIdea from "./pages/EditIdea";
import Layout from "./layout/Layout";
import Messages from "./pages/Messages";
import DeveloperMessages from "./pages/DeveloperMessages";
import Analytics from "./pages/Analytics";
import EmailVerification from "./pages/EmailVerification";
import FounderProfile from "./pages/FounderProfile";
import DeveloperProfile from "./pages/DeveloperProfile"
const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const location = useLocation();

  if (!userData?.userType) return <Navigate to="/login" replace />;

  if (
    userData.userType === "entrepreneur" &&
    location.pathname === "/developer-dashboard"
  ) {
    return <Navigate to="/entrepreneur-dashboard" replace />;
  }

  if (
    userData.userType === "developer" &&
    location.pathname === "/entrepreneur-dashboard"
  ) {
    return <Navigate to="/developer-dashboard" replace />;
  }

  return children;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
       <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/entrepreneur-signup" element={<EntrepreneurSignup />} />
        <Route path="/developer-signup" element={<DeveloperSignup />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:role/:token" element={<ResetPassword />} />
        <Route
          path="/login"
          element={
            <RedirectIfAuth>
              <Login />
            </RedirectIfAuth>
          }
        />

        {/* Protected Routes inside Layout */}
        <Route
          element={
            <ProtectedRoute>
              <>
                <Layout /> {/* Fixed header layout */}
              </>
            </ProtectedRoute>
          }
        >
          <Route path="/developer-dashboard" element={<DeveloperDashboard />} />
          <Route path="/entrepreneur-dashboard" element={<EntrepreneurDashboard />} />
          <Route path="/edit-idea/:id" element={<EditIdea />} />
          <Route path="/entrepreneur-profile" element={<EntrepreneurProfile />} />
          <Route path="/idea-details/:id" element={<IdeaDetails />} />
          <Route path="/proposal-submit" element={<ProposalSubmit />} />
          <Route path="/chat-collaboration" element={<ChatCollaboration />} />
          <Route path="/developer-chat" element={<ChatCollaboration />} />
          <Route path="/contract-review" element={<ContractReview />} />
          <Route path="/contribution-tracker" element={<ContributionTracker />} />
          <Route path="/post-idea" element={<PostIdea />} />
          <Route path="/manage-proposals/:id" element={<ManageProposals />} />
          <Route path="/entrepreneur-chat" element={<EntrepreneurChat />} />
          <Route path="/contract-builder" element={<ContractBuilder />} />
          <Route path="/review-contributions" element={<ReviewContributions />} />
          <Route path="/collaboration-management" element={<CollaborationManagement />} />
          <Route path="/settings/:developer_id" element={<Settings />} />
          <Route path="/settings/:entrepreneur_id" element={<Settings />} />
          
          <Route path="/notifications/:developerId" element={<Notifications />} />
          <Route path="/entrepreneur-dashboard/message" element={<Messages/>} />
          <Route path="/developer-dashboard/message" element={<DeveloperMessages/>} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/founder/:id" element={<FounderProfile />} />
          <Route path="/entrepreneur-dashboard/developer-profile/:id" element={<DeveloperProfile />} />

        </Route>

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}