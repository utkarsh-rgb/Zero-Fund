import "./global.css";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import { isLoggedIn } from "./helper/auth";
import RedirectIfAuth from "./RedirectIfAuth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EditIdea from "./pages/EditIdea";

const queryClient = new QueryClient();

// Protected route helper

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const location = useLocation();

  // If no user data, redirect to login
  if (!userData?.userType) return <Navigate to="/login" replace />;

  // Prevent entrepreneur from accessing developer dashboard
  if (
    userData.userType === "entrepreneur" &&
    location.pathname === "/developer-dashboard"
  ) {
    return <Navigate to="/entrepreneur-dashboard" replace />;
  }

  // Prevent developer from accessing entrepreneur dashboard
  if (
    userData.userType === "developer" &&
    location.pathname === "/entrepreneur-dashboard"
  ) {
    return <Navigate to="/developer-dashboard" replace />;
  }

  // Authorized, render the children
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
            <Route path="/" element={<Index />} />
            <Route
              path="/entrepreneur-signup"
              element={<EntrepreneurSignup />}
            />
            <Route path="/developer-signup" element={<DeveloperSignup />} />
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

            {/* Dashboards */}
            <Route
              path="/developer-dashboard"
              element={
                <ProtectedRoute>
                  <DeveloperDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/entrepreneur-dashboard"
              element={
                <ProtectedRoute>
                  <EntrepreneurDashboard />
                </ProtectedRoute>
              }
            />
<Route
          path="/edit-idea/:id"
          element={
            <ProtectedRoute>
              <EditIdea />
            </ProtectedRoute>
          }
        />
            {/* Profile routes */}
            <Route
              path="/developer-profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/entrepreneur-profile"
              element={
                <ProtectedRoute>
                  <EntrepreneurProfile />
                </ProtectedRoute>
              }
            />

            {/* Other pages */}
            <Route path="/idea-details" element={<IdeaDetails />} />
            <Route path="/proposal-submit" element={<ProposalSubmit />} />
            <Route path="/chat-collaboration" element={<ChatCollaboration />} />
            <Route path="/contract-review" element={<ContractReview />} />
            <Route
              path="/contribution-tracker"
              element={<ContributionTracker />}
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
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
